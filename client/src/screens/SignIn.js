import React, {Component} from "react";
import FormField from "../components/FormField";
import {loginUser} from "../actions/userActions";
import {connect} from "react-redux";

class SignIn extends Component {

    state = {
        error: "",
        isLoading: false,
        formData: {
            userEmail: {
                element: "input",
                value: "",
                config: {
                    name: "email_input",
                    type: "email",
                    placeholder: "Enter your email..."
                },
                validation: {
                    required: true,
                    email: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            userPassword: {
                element: "input",
                value: "",
                config: {
                    name: "password_input",
                    type: "password",
                    placeholder: "Enter your password..."
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            }
            
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            isLoading: false,
            error: nextProps.users.login.logInMessage ? nextProps.users.login.logInMessage : ""
        });
        if(nextProps.users.login.user) {
            this.props.history.push("/");
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

        return error;
    }

    fetchSubmitButton = () => {
        return (
            this.state.isLoading 
            ? 
            <div className="loader"/>
            :
            <div>
                <button onClick={(event) => this.submitHandle(event)}>Log in</button>
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
                isLoading: true,
                registerError: ""
            });
            this.props.dispatch(loginUser(dataToSubmit));
                 
        }
    }
    
    fetchError = () => {
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
        if(!this.props.users.login.isAuth) {
            return (
                <div className="add_container">
                    <form>
    
                        <h2>Log in</h2>
    
                        <FormField
                            id={"userEmail"}
                            formData={this.state.formData.userEmail}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"userPassword"}
                            formData={this.state.formData.userPassword}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
    
                        {this.fetchSubmitButton()}
                        {this.fetchError()}
    
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
        users: state.users
    }
}

export default connect(mapStateToProps)(SignIn);