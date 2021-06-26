import {Component} from "react";
import {getDepartments} from "../actions/departmentActions";
import {addProfessor, clearProfessor} from "../actions/professorActions";
import FormField from "../components/FormField";
import {connect} from "react-redux";

class AddProfessor extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            professorFirstName: {
                element: "input",
                value: "",
                config: {
                    name: "professorFirstName",
                    label: "First name: ",
                    type: "text",
                    placeholder: "Professor first name..."
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
                    placeholder: "Professor last name..."
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
                    placeholder: "Professor email..."
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
                    placeholder: "Professor date of birth..."
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
                    placeholder: "Professor address..."
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
                    placeholder: "Professor phone..."
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
                    placeholder: "Professor salary..."
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
                    options: []
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
        this.props.dispatch(getDepartments());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let departmentOptions = [];
        if(nextProps.departments.departmentsList) {
            nextProps.departments.departmentsList.departmentsData.map((department) => {
                departmentOptions.push({
                    id: department.departmentId,
                    name: department.departmentName
                });
            });
            tempFormData.departmentId.config.options = departmentOptions;

            this.setState({
                formData: tempFormData
            });
        }

        if(nextProps.professors.professor) {
            if(nextProps.professors.professor.message) {
                this.setState({
                    error: nextProps.professors.professor.message
                });
            }else {
                this.setState({
                    loading: true
                });
                this.props.dispatch(clearProfessor());
                this.props.history.push("/professors-list");
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
                <button onClick={(event) => this.submitHandle(event)}>Add professor</button>
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
            isFormValid = isFormValid && this.state.formData[key].isValid && this.state.formData[key].value != "" ? true : false;
        }

        if(isFormValid) {
            document.body.click();
            this.setState({
                error: ""
            });
            this.props.dispatch(addProfessor(dataToSubmit));
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
    
                        <h2>Add professor</h2>
    
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
        professors: state.professors,
        departments: state.departments,
    }
}

export default connect(mapStateToProps)(AddProfessor);