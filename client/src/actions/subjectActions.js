import axios from "axios";


export function getSubjects(offset=0, limit=999999) {
    return(dispatch) => {
        axios.get(`/api/getSubjects?offset=${offset}&limit=${limit}`)
        .then(subjectsData => {
            subjectsData = subjectsData.data;
            const payload = {
                subjectsData,
                offset,
                limit
            };
            dispatch({
                type: "SUBJECTS_LIST",
                payload: payload
            });
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getFilteredSubjects(keyword="") {
    return(dispatch) => {
        axios.get(`/api/getFilteredSubjects?keyword=${keyword}`)
        .then(subjectsData => {
            subjectsData = subjectsData.data;
            const payload = {
                subjectsData,
                keyword
            };
            dispatch({
                type: "FILTERED_SUBJECTS_LIST",
                payload: payload
            });
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getSubject(subjectId) {
    return(dispatch) => {
        axios.get(`/api/getSubject/${subjectId}`)
        .then(subject => {
            subject = subject.data;
            dispatch({
                type: "GET_SUBJECT",
                payload: subject
            })
        }).catch(error => {
            console.log(error);
        }) 
    }
}

export function getSubjectByExamId(examId) {
    return(dispatch) => {
        axios.get(`/api/getSubjectByExamId/${examId}`)
        .then(subject => {
            subject = subject.data;
            dispatch({
                type: "GET_SUBJECT",
                payload: subject
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function updateSubject(subjectId, subject) {
    return(dispatch) => {
        axios.post(`/api/updateSubject/${subjectId}`, subject)
        .then(subject => {
            subject = subject.data;
            dispatch({
                type: "UPDATE_SUBJECT",
                payload: subject
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function addSubject(subject) {
    return(dispatch) => {
        axios.post("/api/addSubject", subject)
        .then(response => {
            response = response.data;
            dispatch({
                type: "ADD_SUBJECT",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function deleteSubject(subjectId) {
    const request = axios.delete(`/api/deleteSubject/${subjectId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "DELETE_SUBJECT",
        payload: request
    }
}

export function clearSubject() {
    return {
        type: "CLEAR_SUBJECT",
        payload: null
    }
}

export function clearSubjects() {
    return {
        type: "CLEAR_SUBJECTS",
        payload: null
    }
}




