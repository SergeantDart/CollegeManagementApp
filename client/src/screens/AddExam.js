import {Component} from "react";
import {connect} from "react-redux";
import {addExam, clearExam} from "../actions/examActions";
import {getCourses, clearCoursesList} from "../actions/coursesActions";
import FormField from "../components/FormField";

class AddExam extends Component {

    state = {
        error: "",
        loading: false,
        courses: [],
        formData: {
            courseId: {
                element: "select",
                value: "",
                config: {
                    name: "course_id",
                    label: "Course: ",
                    options: []
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examDescription: {
                element: "input",
                value: "",
                config: {
                    name: "exam_description",
                    label: "Exam description: ",
                    type: "text",
                    placeholder: "Exam description..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examDate: {
                element: "input",
                value: "",
                config: {
                    name: "exam_date",
                    label: "Exam date: ",
                    type: "text",
                    placeholder: "Exam date, DD/MM/YYYY..."
                },
                validation: {
                    required: true,
                    date: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examIsOnline: {
                element: "select",
                value: "",
                config: {
                    name: "exam_is_online",
                    label: "Exam type: ",
                    options: [
                        {
                            id: 0,
                            name: "physical"
                        },
                        {
                            id: 1,
                            name: "online"
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
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearExam());
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(getCourses());

        let tempFormData = this.state.formData;
        tempFormData.courseId.config.disabled = this.props.users.login.user.userRole == "professor" ?  true : null;

    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let courseOptions = [];

        if(nextProps.courses.coursesList) {
            

            nextProps.courses.coursesList.coursesData.map((course) => {
                courseOptions.push({
                    id: course.courseId,
                    name: `${course.courseName} with ${course.Professor.professorFirstName} ${course.Professor.professorLastName} - group no. ${course.studyGroupId}`
                });
            });


            tempFormData.courseId.config.options = courseOptions;
            
            if(this.props.match.params.courseId) {
                tempFormData.courseId.defaultValue = this.props.match.params.courseId;
                tempFormData.courseId.value = this.props.match.params.courseId;
                tempFormData.courseId.isValid = true;

            }


            this.setState({
                courses: nextProps.courses.coursesList.coursesData,
                formData: tempFormData
            });
        
        }

        if(nextProps.exams.exam) {
            if(nextProps.exams.exam.message) {
                this.setState({
                    loading: false,
                    error: nextProps.exams.exam.message
                });
            }else {
                this.setState({
                    loading: false
                });
                if(this.props.match.params.courseId) {
                    this.props.history.push(`/course/${this.props.match.params.courseId}`);
                }else {
                    this.props.history.push("/exams-list");
                }
                this.props.dispatch(clearExam());
            }
        }
    }

    updateForm = (formResponse) => {
        let newFormData = {...this.state.formData}
        let newElement = {...newFormData[formResponse.id]};

        newElement.value = formResponse.event.target.value;

        if(formResponse.isBlurred){
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

    renderSubmitButton = () => {
        return (
            this.state.loading 
            ? 
            <div className="loading">
                Loading...
            </div>
            :
            <div>
                <button onClick={(event) => this.submitHandle(event)}>Add exam</button>
            </div>
        );
    }

    submitHandle = (event) => {
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

            console.log(dataToSubmit);
            if(this.props.users.login.user.userRole == "admin") {
                this.props.dispatch(addExam(dataToSubmit));
                this.setState({
                    error: "",
                    loading: true
                });
            } else {
                if(this.props.users.login.user.userRole == "professor") {
                    let course = this.state.courses.find(course => course.courseId == dataToSubmit.courseId)
                    if(course.Professor.professorEmail == this.props.users.login.user.userEmail) {
                        this.props.dispatch(addExam(dataToSubmit));
                        this.setState({
                            error: "",
                            loading: true
                        });
                    } else {
                        this.setState({
                            error: "You do not have permission",
                        });
                    }
                }else {
                    this.setState({
                        error: "You do not have permission"
                    })
                }
            }

        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
    }
    
    renderError = () => {
        return (
            this.state.error !== ""
            ?
            <div className="error">
                {this.state.error}
            </div>
            :
            ""
        );
    }

    render() {
        if(!this.state.loading) {
            return (
                <div className="add_container">
                    
                    <form>
    
                        <h2>Add exam</h2>
    
                        <FormField
                            id={"courseId"}
                            formData={this.state.formData.courseId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"examDescription"}
                            formData={this.state.formData.examDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"examDate"}
                            formData={this.state.formData.examDate}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"examIsOnline"}
                            formData={this.state.formData.examIsOnline}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                                
                        {this.renderSubmitButton()}
                        {this.renderError()}
    
                    </form>
                </div>
            );
        }else {
            return (
                <div className="loader"/>
            )
        }
        
    }
}

function mapStateToProps(state) {
    return {
        courses: state.courses,
        exams: state.exams
    }
}

export default connect(mapStateToProps)(AddExam);