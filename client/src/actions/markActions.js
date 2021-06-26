import axios from "axios";

export function getMarksByCourseId(id) {
        const request = axios.get(`/api/getMarks/${id}`)
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
    
        return {
            type: "MARKS_LIST",
            payload: request
        };
}

export function getStudentMarksByStudyYear(studentId, studyYearId) {
    const request = axios.get(`/api/getStudentMarksByStudyYear/?studentId=${studentId}&studyYearId=${studyYearId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "MARKS_LIST",
        payload: request
    };}

export function updateMark(markId, mark) {
    return(dispatch) => {
        axios.post(`/api/updateMark/${markId}`, mark)
        .then(mark => {
            mark = mark.data;
            dispatch({
                type: "UPDATE_MARK",
                payload: mark
            });
        })
        .catch(error => {
            console.log(error);
        })
    }
}

export function clearMark() {
    return {
        type: "CLEAR_MARK",
        payload: null
    }
}

export function clearMarks() {
    return {
        type: "CLEAR_MARKS_LIST",
        payload: null
    }
}