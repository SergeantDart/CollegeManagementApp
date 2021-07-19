import React, {Component} from "react";
import {connect} from "react-redux";
import {clearStudyGroups, getStudyGroups, getFilteredStudyGroups} from "../actions/studyGroupActions";
import {countEsentials} from "../actions/otherActions";
import StudyGroup from "../components/StudyGroup";
import {getStudentByEmail, clearStudent} from "../actions/studentActions";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class StudyGroupList extends Component {
    state = {
        studyGroups: [],
        studyGroupsCount: 0,
        offset: 0,
        limit: 6,
        loaded: false,
        dummy: false,
        keyword: "",
        navButtons: true
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearStudent())
        this.props.dispatch(clearStudyGroups());
        this.props.dispatch(getStudyGroups(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.others.counts) {
            if(nextProps.others.counts.studyGroupsCount) {
                if(nextProps.studyGroups.studyGroupsList) {
                    let studyGroups = nextProps.studyGroups.studyGroupsList.studyGroupsData;
                    this.setState({
                        studyGroups: studyGroups,
                        offset: nextProps.studyGroups.studyGroupsList.offset,
                        limit: nextProps.studyGroups.studyGroupsList.limit,
                        studyGroupsCount: nextProps.others.counts.studyGroupsCount,
                        loaded: true
                    });
                }
            }
            if(nextProps.studyGroups.deletedStudyGroup != null) {
                window.location.reload(false);
            }

            if(nextProps.studyGroups.filteredStudyGroupsList) {
                this.setState({
                    studyGroups: nextProps.studyGroups.filteredStudyGroupsList.studyGroupsData,
                    offset: 0,
                    loaded: true
                });
            }
        }

        if(nextProps.students.student) {
            this.props.history.push(`/studygroup/${nextProps.students.student.studyGroupId}`)
        }
    }

    renderStudyGroups = (studyGroupsList) => {
        return studyGroupsList.map(studyGroup => {
            return (
                <StudyGroup key={studyGroup.studyGroupId} studyGroup={studyGroup} history={this.props.history} dispatch={this.props.dispatch} userRole={this.props.users.login.user.userRole}/>
            );
        })
    }



    renderAddStudyGroupButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-studygroup")}>
                    Add study group
            </div>
   
        );
    }

    renderFindMyStudyGroupButton = () => {
        return (
            <button onClick={() => this.redirectToMyStudyGroupHandle(this.props.users.login.user.userEmail)}>GO TO MY STUDY GROUP</button>
        )
    }

    redirectToMyStudyGroupHandle = (studentEmail) => {
        this.props.dispatch(getStudentByEmail(studentEmail));
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
        if(offset + limit <= this.state.studyGroupsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getStudyGroups(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getStudyGroups(offset - limit, limit));
        }
    }

    changeHandle = (value) => {
        this.setState({
            keyword: value
        });

        this.props.dispatch(clearStudyGroups());
        if(value != "") {
            if((value.length >= 3 || !isNaN(value)) && this.state.keyword.length <= value.length) {
                setTimeout(() => { 
                    this.props.dispatch(getFilteredStudyGroups(value));
                    this.setState({
                        navButtons: false,
                    });
                }, 500);
            }
        } else {
            this.props.dispatch(getStudyGroups(this.state.offset, this.state.limit));
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

                    <h1>Study groups list</h1>

                    {this.props.users.login.user.userRole == "admin" ? this.renderAddStudyGroupButton() : null}

                    {this.props.users.login.user.userRole == "student" ? this.renderFindMyStudyGroupButton() : null}

                    <FontAwesomeIcon id="search_icon" icon={faSearch}/>
                    <input className="search_input" value={this.state.keyword} onChange={(event) => this.changeHandle(event.target.value)} placeholder="Enter keyword..."/>

                    <div>

                        {this.state.studyGroups.length > 0 ? this.renderStudyGroups(this.state.studyGroups) : <div className="message">No study groups yet.</div>}

                    </div>

                    {this.state.studyGroups.length > 0 && this.state.navButtons ? this.renderNavButtons() : null}

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
        studyGroups: state.studyGroups,
        students: state.students,
        others: state.others
    }
}

export default connect(mapStateToProps)(StudyGroupList);