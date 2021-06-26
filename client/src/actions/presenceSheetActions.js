import axios from "axios";

export function getPresencesByPresenceSheet(presenceSheetId) {
    return(dispatch) => {
        axios.get(`/api/getPresencesByPresenceSheet/${presenceSheetId}`)
        .then(presencesData => {
            presencesData = presencesData.data;
            dispatch({
                type: "PRESENCES_LIST",
                payload: presencesData
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getPresenceSheetsByCourseId(courseId) {
    return(dispatch) => {
        axios.get(`/api/getPresenceSheetsByCourseId/${courseId}`)
        .then(presenceSheets => {
            presenceSheets = presenceSheets.data;
            dispatch({
                type: "PRESENCE_SHEETS_LIST",
                payload: presenceSheets
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

//TODO
export function getStudentPresencesByCourseId(studentId, courseId) {
    return(dispatch) => {
        axios.get(`/api/getStudentPresencesByCourseId/?studentId=${studentId}&courseId=${courseId}`)
        .then(presenceSheets => {
            presenceSheets = presenceSheets.data;
            dispatch({
                type: "PRESENCES_LIST",
                payload: presenceSheets
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function addPresenceSheet(presenceSheet) {
    return(dispatch) => {
        axios.post(`/api/addPresenceSheet`, presenceSheet)
        .then(presenceSheet => {
            presenceSheet = presenceSheet.data;
            dispatch({
                type: "ADD_PRESENCE_SHEET",
                payload: presenceSheet
            })
        }).catch(error => {
            console.log(error);
        });
    }
}

export function deletePresenceSheet(id) {
    return(dispatch) => {
        axios.delete(`/api/deletePresenceSheet/${id}`)
        .then(presenceSheet => {
            presenceSheet = presenceSheet.data;
            dispatch({
                type: "DELETE_PRESENCE_SHEET",
                payload: presenceSheet
            });
        }).catch(error => {
            console.log(error);
        });
    }
}

export function updatePresence(id, presence) {
    return(dispatch) => {
        axios.post(`/api/updatePresence/${id}`, presence)
        .then(presence => {
            presence = presence.data;
            dispatch({
                type: "UPDATE_PRESENCE",
                payload: presence
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function clearPresenceSheet() {
    return {
        type: "CLEAR_PRESENCE_SHEET",
        payload: null
    }
}

export function clearPresences() {
    return {
        type: "CLEAR_PRESENCES",
        payload: null
    }
}

export function clearPresence() {
    return {
        type: "CLEAR_PRESENCE",
        payload: null
    }
}

export function clearPresenceSheetsList() {
    return {
        type: "CLEAR_PRESENCE_SHEETS_LIST",
        payload: null
    }
}