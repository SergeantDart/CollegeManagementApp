import React from "react";
import {deleteSubject} from "../actions/subjectActions";
import Swal from "sweetalert2";

const Course = ({subject, history, dispatch, userRole}) => {

    let className = "";

    const aboutSubjectHandle = (subjectId) => {
        history.push(`/subject/${subjectId}`);
    }

    const deleteSubjectHandle = (subjectId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will the subject and all the data asociated with it (courses, exams, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(deleteSubject(subjectId));
            } 
          });
    }

    const renderOptions = () => {
        return(
            <div className={className}>
                <div className="edit" onClick={() => aboutSubjectHandle(subject.subjectId)}>
                    ABOUT
                </div>
                {userRole == "admin"
                ?
                (
                    <div className="delete" onClick={() => deleteSubjectHandle(subject.subjectId)}>
                        DELETE
                    </div>
                )
                :
                null}

            </div>   
        )
    }

    return (
        <div key={subject.subjectId} className="subject_container">

                <h2>
                   {subject.subjectName}
                </h2>

                <div className={"credit_score"}>
                    {`CREDITS: ${subject.subjectCreditScore}`}
                </div>

                <div className={"score_distribution"}>
                    {`THEORY:     ${subject.subjectTheoryMarks}%`}
                </div>

                <div className={"score_distribution"}>
                    {`PRACTICAL:  ${subject.subjectTheoryMarks}%`}
                </div>

                <div className={"optional"}>
                    {subject.subjectIsOptional ? "Optional" : "Mandatory"}
                </div>
                
            {renderOptions()}

            
        </div>
    )
}

export default Course;