import React, {Component} from "react";
import {connect} from "react-redux";
import {getStudentByEmail, clearStudent} from "../actions/studentActions";

class StudentOverview extends Component {
    

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearStudent());
        this.props.dispatch(getStudentByEmail(this.props.users.login.user.userEmail));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.students.student) {
            this.props.history.push(`/student/${nextProps.students.student.studentId}`)
        }
    }

    render() {
        return(
            <div/>
        )
    }
}

function mapStateToProps(state) {
    return {
        students: state.students
    }
}

export default connect(mapStateToProps)(StudentOverview);