import React, {Component} from "react";
import {connect} from "react-redux";
import {getProfessors, deleteProfessor, clearProfessor} from "../actions/professorActions";
import {countEsentials} from "../actions/otherActions";
import Professor from "../components/Professor";
import Swal from "sweetalert2";


class ProfessorsList extends Component {

    state = {
        labels: {
                    professorId: "ID",
                    professorFirstName: "First name",
                    professorLastName: "Last name",
                    professorDob: "DOB",
                    professorEmail: "Email",
                    professorSalary: "Study group",
                    Department: {
                        departmentName: "Department"
                    }
        },
        professors: [],
        professorsCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }


    UNSAFE_componentWillMount() {
        this.props.dispatch(getProfessors(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.others.counts) {
            if(nextProps.professors.professorsList) {
                let professors = nextProps.professors.professorsList.professorsData;
                console.log(professors)
                this.setState({
                    professors: professors,
                    offset: nextProps.professors.professorsList.offset,
                    limit: nextProps.professors.professorsList.limit,
                    professorsCount: nextProps.others.counts.professorsCount,
                    loaded: true
                });
            }
        }

        if(nextProps.professors.deletedProfessor) {
            window.location.reload();
            this.props.dispatch(clearProfessor());
        }
    }

    renderProfessors = (professorsList) => {
        return professorsList.map(professor => {
            return (
                <Professor key={professor.studentId} professor={professor} aboutProfessor={this.aboutProfessor} deleteProfessor={this.deleteProfessor} type="info" userRole={this.props.users.login.user.userRole}/>
            );
        })
    }

    renderLabels = (labels) => {
        return <Professor professor={labels} type="label" userRole={this.props.users.login.user.userRole}/>
    }

    renderAddProfessorButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-professor")}>
                    Add professor
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

    aboutProfessor = (professorId) => {
        this.props.history.push(`/professor/${professorId}`);
    }

    deleteProfessor = (professorId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will the professor and all the data asociated with it (courses, exams, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.dispatch(deleteProfessor(professorId));
            } 
        });    
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.professorsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getProfessors(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getProfessors(offset - limit, limit));
        }
    }



    render() {
        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Professors list</h1>
                    
                    {this.props.users.login.user.userRole == "admin" ? this.renderAddProfessorButton() : null}

                    <div>

                        {this.state.professors.length > 0 ? this.renderLabels(this.state.labels) : null}
                        {this.state.professors.length > 0 ? this.renderProfessors(this.state.professors) : <div className="message">No professors yet.</div>}

                    </div>

                    {this.state.professors.length > 0 ? this.renderNavButtons() : null}

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
        professors: state.professors,
        others: state.others
    }
}

export default connect(mapStateToProps)(ProfessorsList);