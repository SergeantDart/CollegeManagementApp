import React, {Component} from "react";
import {firebase} from "../Firebase";
import FileUploader from "react-firebase-file-uploader";


class Uploader extends Component {
    state = {
        fileName: "",
        isUploading: false,
        progress: 0,
        fileUrl: ""
    };

    uploadStartHandle = () => {
        this.setState({
            isUploading: true,
            progress: 0
        })
    }

    uploadErrorHandle = (error) => {
        this.setState({
            isUploading: false,
        });
        console.log(error);
    }

    uploadSuccessHandle = (fileName) => {
        console.log(fileName);
        this.setState({
            fileName: fileName,
            progress: 100,
            isUploading: false
        });
        firebase.storage().ref(`${this.props.referencedStoragePath}`)
        .child(fileName).getDownloadURL()
        .then((url) => {
            this.setState({
                fileUrl: url
            });
        })
        .catch((error) => {
            console.log(error);
        })
        
        this.props.storeFileName(fileName);

    }

    progressHandle = (progress) => {
        this.setState({
            progress: progress
        });
    }

    render() {
        return (
            <div>
                <FileUploader
                    accept={`${this.props.acceptedFormat}`}
                    name={`${this.props.name}`}
                    randomizeFilename
                    storageRef={firebase.storage().ref(`${this.props.referencedStoragePath}`)}
                    onUploadStart={this.uploadStartHandle}
                    onUploadError={this.uploadErrorHandle}
                    onUploadSuccess={this.uploadSuccessHandle}
                    onProgress={this.progressHandle}/>
                {this.state.isUploading 
                ? 
                <p>Progress: {this.state.progress}%</p> 
                : 
                null}
                {this.state.fileUrl !== ""
                ? 
                <img src={this.state.fileUrl}/> 
                : 
                null}
            </div>
        );
    }
}

export default Uploader;