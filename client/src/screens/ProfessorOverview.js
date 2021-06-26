import React, {Component} from "react";
import {connect} from "react-redux";
import {getProfessorByEmail, clearProfessor} from "../actions/professorActions";

class ProfessorOverview extends Component {
    

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearProfessor());
        this.props.dispatch(getProfessorByEmail(this.props.users.login.user.userEmail));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.professors.professor) {
            this.props.history.push(`/professor/${nextProps.professors.professor.professorId}`)
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
        professors: state.professors
    }
}

export default connect(mapStateToProps)(ProfessorOverview);