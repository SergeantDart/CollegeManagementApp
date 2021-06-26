import axios from "axios";

export function countEsentials() {
    
    return(dispatch) => {
        axios.get("/api/countSubjects")
        .then(subjectsCount => {
            subjectsCount = subjectsCount.data;
            axios.get("/api/countProfessors")
            .then(professorsCount => {
                professorsCount = professorsCount.data;
                axios.get("/api/countStudents")
                .then(studentsCount => {
                    studentsCount = studentsCount.data;
                    axios.get("/api/countFaculties")
                    .then(facultiesCount => {
                        facultiesCount = facultiesCount.data;
                        axios.get("/api/countStudyGroups")
                        .then(studyGroupsCount => {
                            studyGroupsCount = studyGroupsCount.data;
                            axios.get("/api/countCourses")
                            .then(coursesCount => {
                                coursesCount = coursesCount.data;
                                axios.get("/api/countNews")
                                .then(newsCount => {
                                    newsCount = newsCount.data;
                                    axios.get("/api/countExams")
                                    .then(examsCount => {
                                        examsCount = examsCount.data;
                                        axios.get("/api/countDepartments")
                                        .then(departmentsCount => {
                                            departmentsCount = departmentsCount.data;
                                            axios.get("/api/countDocuments")
                                            .then(documentsCount => {
                                                documentsCount = documentsCount.data;
                                                dispatch({
                                                    type: "COUNT_ESENTIALS",
                                                    payload: {
                                                        subjectsCount,
                                                        professorsCount,
                                                        studentsCount,
                                                        facultiesCount,
                                                        studyGroupsCount,
                                                        coursesCount,
                                                        examsCount,
                                                        newsCount,
                                                        departmentsCount,
                                                        documentsCount
                                                    }
                                                });
                                            }).catch(error => console.log(error));
                                        }).catch(error => console.log(error));
                                    }).catch(error => console.log(error));
                                }).catch(error => console.log(error));
                            }).catch(error => console.log(error));
                        }).catch(error => console.log(error));
                    }).catch(error => console.log(error));
                }).catch(error => console.log(error));
            }).catch(error => console.log(error));
        }).catch(error => console.log(error)
    )}
}



