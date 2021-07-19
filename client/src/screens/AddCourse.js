import {Component} from "react";
import {connect} from "react-redux";
import {addCourse, clearCourse} from "../actions/coursesActions";
import {getProfessors, clearProfessors} from "../actions/professorActions";
import {getStudyGroups, clearStudyGroups} from "../actions/studyGroupActions";
import {getSubjects, clearSubjects} from "../actions/subjectActions";
import FormField from "../components/FormField";

class AddCourse extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            courseName: {
                element: "input",
                value: "",
                config: {
                    name: "course_name",
                    label: "Course name: ",
                    type: "text",
                    placeholder: "Course name..."
                },
                validation: {
                    required: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            courseTime: {
                element: "input",
                value: "",
                config: {
                    name: "course_time",
                    label: "Course time: ",
                    type: "text",
                    placeholder: "Day of the week, HH:MM..."
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            courseDescription: {
                element: "input",
                value: "",
                config: {
                    name: "course_description",
                    label: "Description: ",
                    type: "text",
                    placeholder: "Course description..."
                },
                validation: {
                    required: true,
                    minLength: 8
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupId: {
                element: "select",
                value: "",
                config: {
                    name: "study_group_id",
                    label: "Study group: ",
                    options: []
                },
                validation: {
                    required: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectId: {
                element: "select",
                value: "",
                config: {
                    name: "subject_id",
                    label: "Subject: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorId: {
                element: "select",
                value: "",
                config: {
                    name: "professor_id",
                    label: "Professor: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            }
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearCourse());
        this.props.dispatch(clearStudyGroups());
        this.props.dispatch(clearSubjects());
        this.props.dispatch(clearProfessors());

        this.props.dispatch(getStudyGroups());
        this.props.dispatch(getSubjects());
        this.props.dispatch(getProfessors());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let studyGroupOptions = [];
        let subjectOptions = [];
        let professorOptions = [];
        if(nextProps.studyGroups.studyGroupsList) {
            if(nextProps.subjects.subjectsList) {
                if(nextProps.professors.professorsList) {

                    nextProps.studyGroups.studyGroupsList.studyGroupsData.map((studyGroup) => {
                        studyGroupOptions.push({
                            id: studyGroup.studyGroupId,
                            name: studyGroup.studyGroupId
                        });
                    });
                    nextProps.subjects.subjectsList.subjectsData.map((subject) => {
                        subjectOptions.push({
                            id: subject.subjectId,
                            name: subject.subjectName
                        });
                    });
                    nextProps.professors.professorsList.professorsData.map((professor) => {
                        professorOptions.push({
                            id: professor.professorId,
                            name: `${professor.professorFirstName} ${professor.professorLastName}`
                        });
                    });

                    tempFormData.studyGroupId.config.options = studyGroupOptions;
                    tempFormData.subjectId.config.options = subjectOptions;
                    tempFormData.professorId.config.options = professorOptions;
        
                    this.setState({
                        formData: tempFormData
                    });
                }
            }  
        }

        if(nextProps.courses.course) {
            if(nextProps.courses.course.message) {
                this.setState({
                    error: nextProps.courses.course.message
                });
            }else {
                this.setState({
                    loading: true
                });
                this.props.dispatch(clearCourse());
                this.props.history.push("/courses-list");
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
                <button onClick={(event) => this.submitHandle(event)}>Add course</button>
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
            this.setState({
                error: "",
                loading: true
            });
            this.props.dispatch(addCourse(dataToSubmit));
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
    
                        <h2>Add course</h2>
    
                        <FormField
                            id={"courseName"}
                            formData={this.state.formData.courseName}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"courseTime"}
                            formData={this.state.formData.courseTime}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"courseDescription"}
                            formData={this.state.formData.courseDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"studyGroupId"}
                            formData={this.state.formData.studyGroupId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"subjectId"}
                            formData={this.state.formData.subjectId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"professorId"}
                            formData={this.state.formData.professorId}
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
        studyGroups: state.studyGroups,
        subjects: state.subjects,
        professors: state.professors
    }
}

export default connect(mapStateToProps)(AddCourse);