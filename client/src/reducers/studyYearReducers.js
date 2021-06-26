export default function studyYears(state = {}, action) {
    switch(action.type) {
        case "STUDY_YEARS_LIST":
            return {...state, studyYearsList: action.payload};

        default:
            return state;
    }
}