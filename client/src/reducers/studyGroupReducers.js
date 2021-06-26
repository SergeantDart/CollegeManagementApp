export default function studyGroups(state = {}, action) {
    switch(action.type) {
        case "STUDY_GROUPS_LIST":
            return {...state, studyGroupsList: action.payload};
        case "ADD_STUDY_GROUP":
            return {...state, studyGroup: action.payload};
        case "STUDY_GROUPS_MATCHED":
            return {...state, studyGroupsList: action.payload};
        case "GET_STUDY_GROUP":
            return {...state, studyGroup: action.payload};
        case "UPDATE_STUDY_GROUP":
            return {...state, updatedStudyGroup: action.payload};
        case "LAST_STUDY_GROUP_ID":
            return {...state, lastStudyGroupId: action.payload};
        case "CLEAR_LAST_STUDY_GROUP_ID":
            return {...state, lastStudyGroupId: action.payload};
        case "CLEAR_STUDY_GROUP":
            return {...state, studyGroup: action.payload, updatedStudyGroup: action.payload, deletedStudyGroup: action.payload};
        case "CLEAR_STUDY_GROUPS":
            return {...state, studyGroupsList: action.payload};
        case "DELETE_STUDY_GROUP":
            return {...state, deletedStudyGroup: action.payload};
        default:
            return state;
    }
}