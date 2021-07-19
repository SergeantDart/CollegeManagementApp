import {Component} from "react";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import {Link} from "react-router-dom";
import {clearSubject, getSubject, updateSubject} from "../actions/subjectActions";
import {getCoursesBySubjectId, clearCoursesList} from "../actions/coursesActions";

class AboutSubject extends Component {

    state = {
        edit: false,
        subject: null,
        courses: [],
        error: "",
        loading: false,
        formData: {
            subjectName: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_name",
                    label: "Subject name: ",
                    type: "text",
                    placeholder: "Subject name..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectTheoryMarks: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_theory_marks",
                    label: "Theory marks: ",
                    type: "text",
                    placeholder: "Theory marks..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectPracticalMarks: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_practical_marks",
                    label: "Practical marks: ",
                    type: "text",
                    placeholder: "Practical marks..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectCreditScore: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_credit_score",
                    label: "Credit score: ",
                    type: "text",
                    placeholder: "Credit score..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectDescription: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_description",
                    label: "Subject description: ",
                    type: "text",
                    placeholder: "Subject description..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectIsOptional: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_is_optional",
                    label: "Subject type: ",
                    options: [
                        {
                            id: 0,
                            name: "Optional"
                        },
                        {
                            id: 1,
                            name: "Mandatory"
                        }
                    ]
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearSubject());
        this.props.dispatch(clearCoursesList());
        
        this.props.dispatch(getSubject(this.props.match.params.id));
        this.props.dispatch(getCoursesBySubjectId(this.props.match.params.id));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        if(nextProps.courses.coursesList) {
            if(nextProps.subjects.subject) {

            
                let tempFormData = this.state.formData; 
    
                for (var key of Object.keys(tempFormData)) {
                    tempFormData[key].value = nextProps.subjects.subject[key];
                    tempFormData[key].isValid = true;
                }
    
    
                tempFormData.subjectIsOptional.defaultValue = nextProps.subjects.subject.subjectIsOptional ? 0 : 1;
                tempFormData.subjectIsOptional.value = nextProps.subjects.subject.subjectIsOptional ? 0 : 1;
    
                this.setState({
                    subject: nextProps.subjects.subject,
                    courses: nextProps.courses.coursesList,
                    formData: tempFormData,
                    loading: false
                });                 
                  
            }

            if(nextProps.subjects.updatedSubject) {
                if(nextProps.subjects.updatedSubject.message) {
                    this.setState({
                        error: nextProps.subjects.updatedSubject.message
                    });
                }else {
                    let tempFormData = this.state.formData;
                    for(var key of Object.keys(tempFormData)) {
                        tempFormData[key].config.disabled = true;
                    }
                    this.setState({
                        subject: nextProps.subjects.updatedSubject,
                        loading: false,
                        edit: false,
                        formData: tempFormData
                    });
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

    renderCourses = (coursesList) => {
        return (
            <div className="more">
                <h2>Courses: </h2>
                {coursesList.length > 0 ? coursesList.map(course => {
                    return (
                        <div key={course.courseId} className="subject_course">
                            <Link to={{
                                pathname:`/course/${course.courseId}`,
                                state: {fromDashboard: true }}}>
                                    {`# ${course.courseName} with ${course.Professor.professorFirstName} ${course.Professor.professorLastName} - group no. ${course.studyGroupId}`}
                            </Link>
                        </div>
                    )
                })
                :
                <div className="message">No courses yet assigned with this subject.</div>}
            </div>
        )

    }

    cancelHandle = () => {
        let tempFormData = this.state.formData;

        for (var key of Object.keys(tempFormData)) {
            tempFormData[key].value = this.state.subject[key];
            tempFormData[key].isValid = true;
            tempFormData[key].config.disabled = true;
            tempFormData[key].isBlurred = false;
        }

        tempFormData.subjectIsOptional.defaultValue = this.state.subject.subjectIsOptional ? 0 : 1;
        tempFormData.subjectIsOptional.value = this.state.subject.subjectIsOptional ? 0 : 1;

        this.setState({
            formData: tempFormData,
            edit: false,
            error: ""
        });
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
            isFormValid = isFormValid && this.state.formData[key].isValid ? true : false;
        }

        if(parseInt(dataToSubmit.subjectTheoryMarks) + parseInt(dataToSubmit.subjectPracticalMarks) != 100) {
            isFormValid = false;
            this.setState({
                error: "The sum of the theory marks and practical marks must equal 100"
            });
        } else {
            if(isFormValid) {
                document.body.click();
                this.props.dispatch(clearSubject());
                this.props.dispatch(updateSubject(this.state.subject.subjectId, dataToSubmit));
                this.setState({
                    error: "",
                    edit: false,
                    loading: true
                });
            }else {
                this.setState({
                    error: "Something must have happened..."
                });
            }
        }
    }

    render() {
        if(!this.state.loading && this.state.subject) {
            return (
                <div className="about_container">
                    <div className="about_left_container">

                    <FormField
                            id={"subjectName"}
                            formData={this.state.formData.subjectName}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        
                        <FormField
                            id={"subjectDescription"}
                            formData={this.state.formData.subjectDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"subjectTheoryMarks"}
                            formData={this.state.formData.subjectTheoryMarks}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"subjectPracticalMarks"}
                            formData={this.state.formData.subjectPracticalMarks}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        
                        <FormField
                            id={"subjectCreditScore"}
                            formData={this.state.formData.subjectCreditScore}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"subjectIsOptional"}
                            formData={this.state.formData.subjectIsOptional}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>


                        {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}
                        {this.renderError()}

                    </div>

                    {this.renderCourses(this.state.courses)}


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
        subjects: state.subjects,
        courses: state.courses
    }
}

export default connect(mapStateToProps)(AboutSubject);