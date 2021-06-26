import axios from "axios";

export function getFaculties() {
        const request = axios.get("/api/getFaculties")
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
    
        return {
            type: "FACULTIES_LIST",
            payload: request
        };
}

export function clearFaculties() {
    return {
        type: "CLEAR_FACULTIES",
        payload: null
    };
}