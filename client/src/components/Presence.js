import {Component} from "react";
import {useRef} from "react";
import {updatePresence, clearPresence} from "../actions/presenceSheetActions";
import {connect} from "react-redux";

class Presence extends Component {

    state = {
        presenceStatus: null,
        disabled: false,
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.presenceSheets.updatedPresence != null) {
            if(nextProps.presenceSheets.updatedPresence.message) {
                window.alert(nextProps.presenceSheets.updatedPresence.message)
            }else {
                this.setState({
                    disabled: true,
                })
            }
            this.props.dispatch(clearPresence());
        }
    }
    renderPresenceStatusOptions = () => {
        return <select
                value={this.state.presenceStatus}
                defaultValue={this.props.presence.presenceStatus || ""}
                disabled={this.state.disabled}
                name="presence_status"
                onChange={(event) => this.changeHandle(event)}>

                    <option value="" disabled>Choose an option...</option>
                    <option key={0} value={true}>{"Present"}</option>
                    <option key={1} value={false}>{"Absent"}</option>

            </select>
    }

    saveHandle = (presenceId, presence) => {
        this.props.presence.presenceStatus = this.state.presenceStatus;
        this.setState({
            disabled: true
        })
        this.props.dispatch(updatePresence(presenceId, presence))

    }
    renderOptions = () => {
        return (
            <div>
                <div className="edit" onClick={() => this.saveHandle(this.props.presence.presenceId, this.props.presence)}>
                    SAVE
                </div>
            </div>   
        )
    }

    changeHandle = (event) => {
        this.setState({
            presenceStatus: event.target.value
        })
    }

    render() {
        return (
            <div key={this.props.presence.presenceId} className="presence_container">
    
                <h3>
                    {`${this.props.presence.Student.studentFirstName} ${this.props.presence.Student.studentLastName}`}
                </h3>

                {this.renderPresenceStatusOptions()}
    
                {this.renderOptions()}  
    
            </div>
        )
    }
    
}


function mapStateToProps(state) {
    return {
        presenceSheets: state.presenceSheets,
    }
}

export default connect(mapStateToProps)(Presence);