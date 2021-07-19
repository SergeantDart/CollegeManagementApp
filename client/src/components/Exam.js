import React from "react";
import moment from "moment";

const Exam = ({exam, type, aboutExam, deleteExam, userRole}) => {

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
                    <div className="edit" onClick={() => aboutExam(exam.examId)}>
                        ABOUT
                    </div>
                    {userRole == "admin"
                    ?
                    (
                        <div className="delete" onClick={() => deleteExam(exam.examId)}>
                            DELETE
                        </div>
                    )
                    :
                    null}
                </div>
            )
        }
    }

    return (
        <div key={exam.examId} className="student_container">

            <div className={className}>
                {exam.examId}
            </div>

            <div className={className}>
                {exam.Course.courseName}
            </div>

            <div className={className}>
                {exam.Course.studyGroupId}
            </div>

            <div className={className}>
                {exam.examDate == "Date" ? exam.examDate : moment(exam.examDate).format("DD/MM/YYYY")}
            </div>

            <div className={className}>
                {
                exam.examIsOnline == 1 ?
                "ONLINE" 
                :
                exam.examIsOnline === "Form" ?
                    exam.examIsOnline
                    :
                    "PHYSICAL"
                }
            </div>

            {renderOptions()}

            
        </div>
    )
}

export default Exam;