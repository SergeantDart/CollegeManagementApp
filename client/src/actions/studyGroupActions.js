import axios from "axios";


export function getStudyGroups(offset=0, limit=999999, type="") {
    return(dispatch) => {
        axios.get(`/api/getStudyGroups?offset=${offset}&limit=${limit}`)
        .then(studyGroupsData => {
            studyGroupsData= studyGroupsData.data;
            const payload = {
                studyGroupsData,
                offset,
                limit,
                type
            };
            dispatch({
                type: "STUDY_GROUPS_LIST",
                payload: payload
            });
        }).catch(error => {
            console.log(error);
        });
    }
}

export function addStudyGroup(studyGroup) {
    return(dispatch) => {
        axios.post("/api/addStudyGroup", studyGroup)
        .then(response => {
            response = response.data;
            dispatch({
                type: "ADD_STUDY_GROUP",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getStudyGroup(studyGroupId) {
    return(dispatch) => {
        axios.get(`/api/getStudyGroup/${studyGroupId}`)
        .then(studyGroup => {
            studyGroup = studyGroup.data;
            dispatch({
                type: "GET_STUDY_GROUP",
                payload: studyGroup
            })
        }).catch(error => {
            console.log(error);
        }) 
    }
}

export function updateStudyGroup(studyGroupId, studyGroup) {
    return(dispatch) => {
        axios.post(`/api/updateStudyGroup/${studyGroupId}`, studyGroup)
        .then(studyGroup => {
            studyGroup = studyGroup.data;
            dispatch({
                type: "UPDATE_STUDY_GROUP",
                payload: studyGroup
            })
        }).catch(error => {
            console.log(error);
        })
    }
}


export function getStudyGroupsMatched(studentId) {
    const request = axios.get(`/api/getStudyGroupsMatched?studentId=${studentId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    
    return {
        type: "STUDY_GROUPS_LIST",
        payload: request
    }
}

export function getLastStudyGroupId() {
    const request = axios.get(`/api/getLastStudyGroupId`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "LAST_STUDY_GROUP_ID",
        payload: request
    }
}

export function clearLastStudyGroupId() {
    return {
        type: "CLEAR_LAST_STUDY_GROUP_ID",
        payload: null
    }
}

export function clearStudyGroup() {
    return {
        type: "CLEAR_STUDY_GROUP",
        payload: null
    }
}

export function clearStudyGroups() {
    return {
        type: "CLEAR_STUDY_GROUPS",
        payload: null
    }
}

export function deleteStudyGroup(id) {
    return(dispatch) => {
        axios.delete(`/api/deleteStudyGroup/${id}`)
        .then(response => {
            response = response.data;
            dispatch({
                type: "DELETE_STUDY_GROUP",
                payload: response
            })
        })
        .catch(error => {
            console.log(error);
        });
    }
}


