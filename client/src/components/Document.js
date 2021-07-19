
import React, {Component} from "react";
import {deleteDocument} from "../actions/documentActions";
import Swal from "sweetalert2";
import {firebase} from "../Firebase";
import {connect} from "react-redux";


class Document extends Component  {

    state = {
        isLoaded: false,
        documentPath: "",
        document: {}
    }

    getDocumentURL = (fileName) => {
        firebase.storage().ref("documents").child(fileName).getDownloadURL()
        .then((url) => {
            this.setState({
                isLoaded: true,
                documentPath: url,
                document: this.props.document
            })
        }).catch(error => {
            console.log(error);
        })
    }

    componentWillMount() {
        this.getDocumentURL(this.props.document.documentStoragePath);
    }

    deleteDepartmentHandle = (documentId) => {
        Swal.fire({  
            title: "Are you sure?",  
            text: "You will the delete the document permanently",  
            icon: "warning",  
            showCancelButton: true,  
            confirmButtonColor: "#3085d6",  
            cancelButtonColor: "#d33",  
            confirmButtonText: "Yes!"  
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.dispatch(deleteDocument(documentId));
                firebase.storage().ref("documents").child(this.state.document.documentStoragePath).delete()
                .catch(error => {
                    console.log(error);
                })
            } 
        });    
    }

    openDocumentHandle = () => {
        var link = document.createElement("a");
        link.href = this.state.documentPath;
        link.target = "_blank";
        link.download = this.state.document.documentStoragePath;
        link.click();
    }

    renderOptions = () => {
        return (
            <div className="options">

                <div className="document_open" onClick={() => this.openDocumentHandle()}>
                    OPEN
                </div>
            
                <div className="document_delete" onClick={() => this.deleteDepartmentHandle(this.state.document.documentId)}>
                    DELETE
                </div>

            </div>   
        )
    }

    render() {
        if(this.state.isLoaded) {
            return (
                <div className="document">
                    <a id="doc_download_link" href={this.state.documentPath} download hidden>{this.state.document.documentStoragePath}</a>
                    <h2>
                        {this.state.document.documentTitle}
                        <div className="document_sender">
                            {`Sent from ${this.state.document.User.userEmail}`}
                        </div>
                        <div className="document_message">
                            {this.state.document.documentDescription}
                        </div>
    
                    </h2>
    
                    {this.renderOptions()}
                </div>
            )
        } else {
            return <div className="loader"/>
        }
        
    }    
}
function mapStateToProps(state) {
    return {
        documents: state.documents,
        others: state.others
    }
}

export default connect(mapStateToProps)(Document);