import React, {Component} from "react";
import {connect} from "react-redux";
import {clearCoursesList, clearCourse, getCourses, getCoursesByStudentEmail, getCoursesByProfessorEmail} from "../actions/coursesActions";
import {countEsentials} from "../actions/otherActions";
import Course from "../components/Course";

class CoursesList extends Component {
    state = {
        customList: false,
        courses: [],
        coursesCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(getCourses(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.others.counts) {
            if(nextProps.others.counts) {
                if(nextProps.courses.coursesList) {
                    let courses = nextProps.courses.coursesList.coursesData;
                    this.setState({
                        courses: courses,
                        offset: nextProps.courses.coursesList.offset,
                        limit: nextProps.courses.coursesList.limit,
                        coursesCount: nextProps.others.counts.coursesCount,
                        loaded: true
                    });
                }
                if(nextProps.courses.filteredCoursesList) {
                    this.setState({
                        courses: nextProps.courses.filteredCoursesList,
                        loaded: true
                    })
                }
            }

            if(nextProps.courses.deletedCourse != null) {
                window.location.reload();
                this.props.dispatch(clearCourse());
            }
        }
    }

    renderCourses = (coursesList) => {
        return coursesList.map(course => {
            return (
                <Course key={course.courseId} course={course} history={this.props.history} dispatch={this.props.dispatch} userRole={this.props.users.login.user.userRole}/>
            );
        });
    }



    renderAddCourseButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-course")}>
                    Add course
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
        if(offset + limit <= this.state.coursesCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getCourses(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getCourses(offset - limit, limit));
        }
    }



    loadAllCoursesHandle = () => {
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(getCourses(this.state.offset, this.state.limit));
        this.setState({
            customList: false,
            loaded: false
        })
    }

    loadProfessorCoursesHandle = (professorEmail) => {
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(getCoursesByProfessorEmail(professorEmail));
        this.setState({
            customList: true,
            loaded: false
        });
    }

    loadStudentCoursesHandle = (studentEmail) => {
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(getCoursesByStudentEmail(studentEmail));
        this.setState({
            customList: true,
            loaded: false
        });
    }

    renderProfessorCoursesButton = () => {
        return !this.state.customList
                ?
                <button onClick={() => this.loadProfessorCoursesHandle(this.props.users.login.user.userEmail)}>GET MY COURSES</button>
                :
                <button onClick={() => this.loadAllCoursesHandle()}>GET ALL COURSES</button>
    }

    renderStudentCoursesButton = () => {
        return !this.state.customList
                ?
                <button onClick={() => this.loadStudentCoursesHandle(this.props.users.login.user.userEmail)}>GET MY COURSES</button>
                :
                <button onClick={() => this.loadAllCoursesHandle()}>GET ALL COURSES</button>
    }


    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Courses list</h1>


                    {this.props.users.login.user.userRole == "admin" ? this.renderAddCourseButton() : null}

                    {this.props.users.login.user.userRole == "professor" && this.state.courses.length > 0 ? this.renderProfessorCoursesButton() : null}


                    {this.props.users.login.user.userRole == "student" && this.state.courses.length > 0 ? this.renderStudentCoursesButton() : null}


                    <div>

                        {this.state.courses.length > 0 ? this.renderCourses(this.state.courses) : <div className="message">No courses yet</div>}

                    </div>

                    {!this.state.customList && this.state.courses.length > 0 ? this.renderNavButtons() : null}

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
        courses: state.courses,
        others: state.others
    }
}

export default connect(mapStateToProps)(CoursesList);