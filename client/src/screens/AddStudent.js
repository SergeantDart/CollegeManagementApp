import React, {Component} from "react";
import FormField from "../components/FormField";
import {connect} from "react-redux";
import {clearFaculties, getFaculties} from "../actions/facultyActions";
import {addStudent, clearStudent} from "../actions/studentActions";
import {clearStudyGroups, getStudyGroups} from "../actions/studyGroupActions";

class AddStudent extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            studentFirstName: {
                element: "input",
                value: "",
                config: {
                    name: "studentFirstName",
                    label: "First name: ",
                    type: "text",
                    placeholder: "Student first name..."
                },
                validation: {
                    required: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentLastName: {
                element: "input",
                value: "",
                config: {
                    name: "studentLastName",
                    label: "Last name: ",
                    type: "text",
                    placeholder: "Student last name..."
                },
                validation: {
                    required: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentEmail: {
                element: "input",
                value: "",
                config: {
                    name: "studentEmail",
                    label: "Email: ",
                    type: "text",
                    placeholder: "Student email..."
                },
                validation: {
                    required: true,
                    email: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentDob: {
                element: "input",
                value: "",
                config: {
                    name: "studentDob",
                    label: "Date of birth: ",
                    placeholder: "Student date of birth..."
                },
                validation: {
                    required: true,
                    date: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentAddress: {
                element: "input",
                value: "",
                config: {
                    name: "studentAddress",
                    label: "Student address: ",
                    placeholder: "Student address..."
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentPhone: {
                element: "input",
                value: "",
                config: {
                    name: "studentPhone",
                    label: "Student phone: ",
                    placeholder: "Student phone..."
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studentIsTaxed: {
                element: "select",
                value: "",
                config: {
                    name: "studentIsTaxed",
                    label: "Student financing option: ",
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
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupId: {
                element: "select",
                value: "",
                config: {
                    name: "studyGroupId",
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
            facultyId: {
                element: "select",
                value: "",
                config: {
                    name: "facultyId",
                    label: "Student faculty: ",
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
        this.props.dispatch(clearStudent());
        this.props.dispatch(clearStudyGroups());
        this.props.dispatch(clearFaculties());
        this.props.dispatch(getFaculties());
        this.props.dispatch(getStudyGroups());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let facultyOptions = [];
        let studyGroupOptions = [];
        if(nextProps.faculties.facultiesList) {
            nextProps.faculties.facultiesList.map((faculty) => {
                facultyOptions.push({
                    id: faculty.facultyId,
                    name: faculty.facultyName
                });
            });
            if(nextProps.studyGroups.studyGroupsList) {
                nextProps.studyGroups.studyGroupsList.studyGroupsData.map((studyGroup) => {
                    studyGroupOptions.push({
                        id: studyGroup.studyGroupId,
                        name: studyGroup.studyGroupId
                    });
                });
            }
            tempFormData.studyGroupId.config.options = studyGroupOptions;
            tempFormData.facultyId.config.options = facultyOptions;

            this.setState({
                formData: tempFormData
            });
        }

        if(nextProps.students.student) {
            if(nextProps.students.student.message) {
                this.setState({
                    error: nextProps.students.student.message
                });
            }else {
                this.setState({
                    loading: true
                });
                this.props.dispatch(clearStudent());
                this.props.history.push("/students-list");
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
                <button onClick={(event) => this.submitHandle(event)}>Add student</button>
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
                error: "",
                loading: true
            });
            this.props.dispatch(addStudent(dataToSubmit));
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
    
                        <h2>Add student</h2>
    
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
                            id={"facultyId"}
                            formData={this.state.formData.facultyId}
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
        students: state.students,
        faculties: state.faculties,
        studyGroups: state.studyGroups
    }
}

export default connect(mapStateToProps)(AddStudent);