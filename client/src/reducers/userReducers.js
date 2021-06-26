export default function users(state = {}, action) {
    switch(action.type) {
        case "USER_LOGIN":
            return {...state, login: action.payload};
        case "USER_AUTH":
            return {...state, login: action.payload};
        case "USER_LOGOUT":
            return {...state, login: {type: "logout", ...action.payload}};
        case "UPDATE_USER":
            return {...state, updatedUser: action.payload};
        case "CLEAR_UPDATED_USER":
            return {...state, updatedUser: action.payload};
        default:
            return state;
    }
}