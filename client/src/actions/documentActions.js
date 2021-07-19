import axios from "axios";


export function getDocuments(offset=0, limit=9999) {
    return(dispatch) => {
        axios.get(`/api/getDocuments?offset=${offset}&limit=${limit}`)
        .then(documentsData => {
            documentsData = documentsData.data;
            const payload = {
                documentsData,
                offset,
                limit
    
            };
            dispatch({
                type: "DOCUMENTS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getFilteredDocuments(keyword = "") {
    return(dispatch) => {
        axios.get(`/api/getFilteredDocuments?keyword=${keyword}`)
        .then(documentsData => {
            documentsData = documentsData.data;
            const payload = {
                documentsData,
                keyword
            };
            dispatch({
                type: "FILTERED_DOCUMENTS_LIST",
                payload: payload
            });

        })
        .catch(error => {
            console.log(error);
        });
    }
}

export function getDocument(documentId) {
    const request = axios.get(`/api/getDocument/${documentId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "GET_DOCUMENT",
        payload: request
    }
}


export function sendDocument(userId, document) {
    const request = axios.post(`/api/sendDocument`, {
        documentTitle: document.documentTitle,
        documentDescription: document.documentDescription,
        documentStoragePath: document.documentStoragePath,
        userId: userId
    }).then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "SEND_DOCUMENT",
        payload: request
    }
}

export function deleteDocument(documentId) {
    const request = axios.delete(`/api/deleteDocument/${documentId}`)
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });
    return {
        type: "DELETE_DOCUMENT",
        payload: request
    }
}

export function clearDocument() {
    return {
        type: "CLEAR_DOCUMENT",
        payload: null
    }
}

export function clearDocuments() {
    return {
        type: "CLEAR_DOCUMENTS_LIST",
        payload: null
    }
}