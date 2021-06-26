import React from "react";
import moment from "moment";

const Student = ({student, type, aboutStudent, deleteStudent, userRole}) => {

    let className = "";
    if(type == "info") {
        className = "student_column_info";
    }else {
        className = "student_column_label";
    }

    const renderOptions = () => {
        if(userRole != "student") {
            if(className == "student_column_label") {
                return (
                    <div className={className}>
                        Options
                    </div>
                )
            }else{
                return (
                    <div className={className}>
                        {userRole == "admin" || userRole == "professor"
                        ?
                        (
                            <div className="edit" onClick={() => aboutStudent(student.studentId)}>
                                ABOUT
                            </div>
                        )
                        :
                        null}
    
                        {userRole == "admin"
                        ?
                        (
                            <div className="delete" onClick={() => deleteStudent(student.studentId)}>
                                DELETE
                            </div>
                        )
                        :
                        null}
                    </div>
                )
            }
        } else {
            return null;
        }
        
    }

    return (
        <div key={student.studentId} className="student_container">

            <div className={className}>
                {student.studentId}
            </div>
            <div className={className}>
                {student.studentFirstName}
            </div>

            <div className={className}>
                {student.studentLastName}
            </div>


            <div className={className}>
                {student.studentEmail}
            </div>

            <div className={className}>
                {student.studyGroupId}
            </div>


            <div className={className}>
                {student.Faculty.facultyName}
            </div>

            <div className={className}>
                {student.StudyYear.studyYearOrder}
            </div>

            {renderOptions()}

            
        </div>
    )
}

export default Student;