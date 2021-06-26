export default function students(state = {}, action) {
    switch(action.type) {
        case "STUDENTS_LIST":
            return {...state, studentsList: action.payload};
        case "ADD_STUDENT":
            return {...state, student: action.payload};
        case "UPDATE_STUDENT":
            return {...state, updatedStudent: action.payload};
        case "CLEAR_STUDENT":
            return {...state, student: action.payload, updatedStudent: action.payload, deletedStudent: action.payload};
        case "GENERATE_STUDY_GROUPS":
            return {...state, generatedStudyGroups: action.payload};
        case "GET_STUDENT":
            return {...state, student: action.payload};
        case "CLEAR_STUDENTS_LIST":
            return {...state, studentsList: action.payload};
        case "DELETE_STUDENT":
            return {...state, deletedStudent: action.payload};
        default:
            return state;
    }
}
