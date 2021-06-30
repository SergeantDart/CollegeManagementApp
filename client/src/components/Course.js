import React from "react";
import {deleteCourse} from "../actions/coursesActions";
import moment from "moment";
import Swal from "sweetalert2";
import {Link} from "react-router-dom";

const Course = ({course, history, dispatch, userRole}) => {

    let className = "";

    const aboutCourse = (courseId) => {
        history.push(`/course/${courseId}`);
    }

    const deleteCourseHandle = (courseId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will delete the course and all the data asociated with it (exams, marks, presences, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(deleteCourse(courseId));
            } 
          });
    }

    const renderOptions = () => {
        return(
            <div className={className}>
                <div className="edit" onClick={() => aboutCourse(course.courseId)}>
                    ABOUT
                </div>
                
                {userRole == "admin"
                ?
                (
                    <div className="delete" onClick={() => deleteCourseHandle(course.courseId)}>
                        DELETE
                    </div>
                )
                :
                null}

            </div>   
        )
    }

    return (
        <div key={course.courseId} className="course_container">

                <h2>
                   {course.courseName}
                </h2>

                <div className={"professor"}>
                    {`with `}
                    {userRole == "admin" ?
                     <Link to={{ 
                        pathname:`/professor/${course.professorId}`,
                        state: {fromDashboard: true }}}>
                            {`${course.Professor.professorFirstName} ${course.Professor.professorLastName}`}
                    </Link>
                    :
                    <span>
                       {`${course.Professor.professorFirstName} ${course.Professor.professorLastName}`} 
                    </span>}

                </div>

                <div className={"subject"}>
                    {`teaching `}
                    <Link to={{ 
                        pathname:`/subject/${course.subjectId}`,
                        state: {fromDashboard: true }}}>
                            {`${course.Subject.subjectName}`}
                    </Link>
                </div>

                <div className={"time"}>
                    {`at ${moment(course.courseTime).format("dddd HH:mm")}`}
                </div>

                <div className={"studygroup"}>
                    {`for study group no. `}
                    <Link to={{
                        pathname:`/studygroup/${course.studyGroupId}`,
                        state: {fromDashboard: true}}}>
                        {`${course.StudyGroup.studyGroupId}`}
                    </Link>
                </div>
                

            {renderOptions()}

            
        </div>
    )
}

export default Course;