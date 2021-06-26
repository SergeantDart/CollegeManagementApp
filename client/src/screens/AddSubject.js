import {Component} from "react";
import {connect} from "react-redux";
import {addSubject, clearSubject} from "../actions/subjectActions";
import FormField from "../components/FormField";

class AddSubject extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            subjectName: {
                element: "input",
                value: "",
                config: {
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
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if(nextProps.subjects.subject) {
            if(nextProps.subjects.subject.message) {
                this.setState({
                    loading: false,
                    error: nextProps.subjects.subject.message
                });
            }else {
                this.setState({
                    loading: false
                });
                this.props.history.push("/subjects-list");
                this.props.dispatch(clearSubject());
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
                <button onClick={(event) => this.submitHandle(event)}>Add subject</button>
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

        if(parseInt(dataToSubmit.subjectTheoryMarks) + parseInt(dataToSubmit.subjectPracticalMarks) != 100) {
            isFormValid = false;
            this.setState({
                error: "The sum of the theory marks and practical marks must equal 100"
            });
        } else {
            if(isFormValid) {
                document.body.click();
    
                console.log(dataToSubmit);
                this.props.dispatch(addSubject(dataToSubmit));
                this.setState({
                    error: "",
                    loading: true
                });
            }else {
                this.setState({
                    error: "Something must have happened..."
                });
            }
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
    
                        <h2>Add subject</h2>
    
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
        subjects: state.subjects
    }
}

export default connect(mapStateToProps)(AddSubject);