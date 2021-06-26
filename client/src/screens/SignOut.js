import React, {Component} from "react";
import {logoutUser} from "../actions/userActions";
import {connect} from "react-redux";

class Logout extends Component {

    UNSAFE_componentWillMount() {
        this.props.dispatch(logoutUser(this.props.history));
    }

    render() {
        return (
            <div className="logout_container">
                <h1>Sorry to see you go...</h1>
            </div>
        );
    }
    

}
    

function mapStateToProps(state) {
    return {
        users: state.users
    };
}
export default connect(mapStateToProps)(Logout);