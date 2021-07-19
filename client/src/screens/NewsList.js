import React, {Component} from "react";
import {connect} from "react-redux";
import {getNews, clearNews, getFilteredNews, clearNewsList} from "../actions/newsActions";
import {countEsentials} from "../actions/otherActions";
import News from "../components/News";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class NewsList extends Component {
    state = {
        news: [],
        newsCount: 0,
        offset: 0,
        limit: 8,
        loaded: false,
        dummy: false,
        navButtons: true,
        keyword: ""
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(getNews(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if(nextProps.others.counts) {
            if(nextProps.others.counts.newsCount != null) {

                if(nextProps.news.newsList) {
                    let news = nextProps.news.newsList.newsData;
                    console.log(news);
                    this.setState({
                        news: news,
                        offset: nextProps.news.newsList.offset,
                        limit: nextProps.news.newsList.limit,
                        newsCount: nextProps.others.counts.newsCount,
                        loaded: true
                    });
                }
            }

            if(nextProps.news.deletedNews != null) {
                window.location.reload();
            }

            if(nextProps.news.filteredNewsList) {
                this.setState({
                    news: nextProps.news.filteredNewsList.newsData,
                    offset: 0,
                    loaded: true
                });
            }
        }
    }



    renderNews = (newsList) => {
        return newsList.map(news => {
            return (
                <News key={news.newsId} history={this.props.history} dispatch={this.props.dispatch} news={news}/>
            );
        })
    }



    renderAddNewsButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-news")}>
                    Add news
            </div>
   
        );
    }


    renderNavButtons = () => {
        return (
            <div className="list_nav_buttons">
                <div className="prev" onClick={() => this.loadPrev(this.state.offset, this.state.limit)}>
                    Prev
                </div>
                <div className="next" onClick={() => this.loadNext(this.state.offset, this.state.limit)}>
                    Next
                </div>
            </div>
        )
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.newsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getNews(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getNews(offset - limit, limit));
        }
    }

    changeHandle = (value) => {
        this.setState({
            keyword: value
        });

        this.props.dispatch(clearNewsList());

        if(value != "") {
            if(value.length >= 3 && this.state.keyword.length <= value.length) {
                setTimeout(() => { 
                    this.props.dispatch(getFilteredNews(value));
                    this.setState({
                        navButtons: false,
                    });
                }, 500);
            }
        } else {
            this.props.dispatch(getNews(this.state.offset, this.state.limit));
            this.setState({
                navButtons: true,
                loaded: false
            });
        }
    }

    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>News list</h1>
                    
                    {this.renderAddNewsButton()}

                    <FontAwesomeIcon id="search_icon" icon={faSearch}/>
                    <input className="search_input" value={this.state.keyword} onChange={(event) => this.changeHandle(event.target.value)} placeholder="Enter keyword..."/>

                    <div>

                        {this.state.news.length > 0 ? this.renderNews(this.state.news) : <div className="message">No news published yet.</div>}

                    </div>

                    {this.state.news.length > 0 && this.state.navButtons ? this.renderNavButtons() : null}

                </div>

            );
        } else {
            return (
                <div className="loader"/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        news: state.news,
        others: state.others
    }
}

export default connect(mapStateToProps)(NewsList);