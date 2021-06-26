import React from "react";
import {deleteStudyGroup} from "../actions/studyGroupActions";
import Swal from "sweetalert2";

const StudyGroup = ({studyGroup, history, dispatch, userRole}) => {

    let className = "";

    const aboutStudyGroup = (studyGroupId) => {
        history.push(`/studygroup/${studyGroupId}`);
    }

    const deleteStudyGroupHandle = (studyGroupId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will delete the study group and all the data asociated with it (students, courses, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(deleteStudyGroup(studyGroupId));
            } 
          });
    }

    const renderOptions = () => {
        return(
            <div className={className}>
                <div className="edit" onClick={() => aboutStudyGroup(studyGroup.studyGroupId)}>
                    ABOUT
                </div>
                {userRole == "admin"
                ?
                (
                    <div className="delete" onClick={() => deleteStudyGroupHandle(studyGroup.studyGroupId)}>
                        DELETE
                    </div>
                )
                :
                null}

            </div>   
        )
    }

    console.log(studyGroup);
    return (
        <div key={studyGroup.studyGroupId} className="study_group_container">

            <div className="left_container">

                <div className={className}>
                    Study group no.: 
                </div>

                <div className={className}>
                    Study group year:
                </div>

                <div className={className}>
                    Study group faculty: 
                </div>

                <div className={className}>
                    Study group description:
                </div>
                
            </div>

            <div className="right_container">

                <div className={className}>
                    {studyGroup.studyGroupId}
                </div>

                <div className={className}>
                    {studyGroup.StudyYear.studyYearOrder}
                </div>

                <div className={className}>
                    {studyGroup.Faculty.facultyName}
                </div>

                <div className={className}>
                    {studyGroup.studyGroupDescription}
                </div>

            </div>

 

            {renderOptions()}

            
        </div>
    )
}

export default StudyGroup;