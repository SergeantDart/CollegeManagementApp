import axios from "axios";

export function getProfessors(offset=0, limit=9999) {
    return(dispatch) => {
        axios.get(`/api/getProfessors?offset=${offset}&limit=${limit}`)
        .then(professorsData => {
            professorsData= professorsData.data;
            const payload = {
                professorsData,
                offset,
                limit
            };
            dispatch({
                type: "PROFESSORS_LIST",
                payload: payload
            });
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getFilteredProfessors(keyword="") {
    return(dispatch) => {
        axios.get(`/api/getFilteredProfessors?keyword=${keyword}`)
        .then(professorsData => {
            professorsData = professorsData.data;
            const payload = {
                professorsData,
                keyword
            };
            dispatch({
                type: "FILTERED_PROFESSORS_LIST",
                payload: payload
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getProfessorsByDepartmentId(departmentId) {
    return(dispatch) => {
        axios.get(`/api/getProfessorsByDepartmentId/${departmentId}`)
        .then(professors => {
            professors = professors.data;
            if(professors) {
                dispatch({
                    type: "PROFESSORS_LIST",
                    payload: professors
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getProfessorByEmail(email) {
    return(dispatch) => {
        axios.get(`/api/getProfessorByEmail/${email}`)
        .then(professor => {
            professor = professor.data;
            if(professor) {
                dispatch({
                    type: "GET_PROFESSOR",
                    payload: professor
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getProfessor(id) {
    return(dispatch) => {
        axios.get(`/api/getProfessor/${id}`)
        .then(professor => {
            professor = professor.data;
            if(professor) {
                dispatch({
                    type: "GET_PROFESSOR",
                    payload: professor
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function addProfessor(professor) {
    return(dispatch) => {
        axios.post("/api/addProfessor", professor)
        .then(response => {
            response = response.data;
            dispatch({
                type: "ADD_PROFESSOR",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}

export function updateProfessor(id, professor) {
    return(dispatch) => {
        axios.post(`/api/updateProfessor/${id}`, professor)
        .then(response => {
            response = response.data;
            dispatch({
                type: "UPDATE_PROFESSOR",
                payload: response
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function clearProfessor() {
    return {
        type: "CLEAR_PROFESSOR",
        payload: null
    }
}

export function clearProfessors() {
    return {
        type: "CLEAR_PROFESSORS",
        payload: null
    }
}

export function deleteProfessor(id) {
    return(dispatch) => {
        axios.delete(`/api/deleteProfessor/${id}`)
        .then(response => {
            response = response.data;
            dispatch({
                type: "DELETE_PROFESSOR",
                payload: response
            })
        }).catch(error => {
            console.log(error);
        })
    }
}