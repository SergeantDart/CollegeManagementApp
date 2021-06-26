export default function faculties(state = {}, action) {
    switch(action.type) {
        case "FACULTIES_LIST":
            return {...state, facultiesList: action.payload};
        case "CLEAR_FACULTIES":
            return {...state, facultiesList: action.payload};
        default:
            return state;
    }
}
