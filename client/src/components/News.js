
import React, {Component} from "react";
import {deleteNews} from "../actions/newsActions";
import {firebase} from "../Firebase";
import Swal from "sweetalert2";

class News extends Component {

    state = {
        isLoaded: false,
        picturePath: ""
    }

    getImageURL = (fileName) => {
        firebase.storage().ref("pictures").child(fileName).getDownloadURL()
        .then((url) => {
            this.setState({
                isLoaded: true,
                picturePath: url
            })
        })
    }

    componentWillMount() {
        this.getImageURL(this.props.news.newsPicturePath);
    }

    aboutNewsHandle = (newsId) => {
        this.props.history.push(`/news/${newsId}`);
    }

    deleteNewsHandle = (newsId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will delete the news and all the data asociated with it.',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
          }).then((result) => {
            if (result.isConfirmed) {
              this.props.dispatch(deleteNews(newsId));
            } 
          });
    }

    renderOptions = () => {
        return(
            <div>
                <div className="edit" onClick={() => this.aboutNewsHandle(this.props.news.newsId)}>
                    ABOUT
                </div>
                <div className="delete" onClick={() => this.deleteNewsHandle(this.props.news.newsId)}>
                    DELETE
                </div>
            </div>   
        )
    }

    render() {
        if(this.state.isLoaded) {
            return (
                <div className="card">
                    <img src={this.state.picturePath}/>
                    <div className="container">
                        <h4><b>{this.props.news.newsTitle}</b></h4>
                        <p>by {this.props.news.newsAuthorName}</p>
                        <p>{this.props.news.updatedAt}</p>
                    </div>
                    {this.renderOptions()}
                </div>
            )  
        }else {
            return (
                <div className="loader"/>
            )
        }
    }
    
    
}

export default News;