import React, {Component} from "react";
import FormField from "../components/FormField";
import Uploader from "../components/Uploader";
import {connect} from "react-redux";
import {clearDocument, sendDocument} from "../actions/documentActions";
import Swal from "sweetalert2";

class SendDocument extends Component {

    state = {
        error: "",
        loaded: true,
        formData: {
            documentTitle: {
                element: "input",
                value: "",
                config: {
                    label: "Document title: ",
                    name: "document_title_input",
                    type: "text",
                    placeholder: "Enter your document title..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            documentDescription: {
                element: "input",
                value: "",
                config: {
                    label: "Document description:",
                    name: "document_description_input",
                    type: "text",
                    placeholder: "Enter the doc description..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            documentStoragePath: {
                element: "file-uploader",
                value: "",
                validation : {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: "" 
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.documents.document) {
            this.props.dispatch(clearDocument());
            this.setState({
                loaded: true,
            })
            Swal.fire({  
                icon: "succes",  
                title: "Done",  
                text: "Your file was sent to the administration !",  
              });
            this.props.history.push("/");
        }
    }


    updateForm = (formResponse, content = "") => {
        let newFormData = {...this.state.formData}
        let newElement = {...newFormData[formResponse.id]};

        if(content === ""){
            newElement.value = formResponse.event.target.value;
        }else {
            newElement.value = content;
        }

        if(formResponse.isBlurred || !formResponse.isBlurred){
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
        return error;
    }

    submitHandle = (event) => {
        event.preventDefault();

        let dataToSubmit = {};
        let isFormValid = true;

        for(let key in this.state.formData) {
            dataToSubmit[key] = this.state.formData[key].value;
        }

        for(let key in this.state.formData) {
            isFormValid = this.state.formData[key].isValid && isFormValid ? true : false;
        }


        if(isFormValid) {
            this.setState({
                loaded: false,
                error: ""
            });
            console.log(dataToSubmit);
            this.props.dispatch(sendDocument(this.props.users.login.user.userId, dataToSubmit));
        }else {
            console.log("There was an error !");
            this.setState({
                error: "Something went wrong !"
            });
        }
    }

    renderSubmitButton = () => {
        return (
            this.state.isLoading 
            ? 
            <div>
                Loading...
            </div>
            :
            <div>
                <button type="submit">SEND</button>
            </div>
        );
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


    storeFileName = (fileName) => {
        this.updateForm({id: "documentStoragePath"}, fileName);
    }

    render() {

        if(this.state.loaded) {
            return (
                <div className="send_document_container">
                    <form onSubmit={this.submitHandle}>
                        <h2>Send document to administration</h2>
        
                        <FormField
                            id={"documentTitle"}
                            formData={this.state.formData.documentTitle}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
        
                        <FormField
                            id={"documentDescription"}
                            formData={this.state.formData.documentDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <h3>Attach a document: </h3>
                        <Uploader name="document" acceptedFormat=".doc,.docx,application/pdf" referencedStoragePath="documents" storeFileName={(fileName) => this.storeFileName(fileName)}/>
        
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
        documents: state.documents
    }
}

export default connect(mapStateToProps)(SendDocument);

