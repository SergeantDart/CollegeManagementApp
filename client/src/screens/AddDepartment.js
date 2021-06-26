import {Component} from "react";
import {connect} from "react-redux";
import {getFaculties, clearFaculties} from "../actions/facultyActions";
import {addDepartment, clearDepartment} from "../actions/departmentActions";
import FormField from "../components/FormField";

class AddDepartment extends Component {

    state = {
        error: "",
        loading: false,
        formData: {
            departmentName: {
                element: "input",
                value: "",
                config: {
                    name: "department_name",
                    label: "Department name: ",
                    type: "text",
                    placeholder: "Department name..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            departmentDescription: {
                element: "input",
                value: "",
                config: {
                    name: "department_description",
                    label: "Department description: ",
                    type: "text",
                    placeholder: "Department description..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            facultyId: {
                element: "select",
                value: "",
                config: {
                    name: "faculty_id",
                    label: "Faculty: ",
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
        this.props.dispatch(clearDepartment());
        this.props.dispatch(clearFaculties());
        this.props.dispatch(getFaculties());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        console.log(nextProps);
        let tempFormData = this.state.formData;
        let facultyOptions = [];

        if(nextProps.faculties.facultiesList) {
        
            nextProps.faculties.facultiesList.map((faculty) => {
                facultyOptions.push({
                    id: faculty.facultyId,
                    name: faculty.facultyName
                });
            });


            tempFormData.facultyId.config.options = facultyOptions;
    
            this.setState({
                formData: tempFormData
            });
        
        }

        if(nextProps.departments.department) {
            if(nextProps.departments.department.message) {
                this.setState({
                    loading: false,
                    error: nextProps.departments.department.message
                });
            }else {
                this.setState({
                    loading: false
                });
                this.props.history.push("/departments-list");
                this.props.dispatch(clearDepartment());
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
                <button onClick={(event) => this.submitHandle(event)}>Add department</button>
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
            this.props.dispatch(addDepartment(dataToSubmit));
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
    
                        <h2>Add department</h2>
    
                        <FormField
                            id={"departmentName"}
                            formData={this.state.formData.departmentName}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"departmentDescription"}
                            formData={this.state.formData.departmentDescription}
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
        departments: state.departments,
        faculties: state.faculties
    }
}

export default connect(mapStateToProps)(AddDepartment);