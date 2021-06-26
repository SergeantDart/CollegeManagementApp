import axios from "axios";


export function addNews(news) {
    return(dispatch) => {
        axios.post(`/api/addNews`, news)
        .then(news => {
            news = news.data;
            dispatch({
                type: "ADD_NEWS",
                payload: news
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getNews(offset = 0, limit = 5, type = "") {
    return(dispatch) => {
        axios.get(`/api/getNews?offset=${offset}&limit=${limit}`)
        .then(newsData => {
            newsData = newsData.data;
            const payload = {
                newsData,
                offset,
                limit,
                type
            };
            dispatch({
                type: "NEWS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getOneNews(id) {
    return(dispatch) => {
        axios.get(`/api/getNews/${id}`)
        .then(news => {
            news = news.data;
            if(news) {
                dispatch({
                    type: "GET_NEWS",
                    payload: news
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function updateNews(id, news) {
    return(dispatch) => {
        axios.post(`/api/updateNews/${id}`, news)
        .then(response => {
            response = response.data;
            dispatch({
                type: "UPDATE_NEWS",
                payload: response
            });
        }).catch(error => {
            console.log(error);
        })
    }
}


export function deleteNews(id) {
    return(dispatch) => {
        axios.delete(`/api/deleteNews/${id}`)
        .then(response => {
            response = response.data;
            dispatch({
                type: "DELETE_NEWS",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function clearNews() {
    return {
        type: "CLEAR_NEWS",
        payload: null
    }
}

export function clearNewsList() {
    return {
        type: "CLEAR_NEWS_LIST",
        payload: null
    }
}