export default function marks(state = {}, action) {
    switch(action.type) {
        case "MARKS_LIST":
            return {...state, marksList: action.payload};
        case "UPDATE_MARK":
            return {...state, updatedMark: action.payload};
        case "CLEAR_MARK":
            return {...state, updatedMark: action.payload};
        case "CLEAR_MARKS_LIST":
            return {...state, marksList: action.payload};

        default:
            return state;
    }
}
