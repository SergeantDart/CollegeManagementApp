import React, {Component} from "react";
import {connect} from "react-redux";
import {countEsentials} from "../actions/otherActions";
import {clearSubjects, clearSubject, getSubjects, getFilteredSubjects} from "../actions/subjectActions";
import Subject from "../components/Subject";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class SubjectsList extends Component {
    state = {
        subjects: [],
        subjectsCount: 0,
        offset: 0,
        limit: 6,
        loaded: false,
        keyword: "",
        navButtons: true,
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

            if(nextProps.subjects.filteredSubjectsList) {
                this.setState({
                    subjects: nextProps.subjects.filteredSubjectsList.subjectsData,
                    offset: 0,
                    loaded: true
                });
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

    changeHandle = (value) => {
        this.setState({
            keyword: value
        });

        this.props.dispatch(clearSubjects());
        if(value != "") {
            if(value.length >= 3 && this.state.keyword.length <= value.length) {
                setTimeout(() => { 
                    this.props.dispatch(getFilteredSubjects(value));
                    this.setState({
                        navButtons: false,
                    });
                }, 500);
            }
        } else {
            this.props.dispatch(getSubjects(this.state.offset, this.state.limit));
            this.setState({
                navButtons: true,
                loaded: false
            });
        }
    }

    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Subjects list</h1>

                    {this.props.users.login.user.userRole == "admin" ? this.renderAddSubjectButton() : null}

                    <FontAwesomeIcon id="search_icon" icon={faSearch}/>
                    <input className="search_input" value={this.state.keyword} onChange={(event) => this.changeHandle(event.target.value)} placeholder="Enter keyword..."/>

                    <div>

                        {this.state.subjects.length > 0 ? this.renderSubjects(this.state.subjects) : <div className="message">No subjects yet.</div>}

                    </div>

                    {this.state.subjects.length > 0 && this.state.navButtons ? this.renderNavButtons() : null}

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