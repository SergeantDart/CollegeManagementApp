export default function documents(state = {}, action) {
    switch(action.type) {
        case "DOCUMENTS_LIST":
            return {...state, documentsList: action.payload};
        case "FILTERED_DOCUMENTS_LIST":
            return {...state, filteredDocumentsList: action.payload};
        case "GET_DOCUMENT":
            return {...state, document: action.payload};
        case "SEND_DOCUMENT":
            return {...state, document: action.payload};
        case "DELETE_DOCUMENT":
            return {...state, deletedDocument: action.payload};
        case "CLEAR_DOCUMENTS_LIST":
            return {...state, documentsList: action.payload, filteredDocumentsList: action.payload}
        case "CLEAR_DOCUMENT":
            return {...state, document: action.payload, deletedDocument: action.payload};
        default:
            return state;
    }
}
