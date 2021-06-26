import axios from "axios";

export function getExams(offset=0, limit=9999, type="") {
    return(dispatch) => {
        axios.get(`/api/getExams?offset=${offset}&limit=${limit}`)
        .then(examsData => {
            examsData = examsData.data;
            const payload = {
                examsData,
                offset,
                limit,
                type
            };
            dispatch({
                type: "EXAMS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getExam(id) {
    const request = axios.get(`/api/getExam/${id}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "GET_EXAM",
        payload: request
    }
}

export function getExamByCourseId(courseId) {
    const request = axios.get(`/api/getExamByCourseId/${courseId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "GET_EXAM",
        payload: request
    }
}

export function getExamsByProfessorEmail(professorEmail) {
    const request = axios.get(`/api/getExamsByProfessorEmail/${professorEmail}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    })

    return {
        type: "FILTERED_EXAMS_LIST",
        payload: request
    }
}

export function getExamsByStudentEmail(studentEmail) {
    const request = axios.get(`/api/getExamsByStudentEmail/${studentEmail}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    })

    return {
        type: "FILTERED_EXAMS_LIST",
        payload: request
    }
}


export function addExam(exam) {
    const request = axios.post(`/api/addExam`, exam)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "ADD_EXAM",
        payload: request
    }
}

export function updateExam(examId, exam) {
    const request = axios.post(`/api/updateExam/${examId}`, exam)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "UPDATE_EXAM",
        payload: request
    }
}

export function deleteExam(examId) {
    const request = axios.delete(`/api/deleteExam/${examId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "DELETE_EXAM",
        payload: request
    }
}

export function clearExam() {
    return {
        type: "CLEAR_EXAM",
        payload: null
    }
}

export function clearExams() {
    return {
        type: "CLEAR_EXAMS_LIST",
        payload: null
    }
}