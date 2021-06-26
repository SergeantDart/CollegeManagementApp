import {Component} from "react";
import {getProfessor, updateProfessor, clearProfessor} from "../actions/professorActions";
import {getDepartments, clearDepartments} from "../actions/departmentActions";
import {getCoursesByProfessorId, clearCoursesList} from "../actions/coursesActions";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import moment from "moment";
import {Link} from "react-router-dom";

class AboutProfessor extends Component {

    state = {
        edit: false,
        loading: true,
        professor: {},
        courses: [],
        error: "",
        formData: {
            professorFirstName: {
                element: "input",
                value: "",
                config: {
                    name: "professorFirstName",
                    label: "First name: ",
                    type: "text",
                    placeholder: "Professor first name...",
                    disabled: true
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorLastName: {
                element: "input",
                value: "",
                config: {
                    name: "professorLastName",
                    label: "Last name: ",
                    type: "text",
                    placeholder: "Professor last name...",
                    disabled: true
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorEmail: {
                element: "input",
                value: "",
                config: {
                    name: "professorEmail",
                    label: "Email: ",
                    type: "text",
                    placeholder: "Professor email...",
                    disabled: true
                },
                validation: {
                    required: true,
                    email: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorDob: {
                element: "input",
                value: "",
                config: {
                    name: "professorDob",
                    label: "Date of birth: ",
                    placeholder: "Professor date of birth...",
                    disabled: true
                },
                validation: {
                    required: true,
                    date: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorAddress: {
                element: "input",
                value: "",
                config: {
                    name: "professorAddress",
                    label: "Professor address: ",
                    placeholder: "Professor address...",
                    disabled: true
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorPhone: {
                element: "input",
                value: "",
                config: {
                    name: "professorPhone",
                    label: "Professor phone: ",
                    placeholder: "Professor phone...",
                    disabled: true
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorSalary: {
                element: "input",
                value: "",
                config: {
                    name: "professorSalary",
                    label: "Professor salary: ",
                    placeholder: "Professor salary...",
                    disabled: true
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            departmentId: {
                element: "select",
                value: "",
                config: {
                    name: "departmentId",
                    label: "Department: ",
                    options: [],
                    disabled: true
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            }
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearDepartments());
        this.props.dispatch(clearCoursesList());

        this.props.dispatch(getDepartments());
        this.props.dispatch(getCoursesByProfessorId(this.props.match.params.id));
        this.props.dispatch(getProfessor(this.props.match.params.id));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.departments.departmentsList) {
            if(nextProps.courses.coursesList) {
                if(nextProps.professors.professor) {
                    if(this.props.users.login.user.userRole == "professor" && this.props.users.login.user.userEmail != nextProps.professors.professor.professorEmail) {
                        this.props.history.push("/not-found");
                    }

                    let tempFormData = this.state.formData;
                    let departmentOptions = [];
    
                    nextProps.departments.departmentsList.departmentsData.map((department) => {
                        departmentOptions.push({
                            id: department.departmentId,
                            name: department.departmentName
                        });
                    });
    
                    for (var key of Object.keys(tempFormData)) {
                        tempFormData[key].value = nextProps.professors.professor[key];
                        tempFormData[key].isValid = true;
                    }
    
                    tempFormData.professorDob.value = moment(tempFormData.professorDob.value).format("DD/MM/YYYY");
                    
    
                    tempFormData.departmentId.defaultValue = nextProps.professors.professor.departmentId;
                    tempFormData.departmentId.value = nextProps.professors.professor.departmentId;
    
    
                    tempFormData.departmentId.config.options = departmentOptions;
        
                    console.log(tempFormData);
        
                    this.setState({
                        professor: nextProps.professors.professor,
                        courses: nextProps.courses.coursesList,
                        formData: tempFormData,
                        loading: false
                    }); 
                }
    
            }
            
            if(nextProps.professors.updatedProfessor) {
                if(nextProps.professors.updatedProfessor.message) {
                    this.setState({
                        error: nextProps.professors.updatedProfessor.message
                    });
                }else {
                    this.props.dispatch(clearProfessor());
                    this.props.history.push("/professors-list");
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
                <button onClick={(event) => this.saveHandle(event)}>SAVE</button>
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
            dataToSubmit.professorDob = moment(dataToSubmit.professorDob, "DD/MM/YYYY");
            this.props.dispatch(updateProfessor(this.state.professor.professorId, dataToSubmit));
            this.setState({
                error: "",
                loading: true
            });
        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
        this.setState({
            edit: false
        });
    }

    renderCourses = (coursesList) => {
        console.log(coursesList);
        return coursesList.map(course => {
            return (
                <Link to={{
                    pathname:`/course/${course.courseId}`,
                    state: {fromDashboard: true }}}>
                        <div className="professor_course">
                            {`# ${course.courseName} with ${course.Professor.professorFirstName} `}
                        </div>
                    </Link>
            )
        })
    }


    render() {
        if(!this.state.loading) {
            return (
                <div className="about_container">
                    <div className="about_left_container">
                        <FormField
                            id={"professorFirstName"}
                            formData={this.state.formData.professorFirstName}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"professorLastName"}
                            formData={this.state.formData.professorLastName}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"professorEmail"}
                            formData={this.state.formData.professorEmail}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"professorDob"}
                            formData={this.state.formData.professorDob}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"professorAddress"}
                            formData={this.state.formData.professorAddress}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"professorPhone"}
                            formData={this.state.formData.professorPhone}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>             
                            
                        <FormField
                            id={"professorSalary"}
                            formData={this.state.formData.professorSalary}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"departmentId"}
                            formData={this.state.formData.departmentId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>


                        {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}
                        {this.renderError()}

                    </div>
                    <div className="about_right_container">
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
        professors: state.professors,
        departments: state.departments,
        courses: state.courses
    }
}


export default connect(mapStateToProps)(AboutProfessor);