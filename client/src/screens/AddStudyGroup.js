import {Component} from "react";
import {getFaculties} from "../actions/facultyActions";
import {getStudyYears} from "../actions/studyYearActions";
import {addStudyGroup, getLastStudyGroupId, clearLastStudyGroupId, clearStudyGroup} from "../actions/studyGroupActions";
import FormField from "../components/FormField";
import {connect} from "react-redux";

class AddStudyGroup extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            studyGroupId: {
                element: "input",
                value: "",
                config: {
                    name: "studyGroupId",
                    label: "Study group no.: ",
                    type: "text",
                    placeholder: "Study group number..."
                },
                validation: {
                    required: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupDescription: {
                element: "input",
                value: "",
                config: {
                    name: "studyGroupDescription",
                    label: "Description: ",
                    type: "text",
                    placeholder: "Study group description..."
                },
                validation: {
                    required: true,
                    minLength: 6
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
                    label: "Faculty: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyYearId: {
                element: "select",
                value: "",
                config: {
                    name: "studyYearId",
                    label: "Study year: ",
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
        this.props.dispatch(clearStudyGroup());
        this.props.dispatch(getLastStudyGroupId());
        this.props.dispatch(getFaculties());
        this.props.dispatch(getStudyYears());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let facultyOptions = [];
        let studyYearOptions = [];
        if(nextProps.studyGroups.lastStudyGroupId != null) {
            if(nextProps.faculties.facultiesList) {
                if(nextProps.studyYears.studyYearsList) {
                    nextProps.faculties.facultiesList.map(faculty => {
                        facultyOptions.push({
                            id: faculty.facultyId,
                            name: faculty.facultyName
                        });
                    });
                    nextProps.studyYears.studyYearsList.map(studyYear => {
                        studyYearOptions.push({
                            id: studyYear.studyYearId,
                            name: studyYear.studyYearOrder
                        });
                    });

                    tempFormData.facultyId.config.options = facultyOptions;
                    tempFormData.studyYearId.config.options = studyYearOptions;

                    tempFormData.studyGroupId.value = nextProps.studyGroups.lastStudyGroupId + 1;
                    tempFormData.studyGroupId.valid = true;
                    tempFormData.studyGroupId.isBlurred = true;
                    
                    this.setState({
                        formData: tempFormData
                    });

                    
                }
            }
        }

        if(nextProps.studyGroups.studyGroup) {
            if(nextProps.studyGroups.studyGroup.message) {
                this.setState({
                    error: nextProps.studyGroups.studyGroup.message
                });
            }else {
                this.setState({
                    loading: true
                });
                this.props.dispatch(clearLastStudyGroupId());
                this.props.dispatch(clearStudyGroup());
                this.props.history.push("/studygroups-list");
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
                <button onClick={(event) => this.submitHandle(event)}>Add study group</button>
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
            if(key == "studyGroupId") {
                isFormValid = true
            } else {
                isFormValid = isFormValid && this.state.formData[key].isValid ? true : false;
            }
        }

        if(isFormValid) {
            document.body.click();
            this.setState({
                error: "",
                loading: true
            });
            this.props.dispatch(addStudyGroup(dataToSubmit));
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
    
                        <h2>Add study group</h2>
    
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
        studyGroups: state.studyGroups,
        faculties: state.faculties,
        studyYears: state.studyYears
    }
}

export default connect(mapStateToProps)(AddStudyGroup);