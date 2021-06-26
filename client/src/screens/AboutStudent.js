import {Component} from "react";
import {getStudent, updateStudent, clearStudent} from "../actions/studentActions";
import {getFaculties} from "../actions/facultyActions";
import {getStudyGroupsMatched, clearStudyGroups} from "../actions/studyGroupActions";
import {getStudyYears} from "../actions/studyYearActions";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import moment from "moment";
import {Link} from "react-router-dom";
import {clearCoursesList, getCoursesByStudentId} from "../actions/coursesActions";
import {getStudentMarksByStudyYear, clearMarks} from "../actions/markActions";
import {getStudentPresencesByCourseId, clearPresences} from "../actions/presenceSheetActions";

class AboutStudent extends Component {

    state = {
        edit: false,
        loading: true,
        student: {},
        courses: [],
        marks: [],
        presences: [],
        studyYears: [],
        isMarksListLoaded: false,
        isPresenceListLoaded: false,
        selectedStudyYear: "",
        selectedCourse: "",
        error: "",
        formData: {
            studentFirstName: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentFirstName",
                    label: "First name: ",
                    type: "text",
                    placeholder: "Student first name..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentLastName: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentLastName",
                    label: "Last name: ",
                    type: "text",
                    placeholder: "Student last name..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentEmail: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentEmail",
                    label: "Email: ",
                    type: "text",
                    placeholder: "Student email..."
                },
                validation: {
                    required: true,
                    email: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentDob: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentDob",
                    label: "Date of birth: ",
                    placeholder: "Student date of birth..."
                },
                validation: {
                    required: true,
                    date: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentAddress: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentAddress",
                    label: "Student address: ",
                    placeholder: "Student address..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentPhone: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studentPhone",
                    label: "Student phone: ",
                    placeholder: "Student phone..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentIsTaxed: {
                element: "select",
                value: "",
                defaultValue: "",
                config: {
                    name: "studentIsTaxed",
                    label: "Student financing option: ",
                    disabled: true,
                    options: [
                        {
                            id: 0,
                            name: "taxed"
                        },
                        {
                            id: 1,
                            name: "budget"
                        }
                    ]
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupId: {
                element: "select",
                value: "",
                defaultValue: "",
                config: {
                    disabled: true,
                    name: "studyGroupId",
                    label: "Study group: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyYearId: {
                element: "select",
                value: "",
                defaultValue: "",
                config: {
                    disabled: true,
                    name: "studyYearId",
                    label: "Study year: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            facultyId: {
                element: "select",
                value: "",
                defaultValue: "",
                config: {
                    disabled: true,
                    name: "facultyId",
                    label: "Student faculty: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
        }
    };

    UNSAFE_componentWillMount() {

        this.props.dispatch(clearCoursesList());
        this.props.dispatch(clearStudent());
        this.props.dispatch(clearStudyGroups());
        this.props.dispatch(clearMarks());
        this.props.dispatch(clearPresences());


        this.props.dispatch(getFaculties());
        this.props.dispatch(getCoursesByStudentId(this.props.match.params.id));
        this.props.dispatch(getStudent(this.props.match.params.id));
        this.props.dispatch(getStudyGroupsMatched(this.props.match.params.id));
        this.props.dispatch(getStudyYears());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.faculties.facultiesList) {
            if(nextProps.students.student) {
                if(nextProps.studyGroups.studyGroupsList) {
                    if(nextProps.studyYears.studyYearsList) {
                        if(nextProps.courses.coursesList) {
                            if(this.props.users.login.user.userRole == "student" && this.props.users.login.user.userEmail != nextProps.students.student.studentEmail) {
                                this.props.history.push("/not-found");
                            }

                            console.log(nextProps);
                            let tempFormData = this.state.formData;
                            let facultyOptions = [];
                            let studyGroupOptions = [];
                            let studyYearOptions = [];
        
                            nextProps.faculties.facultiesList.map((faculty) => {
                                facultyOptions.push({
                                    id: faculty.facultyId,
                                    name: faculty.facultyName
                                });
                            });
        
                            nextProps.studyGroups.studyGroupsList.map((studyGroup) => {
                                studyGroupOptions.push({
                                    id: studyGroup.studyGroupId,
                                    name: studyGroup.studyGroupId
                                })
                            })
    
                            nextProps.studyYears.studyYearsList.map((studyYear) => {
                                studyYearOptions.push({
                                    id: studyYear.studyYearId,
                                    name: studyYear.studyYearOrder
                                })
                            })   
            
                            for (var key of Object.keys(tempFormData)) {
                                tempFormData[key].value = nextProps.students.student[key];
                                tempFormData[key].isValid = true;
                            }
            
                            tempFormData.studentDob.value = moment(tempFormData.studentDob.value).format("DD/MM/YYYY");
                            tempFormData.studentIsTaxed.defaultValue = nextProps.students.student.studentIsTaxed == true ? 0 : 1;
                            tempFormData.studentIsTaxed.value = nextProps.students.student.studentIsTaxed == true ? 0 : 1;
            
                            tempFormData.facultyId.defaultValue = nextProps.students.student.facultyId;
                            tempFormData.facultyId.value = nextProps.students.student.facultyId;
        
                            tempFormData.studyGroupId.defaultValue = nextProps.students.student.studyGroupId;
                            tempFormData.studyGroupId.value = nextProps.students.student.studyGroupId;
    
                                
                            tempFormData.studyYearId.defaultValue = nextProps.students.student.studyYearId;
                            tempFormData.studyYearId.value = nextProps.students.student.studyYearId;
            
                            tempFormData.facultyId.config.options = facultyOptions;
                            tempFormData.studyGroupId.config.options = studyGroupOptions;
                            tempFormData.studyYearId.config.options = studyYearOptions;
                
                
                            this.setState({
                                student: nextProps.students.student,
                                courses: nextProps.courses.coursesList,
                                studyYears: nextProps.studyYears.studyYearsList,
                                formData: tempFormData,
                                loading: false
                            });
                        }  
                    }    
                }  
            }

            if(nextProps.students.updatedStudent) {
                if(nextProps.students.updatedStudent.message) {
                    let tempFormData = this.state.formData;
                    for(var key of Object.keys(tempFormData)) {
                        tempFormData[key].config.disabled = true;
                    }
                    this.setState({
                        error: nextProps.students.updatedStudent.message,
                        formData: tempFormData
                    });
                }else {
                    this.props.dispatch(clearStudent());
                    this.props.history.push("/students-list");
                }
            }

            if(nextProps.marks.marksList != null) {
                console.log(nextProps);
                this.setState({
                    marks: nextProps.marks.marksList,
                    isMarksListLoaded: true
                })
            }

            if(nextProps.presenceSheets.presencesList != null) {
                console.log(nextProps);
                this.setState({
                    presences: nextProps.presenceSheets.presencesList,
                    isPresenceListLoaded: true
                })
            }
        }
    }

    updateForm = (formResponse) => {
        let newFormData = {...this.state.formData}
        let newElement = {...newFormData[formResponse.id]};

        newElement.value = formResponse.event.target.value;

        if(formResponse.isBlurred) {
            let isValid = this.validateData(newElement);
            newElement.isValid = isValid[0];
            newElement.validationMessage = isValid[1];
            newElement.isBlurred = formResponse.isBlurred;
        }

        newFormData[formResponse.id] = newElement;
        this.setState({
            formData: newFormData
        });
    }

    validateData = (data) => {

        let error = [true, ""];

        if(data.validation.required) {
            const isValid = data.value.trim() !== "" ? true : false;
            const message = `${!isValid ? "This field is required !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.email) {
            const isValid = /\S+@\S+\.\S+/.test(data.value);
            const message = `${!isValid ? "This field must be a valid email address !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.minLength) {
            const isValid = data.value.length >= data.validation.minLength ? true : false;
            const message = `${!isValid ? `This field must be at least ${data.validation.minLength} characters long !` : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.date) {
            const isValid = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(data.value);
            const message = `${!isValid ? "This field must be a valid date in DD/MM/YYYY format !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        return error;
    }

    renderButton = () => {
        return  this.state.edit === false
                ?
                <button onClick={() => this.editHandlle()}>EDIT</button>
                :
                <button onClick={(event) => this.saveHandle(event)}>SAVE</button>
    }

    gotToStudyGroupHandle = () => {
        this.props.history.push(`/studygroup/${this.state.student.studyGroupId}`)
    }

    renderGoToStudyGroupButton = () => {
        
        return <button onClick={() => this.gotToStudyGroupHandle()}>GO TO STUDY GROUP</button>
    }

    renderError = () => {
        return  this.state.error != ""
                ?
                <div className="error">
                    {this.state.error}
                </div>
                :
                null
    }

    editHandlle = () => {
        let tempFormData = this.state.formData;
        for(let key in tempFormData) {
            tempFormData[key].config.disabled = false;
        }
        this.setState({
            formData: tempFormData,
            edit: true
        });
    }

    saveHandle = (event) => {
        event.preventDefault();
        let dataToSubmit = {};
        let isFormValid = true;

        for(let key in this.state.formData) {
            dataToSubmit[key] = this.state.formData[key].value;
        }


        for(let key in this.state.formData) {
            isFormValid = isFormValid && this.state.formData[key].valid ? true : false;
        }

        if(isFormValid) {
            document.body.click();
            dataToSubmit.studentDob = moment(dataToSubmit.studentDob, "DD/MM/YYYY");
            this.props.dispatch(updateStudent(this.state.student.studentId, dataToSubmit));
            this.setState({
                error: "",
                loading: true,
                edit: false
            });
        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
    }

    renderCourses = (coursesList) => {
        return coursesList.map(course => {
            return (
                <div className="student_course">
                        <Link to={{
                        pathname:`/course/${course.courseId}`,
                        state: {fromDashboard: true }}}>
                            {`# ${course.courseName} with ${course.Professor.professorFirstName} ${course.Professor.professorLastName} `}
                        </Link>
                </div>

            )
        })
    }

    changeMarksHandle = (event) => {
        this.setState({
           selectedStudyYear: event.target.value,
           isMarksListLoaded: false
        });

        this.props.dispatch(clearMarks());
        this.props.dispatch(getStudentMarksByStudyYear(this.state.student.studentId, event.target.value));
    }

    renderMarks = () => {
        if(this.state.isMarksListLoaded) {
            if(this.state.marks.length > 0) {
                return this.state.marks.map(mark => {
                    return (
                        <div key={mark.markId} className="mark">
                                <Link to={{ 
                                    pathname:`/subject/${mark.Course.Subject.subjectId}`,
                                    state: {fromDashboard: true }}}>
                                        <div className="left">
                                            {mark.Course.Subject.subjectName}
                                        </div>
                                </Link>
        
                                <div className="right">
                                    {mark.isGraded ? `${mark.theoryMarkScore + mark.practicalMarkScore} / 100` : "NOT GRADED"}
                                </div>
                        </div>
                    )     
                })
            }else {
                return (
                    <div className="message">
                        No marks yet.
                    </div>
                )
            }
            
        }
    }

    renderMarksCatalog = () => {
        return (
            <div>
                <h2>Marks catalog: </h2>

                <select
                value={this.state.selectedStudyYear}
                defaultValue=""
                name="marks_catalog"
                onChange={(event) => this.changeMarksHandle(event)}>

                    <option value="" disabled>Select wanted study year catalog...</option>
                    {this.state.studyYears.map(studyYear => {
                        return (
                            <option key={studyYear.studyYearId} value={studyYear.studyYearId}>
                                {studyYear.studyYearOrder}
                            </option>
                        )
                    })}
                </select>

                {this.renderMarks()}
            </div>
            
        )
    }

    changePresencesHandle = (event) => {
        this.setState({
            selectedCourse: event.target.value,
            isPresenceListLoaded: false
         });
 
         this.props.dispatch(clearPresences());
         this.props.dispatch(getStudentPresencesByCourseId(this.state.student.studentId, event.target.value));
    }

    renderPresences = () => {
        if(this.state.isPresenceListLoaded) {
            if(this.state.presences.length > 0) {
                return this.state.presences.map(presence => {
                    return (
                        <div className="presence_container">
                            <div className="left">
                                {`${moment(presence.PresenceSheet.presenceSheetDate).format("DD/MM/YYYY")}`}
                            </div>
                            <div className="right">
                                {`${presence.presenceStatus ? `PRESENT` : `ABSENT`}`}
                            </div>
                            
                        </div>
                    )
                })
            } else {
                return (
                    <div className="message">
                        No presences yet.
                    </div>
                )
            }
            
        }
    }

    renderPresencesReport = () => {
        return (
            <div>
                <h2>Presences report: </h2>
                <select
                value={this.state.selectedCourse}
                defaultValue=""
                name="presences_report"
                onChange={(event) => this.changePresencesHandle(event)}>

                    <option value="" disabled>Select wanted course for presences report...</option>
                    {this.state.courses.map(course => {
                        return (
                            <option key={course.courseId} value={course.courseId}>
                                {course.courseName}
                            </option>
                        )
                    })}
                </select>

                {this.renderPresences()}
            </div>
        )
    }



    render() {
        if(!this.state.loading) {
            return (
                <div>
                    <div className="about_container">
                        <div className="about_left_container">
                            <FormField
                                id={"studentFirstName"}
                                formData={this.state.formData.studentFirstName}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            <FormField
                                id={"studentLastName"}
                                formData={this.state.formData.studentLastName}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studentEmail"}
                                formData={this.state.formData.studentEmail}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studentDob"}
                                formData={this.state.formData.studentDob}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studentAddress"}
                                formData={this.state.formData.studentAddress}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studentPhone"}
                                formData={this.state.formData.studentPhone}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>             
                                
                            <FormField
                                id={"studentIsTaxed"}
                                formData={this.state.formData.studentIsTaxed}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            <FormField
                                id={"studyGroupId"}
                                formData={this.state.formData.studyGroupId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studyYearId"}
                                formData={this.state.formData.studyYearId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            
                            <FormField
                                id={"facultyId"}
                                formData={this.state.formData.facultyId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}

                            {this.renderGoToStudyGroupButton()}

                            {this.renderError()}

                        </div>

                        <div className="about_right_container">
                            <h2>Courses: </h2>
                            {this.renderCourses(this.state.courses)}
                            
                            {this.renderMarksCatalog()}
                            
                        </div>
                    </div>

                    <div className="presences_report">
                            {this.renderPresencesReport()}
                    </div>

                </div>
                
            )
        }else {
            return (
                <div className="loader"/>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        students: state.students,
        faculties: state.faculties,
        studyGroups: state.studyGroups,
        courses: state.courses,
        studyYears: state.studyYears,
        marks: state.marks,
        presenceSheets: state.presenceSheets
    }
}


export default connect(mapStateToProps)(AboutStudent);