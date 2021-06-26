import axios from "axios";


export function getStudents(offset=0, limit=9999, type="") {
    return(dispatch) => {
        axios.get(`/api/getStudents?offset=${offset}&limit=${limit}`)
        .then(studentsData => {
            studentsData = studentsData.data;
            const payload = {
                studentsData,
                offset,
                limit,
                type
            };
            dispatch({
                type: "STUDENTS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getStudentByEmail(email) {
    return(dispatch) => {
        axios.get(`/api/getStudentByEmail/${email}`)
        .then(student => {
            student = student.data;
            if(student) {
                dispatch({
                    type: "GET_STUDENT",
                    payload: student
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getStudent(id) {
    return(dispatch) => {
        axios.get(`/api/getStudent/${id}`)
        .then(student => {
            student = student.data;
            if(student) {
                dispatch({
                    type: "GET_STUDENT",
                    payload: student
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getStudentsByStudyGroup(studyGroupId) {
    return(dispatch) => {
        axios.get(`/api/getStudentsByStudyGroup/${studyGroupId}`)
        .then(students => {
            students = students.data;
            if(students) {
                dispatch({
                    type: "STUDENTS_LIST",
                    payload: students
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function clearStudentsList() {
    return {
        type: "CLEAR_STUDENTS_LIST",
        payload: null
    }
}

export function addStudent(student) {
    return(dispatch) => {
        axios.post("/api/addStudent", student)
        .then(response => {
            response = response.data;
            dispatch({
                type: "ADD_STUDENT",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function updateStudent(id, student) {
    return(dispatch) => {
        axios.post(`/api/updateStudent/${id}`, student)
        .then(response => {
            response = response.data;
            dispatch({
                type: "UPDATE_STUDENT",
                payload: response
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function generateStudyGroups() {
    return(dispatch) => {
        axios.get("/api/generateStudyGroups")
        .then(response => {
            response = response.data;
            dispatch({
                type: "GENERATE_STUDY_GROUPS",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        }) 
    }
}

export function clearStudent() {
    return {
        type: "CLEAR_STUDENT",
        payload: null
    }
}

export function clearStudents() {
    return {
        type: "CLEAR_STUDENTS_LIST",
        payload: null
    }
}

export function deleteStudent(id) {
    return(dispatch) => {
        axios.delete(`/api/deleteStudent/${id}`)
        .then(response => {
            response = response.data;
            dispatch({
                type: "DELETE_STUDENT",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}