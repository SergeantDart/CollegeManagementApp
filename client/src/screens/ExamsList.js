import React, {Component} from "react";
import {connect} from "react-redux";
import {getExams, clearExams, clearExam, deleteExam, getExamsByProfessorEmail, getExamsByStudentEmail, getFilteredExams} from "../actions/examActions";
import {countEsentials} from "../actions/otherActions";
import Exam from "../components/Exam";
import Swal from "sweetalert2";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class ExamsList extends Component {
    state = {
        customList: false,
        labels: {
                examId: "ID",
                Course: {
                    courseName: "Course",
                    studyGroupId: "StudyGroup"
                },
                examDate: "Date",
                examIsOnline: "Form"
            },

        exams: [],
        examsCount: 0,
        offset: 0,
        limit: 10,
        loaded: false,
        dummy: false,
        keyword: "",
        navButtons: true
    }


    UNSAFE_componentWillMount() {
        this.props.dispatch(clearExams());
        this.props.dispatch(getExams(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.others.counts) {
            if(nextProps.exams.examsList) {
                let exams = nextProps.exams.examsList.examsData;
                this.setState({
                    exams: exams,
                    offset: nextProps.exams.examsList.offset,
                    limit: nextProps.exams.examsList.limit,
                    examsCount: nextProps.others.counts.examsCount,
                    loaded: true
                });
            }
            if(nextProps.exams.filteredExamsList) {
                this.setState({
                    exams: nextProps.exams.filteredExamsList,
                    loaded: true
                })
            }
        }
        if(nextProps.exams.deletedExam) {
            window.location.reload();
            this.props.dispatch(clearExam());
        }

        if(nextProps.exams.keywordFilteredExamsList) {
            this.setState({
                exams: nextProps.exams.keywordFilteredExamsList.examsData,
                offset: 0,
                loaded: true
            });
        }
    }

    renderExams = (examsList) => {
        return examsList.map(exam => {
            return (
                <Exam key={exam.examId} exam={exam} aboutExam={this.aboutExam} deleteExam={this.deleteExam} type="info" userRole={this.props.users.login.user.userRole}/>
            );
        });   
    }

    renderLabels = (labels) => {
        return <Exam exam={labels} type="label" userRole={this.props.users.login.user.userRole}/>
    }

    renderAddExamButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-exam")}>
                    Add exam
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

    aboutExam = (examId) => {
        this.props.history.push(`/exam/${examId}`);
    }

    deleteExam = (examId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will the exam and all the data asociated with it.',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.dispatch(deleteExam(examId));
            } 
        });    
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.examsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getExams(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getExams(offset - limit, limit));
        }
    }

    loadAllExamsHandle = () => {
        this.props.dispatch(clearExams());
        this.props.dispatch(getExams(this.state.offset, this.state.limit));
        this.setState({
            customList: false,
            loaded: false,
            keyword: ""
        })
    }

    loadProfessorExamsHandle = (professorEmail) => {
        this.props.dispatch(clearExams());
        this.props.dispatch(getExamsByProfessorEmail(professorEmail));
        this.setState({
            customList: true,
            loaded: false,
            keyword: ""
        });
    }

    loadStudentExamsHandle = (studentEmail) => {
        this.props.dispatch(clearExams());
        this.props.dispatch(getExamsByStudentEmail(studentEmail));
        this.setState({
            customList: true,
            loaded: false,
            keyword: ""
        });
    }

    changeHandle = (value) => {
        this.setState({
            keyword: value
        });

        this.props.dispatch(clearExams());

        if(value != "") {
            if((value.length >= 3 || !isNaN(value)) && this.state.keyword.length <= value.length) {
                setTimeout(() => { 
                    this.props.dispatch(getFilteredExams(value));
                    this.setState({
                        navButtons: false,
                    });
                }, 500);
            }
        } else {
            this.props.dispatch(getExams(this.state.offset, this.state.limit));
            this.setState({
                loaded: false,
                navButtons: true
            });
        }
    }

    renderProfessorExamsButton = () => {
        return !this.state.customList
                ?
                <button onClick={() => this.loadProfessorExamsHandle(this.props.users.login.user.userEmail)}>GET MY EXAMS</button>
                :
                <button onClick={() => this.loadAllExamsHandle()}>GET ALL EXAMS</button>
    }

    renderStudentCoursesButton = () => {
        return !this.state.customList
        ?
        <button onClick={() => this.loadStudentExamsHandle(this.props.users.login.user.userEmail)}>GET MY EXAMS</button>
        :
        <button onClick={() => this.loadAllExamsHandle()}>GET ALL EXAMS</button>
    }



    render() {
        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Exams list</h1>
                    
                    {this.props.users.login.user.userRole == "admin" ? this.renderAddExamButton() : null}

                    {this.props.users.login.user.userRole == "professor" ? this.renderProfessorExamsButton() : null}

                    {this.props.users.login.user.userRole == "student" ? this.renderStudentCoursesButton() : null}

                    <FontAwesomeIcon id="search_icon" icon={faSearch}/>
                    <input className="search_input" value={this.state.keyword} onChange={(event) => this.changeHandle(event.target.value)} placeholder="Enter keyword..."/>

                    <div>

                        {this.state.exams.length > 0 ? this.renderLabels(this.state.labels) : <div className="message">No exams programmed yet.</div>}
                        {this.state.exams.length > 0 ? this.renderExams(this.state.exams) : null}

                    </div>

                    {!this.state.customList && this.state.exams.length > 0 && this.state.navButtons ? this.renderNavButtons() : null}

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
        exams: state.exams,
        others: state.others
    }
}

export default connect(mapStateToProps)(ExamsList);