import axios from "axios";

export function getStudyYears() {
        const request = axios.get("/api/getStudyYears")
        .then(response => response.data)
        .catch(error => {
            console.log(error);
        });
    
        return {
            type: "STUDY_YEARS_LIST",
            payload: request
        };
}