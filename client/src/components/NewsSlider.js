import React, {Component} from "react";
import {firebase} from "../Firebase";
import {getNews, clearNewsList} from "../actions/newsActions";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Slick from "react-slick";
import moment from "moment";


class NewsSlider extends Component {

    state = {
        news: [],
        isLoaded: false,
        settings: {
            dots: true,
            infinite: false,
            arrows: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        }
    };


    componentWillMount() {
        this.props.dispatch(clearNewsList());
        this.props.dispatch(getNews());
    }

    getImageURL = (item, callback) => {
        firebase.storage().ref("pictures").child(item.newsPicturePath).getDownloadURL()
        .then((url) => {
            item.src = url;
            callback();                 
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.news.newsList) {
            let news = nextProps.news.newsList.newsData;
            let asyncRequests = news.map((item, index) => {
                return new Promise((resolve) => {
                    this.getImageURL(item, resolve);
                });
            })

            Promise.all(asyncRequests).then(() => {
                this.setState({
                    news: news,
                    isLoaded: true
                });
            });
        }
    }

    renderSliderOptions = (news) => {
        console.log(news);
        return news.map((item, index) => {
            return (
                <div key={index}>
                    <div className="featured_item">
                        <div 
                            className="featured_image"
                            style={{
                                background: `url("${item.src}")`
                            }}>
                            <Link to={`news/${item.newsId}`}>
                                <div className="featured_caption">
                                    {item.newsTitle}
                                </div>

                                <div className="featured_date">
                                    {moment(item.updatedAt).format("DD-MM-YYYY")}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        })
    }

    render() {
        console.log(this.state);
        if(this.state.isLoaded) {
            return (
                <div className="slider">
                    <Slick {...this.state.settings}>
                        {this.renderSliderOptions(this.state.news)}
                    </Slick>
                </div>


            );
        }else {
            return (
                <div className="loader"/>
            );
        }

    }
}

function mapStateToProps(state) {
    return {
        news: state.news,
        others: state.others
    }
}

export default connect(mapStateToProps)(NewsSlider);