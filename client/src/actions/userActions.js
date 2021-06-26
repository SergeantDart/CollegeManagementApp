import axios from "axios";

export function loginUser({userEmail, userPassword}) {
    const request = axios.post("/api/loginUser", {userEmail, userPassword})
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "USER_LOGIN",
        payload: request
    };
}

export function authUser() {
    const request = axios.get("/api/authUser")
    .then(response => response.data)
    .catch(error => {
        console.log(error);
    });

    return {
        type: "USER_AUTH",
        payload: request
    };
}

export function updateUser(id, user) {
    return(dispatch) => {
        axios.post(`/api/updateUser/${id}`, user)
        .then(user => {
            user = user.data;
            dispatch({
                type: "UPDATE_USER",
                payload: user
            });
        }).catch(error => {
            console.log(error);
        });
    }
}



export function clearUpdatedUser() {
    return {
        type: "CLEAR_UPDATED_USER",
        payload: null
    };
}

export function logoutUser(history) {
    const request = axios.get("/api/logoutUser")
    .then(() => {
        setTimeout(() => {
            history.push("/login");
        }, 1000);

    }).catch(error => console.log(error));

    return {
        type: "USER_LOGOUT",
        payload: request
    };
}
