import {Component} from "react";
import {connect} from "react-redux";
import {getFaculties} from "../actions/facultyActions";
import {getStudyYears} from "../actions/studyYearActions";
import {getStudyGroup, updateStudyGroup, clearStudyGroup} from "../actions/studyGroupActions";
import FormField from "../components/FormField";
import {getStudentsByStudyGroup, clearStudentsList} from "../actions/studentActions";
import {Link} from "react-router-dom";
import {clearCoursesList, getCoursesByStudyGroup} from "../actions/coursesActions";

class AboutStudyGroup extends Component {

    state = {
        edit: false,
        loading: false,
        studyGroup: null,
        students: [],
        courses: [],
        error: "",
        formData: {
            studyGroupId: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studyGroupId",
                    label: "Study group no.: ",
                    type: "text",
                    placeholder: "Study group number..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupDescription: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "studyGroupDescription",
                    label: "Description: ",
                    type: "text",
                    placeholder: "Study group description..."
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            facultyId: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "facultyId",
                    label: "Faculty: ",
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
            }
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearStudentsList());
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(clearStudyGroup());

        this.props.dispatch(getFaculties());
        this.props.dispatch(getStudyYears());
        this.props.dispatch(getStudentsByStudyGroup(this.props.match.params.id));
        this.props.dispatch(getCoursesByStudyGroup(this.props.match.params.id));
        this.props.dispatch(getStudyGroup(this.props.match.params.id));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.faculties.facultiesList) {
            if(nextProps.studyYears.studyYearsList) {
                if(nextProps.students.studentsList) {
                    if(nextProps.courses.coursesList) {
                        if(nextProps.studyGroups.studyGroup) {

                            console.log(nextProps);
                            
                            let tempFormData = this.state.formData;
                            let facultyOptions = [];
                            let studyYearOptions = [];
    
                            nextProps.faculties.facultiesList.map((faculty) => {
                                facultyOptions.push({
                                    id: faculty.facultyId,
                                    name: faculty.facultyName
                                });
                            });
    
                            nextProps.studyYears.studyYearsList.map((studyYear) => {
                                studyYearOptions.push({
                                    id: studyYear.studyYearId,
                                    name: studyYear.studyYearOrder
                                })
                            })   
            
                            for (var key of Object.keys(tempFormData)) {
                                tempFormData[key].value = nextProps.studyGroups.studyGroup[key];
                                tempFormData[key].isValid = true;
                            }
            
            
                            tempFormData.facultyId.defaultValue = nextProps.studyGroups.studyGroup.facultyId;
                            tempFormData.facultyId.value = nextProps.studyGroups.studyGroup.facultyId;

                            tempFormData.studyYearId.defaultValue = nextProps.studyGroups.studyGroup.studyYearId;
                            tempFormData.studyYearId.value = nextProps.studyGroups.studyGroup.studyYearId;
    
                            tempFormData.facultyId.config.options = facultyOptions;
                            tempFormData.studyYearId.config.options = studyYearOptions;
                
                
                            this.setState({
                                studyGroup: nextProps.studyGroups.studyGroup,
                                students: nextProps.students.studentsList,
                                courses: nextProps.courses.coursesList,
                                formData: tempFormData,
                                loading: false
                            });
                        }
                    } 
                }  
            }

            if(nextProps.studyGroups.updatedStudyGroup) {
                if(nextProps.studyGroups.updatedStudyGroup.message) {
                    this.setState({
                        error: nextProps.studyGroups.updatedStudyGroup.message
                    });
                }else {
                    this.props.dispatch(clearStudyGroup());
                    this.props.history.push("/studygroups-list");
                }
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
                <div>
                    <button onClick={(event) => this.saveHandle(event)}>SAVE</button>
                    <button onClick={(event) => this.cancelHandle(event)}>CANCEL</button>
                </div>
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

    cancelHandle = () => {
        let tempFormData = this.state.formData;

        for (var key of Object.keys(tempFormData)) {
            tempFormData[key].value = this.state.studyGroup[key];
            tempFormData[key].isValid = true;
            tempFormData[key].config.disabled = true;
            tempFormData[key].isBlurred = false;
        }
            
        tempFormData.studyYearId.defaultValue = this.state.studyGroup.studyYearId;
        tempFormData.studyYearId.value = this.state.studyGroup.studyYearId;

        tempFormData.facultyId.defaultValue = this.state.studyGroup.facultyId;
        tempFormData.facultyId.value = this.state.studyGroup.facultyId;

        this.setState({
            formData: tempFormData,
            edit: false,
            error: ""
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
            isFormValid = isFormValid && this.state.formData[key].isValid ? true : false;
        }

        if(isFormValid) {
            document.body.click();
            this.props.dispatch(updateStudyGroup(this.state.studyGroup.studyGroupId, dataToSubmit));
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

    renderStudents = (studentsList) => {
        if(studentsList.length > 0) {
            return studentsList.map(student => {
                return (
                    <div className="studygroup_student">
                        <Link to={{ 
                                    pathname:`/student/${student.studentId}`,
                                    state: {fromDashboard: true }}}>
                                {`--- ${student.studentFirstName} ${student.studentLastName}`}
                        </Link>
                    </div>
    
                )
            });
        } else {
            return <div className="message">No students in this study group yet.</div>
        }

    }

    renderCourses = (coursesList) => {
        if(coursesList.length > 0) {
            return coursesList.map(course => {
                return (
                    <div className="studygroup_course">
                            <Link to={{
                            pathname:`/course/${course.courseId}`,
                            state: {fromDashboard: true }}}>
                                    {`# ${course.courseName} with ${course.Professor.professorFirstName} ${course.Professor.professorLastName} `}
                            </Link>
                    </div>
    
                )
            });
        }else {
            return <div className="message">This study group was not assigned courses yet.</div>
        }     
    }


    render() {
        if(!this.state.loading && this.state.studyGroup) {
            return (
                <div className="about_container">
                    <div className="about_left_container">
                        <FormField
                            id={"studyGroupId"}
                            formData={this.state.formData.studyGroupId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"studyGroupDescription"}
                            formData={this.state.formData.studyGroupDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"facultyId"}
                            formData={this.state.formData.facultyId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"studyYearId"}
                            formData={this.state.formData.studyYearId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}
                        {this.renderError()}

                    </div>
                    <div className="about_right_container">
                         <h2>Students: </h2>
                         {this.renderStudents(this.state.students)}
                    </div>

                    <div className="more">
                        <h2>Courses: </h2>
                        {this.renderCourses(this.state.courses)}
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
        studyGroups: state.studyGroups,
        students: state.students,
        faculties: state.faculties,
        studyYears: state.studyYears,
        courses: state.courses
    }
}

export default connect(mapStateToProps)(AboutStudyGroup);