import React, {Component} from "react";
import {connect} from "react-redux";
import {countEsentials} from "../actions/otherActions";
import {clearSubjects, clearSubject, getSubjects} from "../actions/subjectActions";
import Subject from "../components/Subject";

class SubjectsList extends Component {
    state = {
        subjects: [],
        subjectsCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearSubjects());
        this.props.dispatch(countEsentials());
        this.props.dispatch(getSubjects(this.state.offset, this.state.limit));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.others.counts) {
            if(nextProps.others.counts.subjectsCount) {
                if(nextProps.subjects.subjectsList) {
                    let subjects = nextProps.subjects.subjectsList.subjectsData;
                    this.setState({
                        subjects: subjects,
                        offset: nextProps.subjects.subjectsList.offset,
                        limit: nextProps.subjects.subjectsList.limit,
                        subjectsCount: nextProps.others.counts.subjectsCount,
                        loaded: true
                    });
                }   
            }

            if(nextProps.subjects.deletedSubject) { 
                window.location.reload();
                this.props.dispatch(clearSubject());
            }
        }
    }

    renderSubjects = (subjectsList) => {
        return subjectsList.map(subject => {
            return (
                <Subject key={subject.subjectId} subject={subject} history={this.props.history} dispatch={this.props.dispatch} userRole={this.props.users.login.user.userRole}/>
            );
        })
    }



    renderAddSubjectButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-subject")}>
                    Add subject
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

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.subjectsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getSubjects(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getSubjects(offset - limit, limit));
        }
    }

    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Subjects list</h1>

                    {this.props.users.login.user.userRole == "admin" ? this.renderAddSubjectButton() : null}

                    <div>

                        {this.renderSubjects(this.state.subjects)}

                    </div>

                    {this.renderNavButtons()}

                </div>

            );
        } else {
            return (
                <div className="loader"/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        subjects: state.subjects,
        others: state.others
    }
}

export default connect(mapStateToProps)(SubjectsList);