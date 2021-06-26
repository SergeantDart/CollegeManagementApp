import React, {Component} from "react";
import FormField from "../components/FormField";
import {connect} from "react-redux";
import {addPresenceSheet, clearPresenceSheet, getPresencesByPresenceSheet, clearPresences} from "../actions/presenceSheetActions";
import moment from "moment";
import Presence from "../components/Presence";

class AddPresenceSheet extends Component {

    state = {
        isPresenceSheetDone: false,
        isPresencesListLoaded: false,
        presenceSheet: {},
        presences: [],
        error: "",
        loading: false,
        formData: {
            presenceSheetDate: {
                element: "input",
                value: "",
                config: {
                    name: "presence_sheet_date",
                    label: "Presence sheet date: ",
                    type: "text",
                    placeholder: "Enter date format DD/MM/YYYY..."
                },
                validation: {
                    required: true,
                    date: true
                },
                valid: false,
                isBlurred: false,
                validationMessage: ""
            },
            presenceSheetRemarks: {
                element: "input",
                value: "",
                config: {
                    name: "presence_sheet_remarks",
                    label: "Remarks: ",
                    type: "text",
                    placeholder: "Remarks..."
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
        this.props.dispatch(clearPresenceSheet());
        this.props.dispatch(clearPresences());
        this.setState({
            isPresenceSheetDone: false,
            isPresencesListLoaded: false
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.presenceSheets.presenceSheet) {
            this.setState({
                presenceSheet: nextProps.presenceSheets.presenceSheet,
                isPresenceSheetDone: true,
                loading: false
            });
            this.props.dispatch(getPresencesByPresenceSheet(this.state.presenceSheet.presenceSheetId));
        }

        if(nextProps.presenceSheets.presencesList) {
            this.setState({
                presences: nextProps.presenceSheets.presencesList,
                isPresencesListLoaded: true,
                loading: false
            })
        }
    }

    renderPresencesList = (presences) => {
        return presences.map(presence => {
            return (
                <Presence presence={presence}/>
            );
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
                <button onClick={(event) => this.submitHandle(event)}>GENERATE</button>
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
            dataToSubmit["courseId"] = this.props.courseId;
            document.body.click();
            this.setState({
                error: "",
                loading: true
            });
            this.props.dispatch(addPresenceSheet(dataToSubmit));

        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
    }


    renderCompleteButton = () => {
        return <button id="complete_button" onClick={() => this.props.addPresenceSheetHandle()}>COMPLETE</button>
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
            if(this.state.isPresenceSheetDone == false) {
                return (
                    <div className="add_presences_container"> 
                            <h2>Presence sheet</h2>
        
                            <FormField
                                id={"presenceSheetDate"}
                                formData={this.state.formData.presenceSheetDate}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            <FormField
                                id={"presenceSheetRemarks"}
                                formData={this.state.formData.presenceSheetRemarks}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
    
                            {this.renderSubmitButton()}
                            {this.renderError()}
        
                    </div>
                );
            }else {
                return (
                    <div className="add_presences_container">
                        <div className="report_title">
                            {`Presence report for date - ${moment(this.state.presenceSheet.presenceSheetDate).format("DD/MM/YYYY")}`}
                        </div>
                        {this.renderPresencesList(this.state.presences)}
                        {this.renderCompleteButton()}
                    </div>
                )
            }
           
        }else {
            return (
                <div className="loader"/>
            )
        }
        
    }
}

function mapStateToProps(state) {
    return {
        presenceSheets: state.presenceSheets
    }
}

export default connect(mapStateToProps)(AddPresenceSheet);