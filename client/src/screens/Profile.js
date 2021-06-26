import React, {Component} from "react";
import FormField from "../components/FormField";
import {connect} from "react-redux";
import {clearUpdatedUser, updateUser, logoutUser} from "../actions/userActions";

class Profile extends Component {

    state = {
        error: "",
        loading: true,
        user: {},
        formData: {

            userEmail: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "user_email",
                    label: "User email: ",
                    type: "text",
                    placeholder: "User email..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
    
            userRole: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "user_role",
                    label: "User role: ",
                    type: "text",
                    placeholder: "User role..."
                },
                validation: {
                    required: true,
                    minLength: 6
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },

            userPassword: {
                element: "input",
                value: "",
                config: {
                    name: "user_password",
                    label: "New password: ",
                    type: "password",
                    placeholder: "New password..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            userPasswordConfirm: {
                element: "input",
                value: "",
                config: {
                    name: "user_password_confirm",
                    label: "Confirm new password: ",
                    type: "password",
                    placeholder: "Confirm new password..."
                },
                validation: {
                    required: true,
                    passwordConfirm: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            }
        }
    };

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearUpdatedUser());
        let userInfo = this.state.formData;

        userInfo.userEmail.value = this.props.users.login.user.userEmail;
        userInfo.userEmail.isValid = true;
        userInfo.userRole.value = this.props.users.login.user.userRole;
        userInfo.userRole.isValid = true;

        this.setState({
            formData: userInfo,
            user: this.props.users.login.user,
            loading: false
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.users.updatedUser) {
            console.log(nextProps);
            this.props.dispatch(logoutUser(this.props.history));
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

        if(data.validation.passwordConfirm) {
            const isValid = data.value == this.state.formData.userPassword.value ? true : false;
            const message =`${!isValid ? `The passwords do not match !` : ""}`;
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
                <button onClick={(event) => this.submitHandle(event)}>Change password</button>
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
            console.log(dataToSubmit);
            this.props.dispatch(updateUser(this.state.user.userId, {
                userPassword: dataToSubmit.userPassword
            }));
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
    
                        <h2>User profile</h2>
    
                        <FormField
                            id={"userEmail"}
                            formData={this.state.formData.userEmail}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"userRole"}
                            formData={this.state.formData.userRole}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"userPassword"}
                            formData={this.state.formData.userPassword}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"userPasswordConfirm"}
                            formData={this.state.formData.userPasswordConfirm}
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
    }
}

export default connect(mapStateToProps)(Profile);