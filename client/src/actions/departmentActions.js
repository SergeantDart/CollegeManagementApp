import axios from "axios";


export function getDepartments(offset=0, limit=9999) {
    return(dispatch) => {
        axios.get(`/api/getDepartments?offset=${offset}&limit=${limit}`)
        .then(departmentsData => {
            departmentsData = departmentsData.data;
            const payload = {
                departmentsData,
                offset,
                limit
            };
            dispatch({
                type: "DEPARTMENTS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getFilteredDepartments(keyword = "") {
    return(dispatch) => {
        axios.get(`/api/getFilteredDepartments?keyword=${keyword}`)
        .then(departmentsData => {
            departmentsData = departmentsData.data;
            const payload = {
                departmentsData,
                keyword
            };
            dispatch({
                type: "FILTERED_DEPARTMENTS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getDepartment(departmentId) {
    const request = axios.get(`/api/getDepartment/${departmentId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "GET_DEPARTMENT",
        payload: request
    }
}


export function addDepartment(department) {
    const request = axios.post(`/api/addDepartment`, department)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "ADD_DEPARTMENT",
        payload: request
    }
}

export function updateDepartment(departmentId, department) {
    const request = axios.post(`/api/updateDepartment/${departmentId}`, department)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "UPDATE_DEPARTMENT",
        payload: request
    }
}

export function deleteDepartment(departmentId) {
    const request = axios.delete(`/api/deleteDepartment/${departmentId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "DELETE_DEPARTMENT",
        payload: request
    }
}

export function clearDepartment() {
    return {
        type: "CLEAR_DEPARTMENT",
        payload: null
    }
}

export function clearDepartments() {
    return {
        type: "CLEAR_DEPARTMENTS_LIST",
        payload: null
    }
}