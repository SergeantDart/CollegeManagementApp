import React, {Component} from "react";
import {getProfessorByEmail, clearProfessor} from "../actions/professorActions";
import {getStudentByEmail, clearStudent} from "../actions/studentActions";
import {connect} from "react-redux";

class ChatMessage extends Component {

    state = {
        userName: "",
        loaded: false
    }

    componentWillMount() {
        this.props.dispatch(clearProfessor());
        this.props.dispatch(clearStudent());

        if(this.props.message.user.userId == this.props.currentUser.userId) {
            this.setState({
                userName: "Me",
                loaded: true
            });
        }else {
            if(this.props.message.user.userRole == "admin") {
                this.setState({
                    userName: "ADMIN",
                    loaded: true
                });
            }else if(this.props.message.user.userRole == "professor") {
                this.props.dispatch(getProfessorByEmail(this.props.message.user.userEmail));
            }else if(this.props.message.user.userRole == "student") {
                this.props.dispatch(getStudentByEmail(this.props.message.user.userEmail));
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!this.state.loaded) {
            if(nextProps.students.student) {
                this.setState({
                    userName: `${nextProps.students.student.studentFirstName} ${nextProps.students.student.studentLastName}`,
                    loaded: true
                });
            }
    
            if(nextProps.professors.professor) {
                this.setState({
                    userName: `${nextProps.professors.professor.professorFirstName} ${nextProps.professors.professor.professorLastName}`,
                    loaded: true
                });
            }
        }
    }
    
    render() {
        if(this.state.loaded) {
            return (
                <div className={this.props.message.user.userId == this.props.currentUserId ? "sent_message" : "received_message"}>
                    <p><section id="chat_message_username">{`${this.state.userName}:`}</section> {`${this.props.message.text}`}</p>
                </div>
            )  
        } else {
            return (
                <div className="loader"/>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        students: state.students,
        professors: state.professors
    }
}

export default connect(mapStateToProps)(ChatMessage);
