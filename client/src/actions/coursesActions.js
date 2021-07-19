import axios from "axios";


export function addCourse(course) {
    return(dispatch) => {
        axios.post(`/api/addCourse`, course)
        .then(course => {
            course = course.data;
            dispatch({
                type: "ADD_COURSE",
                payload: course
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getCourses(offset=0, limit=9999) {
       return(dispatch) => {
           axios.get(`/api/getCourses?offset=${offset}&limit=${limit}`)
           .then(coursesData => {
               coursesData = coursesData.data;
               const payload = {
                   coursesData,
                   offset,
                   limit
               };
               dispatch({
                   type: "COURSES_LIST",
                   payload: payload
               });
           }).catch(error => {
               console.log(error);
           })
       } 
}

export function getFilteredCourses(keyword = "") {
    return(dispatch) => {
        axios.get(`/api/getFilteredCourses?keyword=${keyword}`)
        .then(coursesData => {
            coursesData = coursesData.data;
            const payload = {
                coursesData,
                keyword
            };
            dispatch({
                type: "KEYWORD_FILTERED_COURSES_LIST",
                payload: payload
            });
        }).catch(error => {
            console.log(error);
        })
    } 
}

export function getCoursesBySubjectId(id) {
    return(dispatch) => {
        axios.get(`/api/getCoursesBySubjectId/${id}`)
        .then(courses => {
            courses = courses.data;
            dispatch({
                type: "COURSES_LIST",
                payload: courses
            });
        }).catch(error => {
            console.log(error);
        })
    } 
}

export function getCoursesByProfessorEmail(email) {
    return(dispatch) => {
        axios.get(`/api/getCoursesByProfessorEmail/${email}`)
        .then(courses => {
            courses = courses.data;
            dispatch({
                type: "FILTERED_COURSES_LIST",
                payload: courses
            });
        }).catch(error => {
            console.log(error);
        })
    } 
}

export function getCoursesByStudentEmail(email) {
    return(dispatch) => {
        axios.get(`/api/getCoursesByStudentEmail/${email}`)
        .then(courses => {
            courses = courses.data;
            dispatch({
                type: "FILTERED_COURSES_LIST",
                payload: courses
            });
        }).catch(error => {
            console.log(error);
        })
    } 
}

export function getCourse(id) {
    return(dispatch) => {
        axios.get(`/api/getCourse/${id}`)
        .then(course => {
            course = course.data;
            if(course) {
                dispatch({
                    type: "GET_COURSE",
                    payload: course
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
}

export function getCoursesByStudyGroup(studyGroupId) {
    return(dispatch) => {
        axios.get(`/api/getCoursesByStudyGroup/${studyGroupId}`)
        .then(courses => {
            courses = courses.data;
            if(courses) {
                dispatch({
                    type: "COURSES_LIST",
                    payload: courses
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getCoursesByProfessorId(professorId) {
    return(dispatch) => {
        axios.get(`/api/getCoursesByProfessorId/${professorId}`)
        .then(courses => {
            courses = courses.data;
            if(courses) {
                dispatch({
                    type: "COURSES_LIST",
                    payload: courses
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function getCoursesByStudentId(studentId) {
    return(dispatch) => {
        axios.get(`/api/getCoursesByStudentId/${studentId}`)
        .then(courses => {
            courses = courses.data;
            if(courses) {
                dispatch({
                    type: "COURSES_LIST",
                    payload: courses
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

export function updateCourse(courseId, course) {
    return(dispatch) => {
        axios.post(`/api/updateCourse/${courseId}`, course)
        .then(response => {
            response = response.data;
            dispatch({
                type: "UPDATE_COURSE",
                payload: response
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function deleteCourse(courseId) {
    return(dispatch) => {
        axios.delete(`/api/deleteCourse/${courseId}`)
        .then(response => {
            response = response.data;
            dispatch({
                type: "DELETE_COURSE",
                payload: response
            });
        }).catch(error => {
            console.log(error);
        })
    }
}

export function clearCoursesList() {
    return {
        type: "CLEAR_COURSES_LIST",
        payload: null
    }
}

export function clearCourse() {
    return {
        type: "CLEAR_COURSE",
        payload: null
    }
}