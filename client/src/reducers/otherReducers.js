
export default function others(state = {}, action) {
    switch(action.type) {
        case "COUNT_ESENTIALS":
            return {...state, counts: action.payload};
        default:
            return state;
    }
}