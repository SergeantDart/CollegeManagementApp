import React, {Component} from "react";
import {connect} from "react-redux";
import {deleteStudent, getStudents, clearStudent, clearStudents} from "../actions/studentActions";
import {countEsentials} from "../actions/otherActions";
import Student from "../components/Student";
import Swal from "sweetalert2";


class StudentsList extends Component {
    state = {
        labels: {
                    studentId: "ID",
                    studentFirstName: "First name",
                    studentLastName: "Last name",
                    studentDob: "DOB",
                    studentEmail: "Email",
                    studyGroupId: "Study group",
                    studentAddress: "Address",
                    studentIsTaxed: "Taxed",
                    StudyYear: {
                        studyYearOrder: "Year"
                    },
                    Faculty: {
                        facultyName: "Faculty"
                    }
        },
        students: [],
        studentsCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }

    data = {
        studentsCount: 0
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearStudents());
        this.props.dispatch(getStudents(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.others.counts) {
            if(nextProps.students.studentsList) {
                let students = nextProps.students.studentsList.studentsData;
                this.setState({
                    students: students,
                    offset: nextProps.students.studentsList.offset,
                    limit: nextProps.students.studentsList.limit,
                    studentsCount: nextProps.others.counts.studentsCount,
                    loaded: true
                });
            }
            if(nextProps.students.deletedStudent) {
                window.location.reload();
                this.props.dispatch(clearStudent());
            }
        }
    }

    renderStudents = (studentsList) => {
        return studentsList.map(student => {
            return (
                <Student key={student.studentId} student={student} aboutStudent={this.aboutStudent} deleteStudent={this.deleteStudent} type="info" userRole={this.props.users.login.user.userRole}/>
            );
        })
    }

    renderLabels = (labels) => {
        return <Student student={labels} type="label" userRole={this.props.users.login.user.userRole}/>
    }

    renderAddStudentButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-student")}>
                    Add student
            </div>
   
        );
    }


    renderNavButtons = () => {
        return (
            <div className="list_nav_buttons">
                <div className="prev" onClick={() => this.loadPrev(this.state.offset, this.state.limit)}>
                    Prev
                </div>
                <div className="next" onClick={() => this.loadNext(this.state.offset, this.state.limit)}>
                    Next
                </div>
            </div>
        )
    }

    aboutStudent = (studentId) => {
        this.props.history.push(`/student/${studentId}`);
    }

    deleteStudent = (studentId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will the student and all the data asociated with it (marks, presences, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.dispatch(deleteStudent(studentId));
            } 
        });    
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.studentsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getStudents(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getStudents(offset - limit, limit));
        }
    }



    render() {
        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Students list</h1>

                    {this.props.users.login.user.userRole == "admin" ? this.renderAddStudentButton() : null}

                    <div>

                        {this.state.students.length > 0 ? this.renderLabels(this.state.labels) : <div className="message">No students yet.</div>}
                        {this.state.students.length > 0 ? this.renderStudents(this.state.students) : null}

                    </div>

                    {this.state.students.length > 0 ? this.renderNavButtons() : null}

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
        students: state.students,
        others: state.others
    }
}

export default connect(mapStateToProps)(StudentsList);