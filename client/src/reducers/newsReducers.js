export default function news(state = {}, action) {
    switch(action.type) {
        case "ADD_NEWS":
            return {...state, news: action.payload};
        case "NEWS_LIST":
            return {...state, newsList: action.payload};
        case "GET_NEWS":
            return {...state, news: action.payload};
        case "UPDATE_NEWS":
            return {...state, updatedNews: action.payload};
        case "DELETE_NEWS":
            return {...state, deletedNews: action.payload};
        case "CLEAR_NEWS_LIST": 
            return {...state, newsList: action.payload};
        case "CLEAR_NEWS":
            return {...state, news: action.payload, updatedNews: action.payload, deletedNews: action.payload};
        default:
            return state;
    }
}
