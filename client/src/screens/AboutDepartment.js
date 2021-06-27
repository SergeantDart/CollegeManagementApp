import {Component} from "react";
import {clearProfessors, getProfessorsByDepartmentId} from "../actions/professorActions";
import {getDepartment, clearDepartment, updateDepartment} from "../actions/departmentActions";
import {getFaculties, clearFaculties} from "../actions/facultyActions";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import moment from "moment";
import {Link} from "react-router-dom";

class AboutDepartment extends Component {

    state = {
        edit: false,
        department: null,
        professors: [],
        error: "",
        loading: false,
        formData: {
            departmentName: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
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
                    disabled: true,
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
                    disabled: true,
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
        this.props.dispatch(clearFaculties());
        this.props.dispatch(clearDepartment());
        this.props.dispatch(clearProfessors());

        this.props.dispatch(getFaculties());
        this.props.dispatch(getDepartment(this.props.match.params.id));
        this.props.dispatch(getProfessorsByDepartmentId(this.props.match.params.id));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.faculties.facultiesList) {
            if(nextProps.professors.professorsList) {
                if(nextProps.departments.department) {

                    let tempFormData = this.state.formData;
                    let facultyOptions = [];
    
                    nextProps.faculties.facultiesList.map((faculty) => {
                        facultyOptions.push({
                            id: faculty.facultyId,
                            name: faculty.facultyName
                        });
                    });
    
                    for (var key of Object.keys(tempFormData)) {
                        tempFormData[key].value = nextProps.departments.department[key];
                        tempFormData[key].isValid = true;
                    }
                    
                    tempFormData.facultyId.config.options = facultyOptions;

                    tempFormData.facultyId.defaultValue = nextProps.departments.department.facultyId;
                    tempFormData.facultyId.value = nextProps.departments.department.facultyId;
        
                    this.setState({
                        department: nextProps.departments.department,
                        professors: nextProps.professors.professorsList,
                        formData: tempFormData,
                        loading: false
                    }); 
                }
    
            }
            
            if(nextProps.departments.updatedDepartment) {
                if(nextProps.departments.updatedDepartment.message) {
                    this.setState({
                        error: nextProps.departments.updatedDepartment.message
                    });
                }else {
                    this.setState({
                        edit: false
                    });
                    this.props.dispatch(clearDepartment());
                    this.props.history.push("/departments-list");
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

    cancelHandle = () => {
        let tempFormData = this.state.formData;

        for (var key of Object.keys(tempFormData)) {
            tempFormData[key].value = this.state.department[key];
            tempFormData[key].isValid = true;
            tempFormData[key].config.disabled = true;
            tempFormData[key].isBlurred = false;
        }

        tempFormData.facultyId.defaultValue =this.state.department.facultyId;
        tempFormData.facultyId.value = this.state.department.facultyId;


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

        if(isFormValid) {
            document.body.click();
            this.props.dispatch(updateDepartment(this.state.department.departmentId, dataToSubmit));
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

    renderProfessors = (professorsList) => {
        if(professorsList.length > 0) {
            return professorsList.map(professor => {
                return (
                    <div className="department_professor">
                        <Link to={{
                            pathname:`/professor/${professor.professorId}`,
                            state: {fromDashboard: true }}}>
                                {`# ${professor.professorFirstName} ${professor.professorLastName}`}
                        </Link>
                    </div>
    
                )
            });
        } else {
            return (
                <div className="message">No professors enrolled yet in this department.</div>
            )
        }

    }


    render() {
        if(!this.state.loading && this.state.department) {
            return (
                <div className="about_container">
                    <div className="about_left_container">

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


                        {this.renderButton()}
                        {this.renderError()}

                    </div>
                    <div className="more">
                         <h2>Professors: </h2>
                         {this.renderProfessors(this.state.professors)}
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
        faculties: state.faculties
    }
}


export default connect(mapStateToProps)(AboutDepartment);