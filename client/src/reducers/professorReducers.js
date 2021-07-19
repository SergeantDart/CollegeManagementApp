export default function professors(state = {}, action) {
    switch(action.type) {
        case "PROFESSORS_LIST":
            return {...state, professorsList: action.payload};
        case "FILTERED_PROFESSORS_LIST":
            return {...state, filteredProfessorsList: action.payload};
        case "ADD_PROFESSOR":
            return {...state, professor: action.payload};
        case "UPDATE_PROFESSOR":
            return {...state, updatedProfessor: action.payload};
        case "CLEAR_PROFESSOR":
            return {...state, professor: action.payload, updatedProfessor: action.payload, deletedProfessor: action.payload};
        case "CLEAR_PROFESSORS":
            return {...state, professorsList: action.payload, filteredProfessorsList: action.payload};
        case "GET_PROFESSOR":
            return {...state, professor: action.payload};
        case "DELETE_PROFESSOR":
            return {...state, deletedProfessor: action.payload};
        default:
            return state;
    }
}
