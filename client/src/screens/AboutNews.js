import React, {Component} from "react";
import {firebase} from "../Firebase";
import {getOneNews, clearNews} from "../actions/newsActions";
import {connect} from "react-redux";
import moment from "moment";


class AboutNews extends Component {

    state = {
        news: null,
        imageURL: "",
        error: "",
        isLoaded: false,
    };

    getImageURL = (news) => {
        firebase.storage().ref("pictures").child(news.newsPicturePath).getDownloadURL()
        .then((url) => {
            this.setState({
                news: news,
                imageURL: url,
                isLoaded: true
            })
        })
    }

    componentWillMount() {
        this.props.dispatch(clearNews());
        this.props.dispatch(getOneNews(this.props.match.params.id));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.news.news) {
            console.log(nextProps);
            this.getImageURL(nextProps.news.news);
        }
    }

    render() {
        console.log(this.state);
        if(this.state.isLoaded && this.state.news) {
            return (
                <div className="article_wrapper">
                    <div className="article_info">
                        <div>Date: <span>{moment(this.state.news.updatedAt).format("DD/MM/YYYY")}</span></div>
                        <div>Author: <span>{this.state.news.newsAuthorName}</span></div>
                    </div>
                    <div className={"article_body"}>
                        <h1>{this.state.news.newsTitle}</h1>
                        <div className="article_image"
                            style={{
                                background: `url("${this.state.imageURL}")`
                            }}/>
                        <div 
                            className="article_text" 
                            dangerouslySetInnerHTML={{__html: this.state.news.newsText}}>
                        </div>
                    </div>
            </div>
            );
        }else {
            return (
                <div className="loader"/>
            )
        }

        
    }
}

function mapStateToProps(state) {
    return {
        news: state.news
    }
}

export default connect(mapStateToProps)(AboutNews);

