export default function departments(state = {}, action) {
    switch(action.type) {
        case "DEPARTMENTS_LIST":
            return {...state, departmentsList: action.payload};
        case "GET_DEPARTMENT":
            return {...state, department: action.payload};
        case "ADD_DEPARTMENT":
            return {...state, department: action.payload};
        case "UPDATE_DEPARTMENT":
            return {...state, updatedDepartment: action.payload};
        case "DELETE_DEPARTMENT":
            return {...state, deletedDepartment: action.payload};
        case "CLEAR_DEPARTMENT":
            return {...state, department: action.payload, updatedDepartment: action.payload, deletedDepartment: action.payload}
        case "CLEAR_DEPARTMENTS_LIST":
            return {...state, departmentsList: action.payload};
        default:
            return state;
    }
}
