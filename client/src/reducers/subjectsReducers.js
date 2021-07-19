export default function subjects(state = {}, action) {
    switch(action.type) {
        case "SUBJECTS_LIST":
            return {...state, subjectsList: action.payload};
        case "FILTERED_SUBJECTS_LIST": 
            return {...state, filteredSubjectsList: action.payload};
        case "ADD_SUBJECT":
            return {...state, subject: action.payload};
        case "GET_SUBJECT":
            return {...state, subject: action.payload};
        case "UPDATE_SUBJECT":
            return {...state, updatedSubject: action.payload};
        case "DELETE_SUBJECT":
            return {...state, deletedSubject: action.payload};
        case "CLEAR_SUBJECT":
            return {...state, subject: action.payload, updatedSubject: action.payload, deletedSubject: action.payload};
        case "CLEAR_SUBJECTS":
            return {...state, subjectsList: action.payload, filteredSubjectsList: action.payload};
        default:
            return state;
    }
}