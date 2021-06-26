export default function courses(state = {}, action) {
    switch(action.type) {
        case "ADD_COURSE":
            return {...state, course: action.payload};
        case "COURSES_LIST":
            return {...state, coursesList: action.payload};
        case "FILTERED_COURSES_LIST":
            return {...state, filteredCoursesList: action.payload};
        case "GET_COURSE":
            return {...state, course: action.payload};
        case "UPDATE_COURSE":
            return {...state, updatedCourse: action.payload};
        case "DELETE_COURSE":
            return {...state, deletedCourse: action.payload};
        case "CLEAR_COURSE":
            return {...state, course: action.payload, updatedCourse: action.payload, deletedCourse: action.payload}

        case "CLEAR_COURSES_LIST":
            return {...state, coursesList: action.payload, filteredCoursesList: action.payload};
        default:
            return state;
    }
}
