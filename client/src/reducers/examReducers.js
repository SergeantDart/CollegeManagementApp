export default function exams(state = {}, action) {
    switch(action.type) {
        case "ADD_EXAM":
            return {...state, exam: action.payload};
        case "EXAMS_LIST":
            return {...state, examsList: action.payload};
        case "FILTERED_EXAMS_LIST":
            return {...state, filteredExamsList: action.payload};
        case "GET_EXAM":
            return {...state, exam: action.payload};
        case "UPDATE_EXAM":
            return {...state, updatedExam: action.payload};
        case "DELETE_EXAM":
            return {...state, deletedExam: action.payload};
        case "CLEAR_EXAM":
            return {...state, exam: action.payload, updatedExam: action.payload, deletedExam: action.payload};
        case "CLEAR_EXAMS_LIST":
            return {...state, examsList: action.payload, filteredExamsList: action.payload};
        default:
            return state;
    }
}
