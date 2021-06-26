import React, {Component} from "react";
import FormField from "../components/FormField";
import {Editor} from "react-draft-wysiwyg";
import {EditorState} from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import Uploader from "../components/Uploader";
import {addNews, clearNews} from "../actions/newsActions";
import {connect} from "react-redux";


class AddNews extends Component {

    state = {
        editorState: EditorState.createEmpty(),
        postError: "",
        loaded: true,
        formData: {
            newsAuthorName: {
                element: "input",
                value: "",
                config: {
                    label: "Author name:",
                    name: "newsAuthorName",
                    type: "text",
                    placeholder: "Enter your name..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            newsTitle: {
                element: "input",
                value: "",
                config: {
                    label: "News title:",
                    name: "title_input",
                    type: "text",
                    placeholder: "Enter the title..."
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            newsText: {
                element: "text-editor",
                value: "",
                validation : {

                },
                isValid: true
            },
            newsPicturePath: {
                element: "file-uploader",
                value: "",
                validation : {

                },
                isValid: true   
            }
        }
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.news.news) {
            this.props.dispatch(clearNews());
            this.props.history.push("/news-list");
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
                postError: ""
            });
            this.props.dispatch(addNews(dataToSubmit));
        }else {
            console.log("There was an error !");
            this.setState({
                postError: "Something went wrong !"
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
                <button type="submit">Add news</button>
            </div>
        );
    }

    renderError = () => {
        return (
            this.state.postError !== "" 
            ?
            <div className="error">
                {this.state.postError}
            </div>
            :
            ""
        );
    }

    editorStateHandle = (editorState) => {

        let contentState = editorState.getCurrentContent();

        let html = stateToHTML(contentState);

        this.updateForm({id: "newsText"}, html);

        this.setState({
            editorState: editorState
        });
    }


    storeFileName = (fileName) => {
        this.updateForm({id: "newsPicturePath"}, fileName);
    }

    render() {

        if(this.state.loaded) {
            return (
                <div className="add_news_container">
                    <form onSubmit={this.submitHandle}>
                        <h2>Add news</h2>
        
                        <FormField
                            id={"newsAuthorName"}
                            formData={this.state.formData.newsAuthorName}
                            changeHandle={(newFormData) => this.updateForm(newFormData)}/>
        
                        <FormField
                            id={"newsTitle"}
                            formData={this.state.formData.newsTitle}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <Editor
                            editorState={this.state.editorState}
                            wrapperClassName="editor_wrapper"
                            editorClassName="editor"
                            onEditorStateChange={(editorState) => {this.editorStateHandle(editorState)}}/>
                
                        <Uploader name="image" acceptedFormat="image/*" referencedStoragePath="pictures" storeFileName={(fileName) => this.storeFileName(fileName)}/>
        
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
        news: state.news
    }
}

export default connect(mapStateToProps)(AddNews);

