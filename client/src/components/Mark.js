import {Component} from "react";
import FormField from "../components/FormField";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";

class Mark extends Component {

    state = {
        mark: {},
        error: "",
        edit: false,
        loading: false,
        formData: {
            theoryMarkScore: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "theoryMarksScore",
                    type: "text",
                    placeholder: "Theory score..."
                },
                validation: {
                    required: false,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            practicalMarkScore: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "practicalMarksScore",
                    type: "text",
                    placeholder: "Practical score..."
                },
                validation: {
                    required: false
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            }
        }
    };

    componentWillMount() {
        console.log(this.props);
        let tempFormData = this.state.formData;
        for (var key of Object.keys(tempFormData)) {
            tempFormData[key].value = this.props.mark[key]
            tempFormData[key].isValid = true;
        }

        this.setState({
            mark: this.props.mark,
            formData: tempFormData,
            loading: false
        });
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

        if(data.validation.notGreaterThan) {
            const isValid = data.value >= 0 && data.value <= data.validation.notGreaterThan ? true : false;
            const message = `${!isValid ? `Invalid grade ! Check subject details` : ""}`;
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
            let tempFormData = this.state.formData;
            for(let key in tempFormData) {
                tempFormData[key].config.disabled = true;
            }
            dataToSubmit["isGraded"] = true;
            if(dataToSubmit["theoryMarkScore"] > 0 && dataToSubmit["theoryMarkScore"] <= this.props.subjectTheoryMarks && dataToSubmit["practicalMarkScore"] > 0 && dataToSubmit["practicalMarkScore"] <= this.props.subjectPracticalMarks) {
                document.body.click();
                console.log(dataToSubmit)
                this.setState({
                    error: "",
                    formData: tempFormData
                });
                this.props.updateMark(this.state.mark.markId, dataToSubmit);
            } else {
                Swal.fire({  
                    icon: 'error',  
                    title: 'Oops...',  
                    text: 'Check the marks percentage in the subjects description!',  
                  }).then((result) => {
                    if (result.isConfirmed) {
                        let tempFormData = this.state.formData;
                        for (var key of Object.keys(tempFormData)) {
                            tempFormData[key].value = this.props.mark[key]
                            tempFormData[key].isValid = true;
                        }
                        this.setState({
                            formData: tempFormData
                        });
                        //window.location.reload();
                    } 
                  })    
            }

            //TODO
        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
        this.setState({
            edit: false
        })
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
                <div>
                    <div className="mark_container">
                        <div className="student_name">
                        <Link to={{
                            pathname:`/student/${this.state.mark.Student.studentId}`,
                            state: {fromDashboard: true }}}>
                                {`${this.state.mark.Student.studentFirstName} ${this.state.mark.Student.studentLastName}`}
                        </Link>
                        </div>
                        <div className="mark">
                            <div className="theory">
                                <FormField
                                    id={"theoryMarkScore"}
                                    formData={this.state.formData.theoryMarkScore}
                                    changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            </div>
                            <div className="practical">
                                <FormField
                                    id={"practicalMarkScore"}
                                    formData={this.state.formData.practicalMarkScore}
                                    changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            </div>
                        </div>
                            
                        {this.renderButton()}
                        {this.renderError()}

                    </div>
                    
                    
                </div>
                
            );
        }else {
            return (
                <div className="loading"/>
            )
        }
        
    }
}

function mapStateToProps(state) {
    return {
        marks: state.marks
    }
}

export default connect(mapStateToProps)(Mark);