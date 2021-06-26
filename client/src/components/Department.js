
import React from "react";
import {deleteDepartment} from "../actions/departmentActions";
import Swal from "sweetalert2";

const Department = ({department, dispatch, history, userRole}) => {

    const aboutDepartmentHandle = (departmentId) => {
       history.push(`/department/${departmentId}`);
    }

    const deleteDepartmentHandle = (departmentId) => {
        Swal.fire({  
            title: 'Are you sure?',  
            text: 'You will the delete the department and all the data asociated with it (professors, courses, exams, etc.)',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonColor: '#3085d6',  
            cancelButtonColor: '#d33',  
            confirmButtonText: 'Yes!'  
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDepartment(departmentId));
            } 
        });    
    }

    const renderOptions = () => {
        return(
            <div>
                <div className="edit" onClick={() => aboutDepartmentHandle(department.departmentId)}>
                    ABOUT
                </div>
                {userRole == "admin"
                ?
                (
                    <div className="delete" onClick={() => deleteDepartmentHandle(department.departmentId)}>
                        DELETE
                    </div>
                )
                :
                null}

            </div>   
        )
    }


    return (
        <div className="department-card">
            <div className="department-container">
                <h4><b>{department.departmentName}</b></h4>
                <p>{department.Faculty.facultyName}</p>
            </div>
            {renderOptions()}
        </div>
    )    
    
}

export default Department;