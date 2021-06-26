import React from "react";
import moment from "moment";

const Professor = ({professor, type, aboutProfessor, deleteProfessor, userRole}) => {

    let className = "";
    if(type == "info") {
        className = "student_column_info";
    }else {
        className = "student_column_label";
    }

    const renderOptions = () => {
        if(className == "student_column_label") {
            return (
                <div className={className}>
                    Options
                </div>
            )
        }else {
            return (
                <div className={className}>
                    <div className="edit" onClick={() => aboutProfessor(professor.professorId)}>
                        ABOUT
                    </div>
                    {userRole == "admin" 
                    ?
                    (
                        <div className="delete" onClick={() => deleteProfessor(professor.professorId)}>
                            DELETE
                        </div>
                    )
                    :
                    null
                    }

                </div>
            )
        }
    }

    return (
        <div key={professor.professorId} className="student_container">

            <div className={className}>
                {professor.professorId}
            </div>
            <div className={className}>
                {professor.professorFirstName}
            </div>

            <div className={className}>
                {professor.professorLastName}
            </div>

            <div className={className}>
                {professor.professorEmail}
            </div>

            <div className={className}>
                {professor.Department.departmentName}
            </div>

            {renderOptions()}
     
        </div>
    )
}

export default Professor;