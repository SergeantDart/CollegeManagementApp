export default function presenceSheets(state = {}, action) {
    switch(action.type) {
        case "PRESENCES_LIST":
            return {...state, presencesList: action.payload};
        case "PRESENCE_SHEETS_LIST":
            return {...state, presenceSheetsList: action.payload}
        case "ADD_PRESENCE_SHEET":
            return {...state, presenceSheet: action.payload};
        case "UPDATE_PRESENCE":
            return {...state, updatedPresence: action.payload};
        case "DELETE_PRESENCE_SHEET":
            return {...state, deletedPresenceSheet: action.payload};
        case "CLEAR_PRESENCE_SHEET":
            return {...state, presenceSheet: action.payload, deletedPresenceSheet: action.payload};
        case "CLEAR_PRESENCES":
            return {...state, presencesList: action.payload}
        case "CLEAR_PRESENCE":
            return {...state, updatedPresence: action.payload}
        case "CLEAR_PRESENCE_SHEETS_LIST":
            return {...state, presenceSheetsList: action.payload}
        default:
            return state;
    }
}
