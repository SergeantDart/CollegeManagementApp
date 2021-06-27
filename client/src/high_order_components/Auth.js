import React, {Component} from "react";
import {connect} from "react-redux";
import {authUser} from "../actions/userActions";
import {permissionsConfig} from "../permissionsConfig";

export default function Auth(WantedComponent, requiresAuth) {

    class AuthCheck extends Component {
        
        state = {
            loading: true,
        }

        UNSAFE_componentWillMount() {
            this.props.dispatch(authUser());
        }

        UNSAFE_componentWillReceiveProps(nextProps) {
            //if not authenticated and different from the special logout scenario which erases user data from redux state
            if(!nextProps.users.login.isAuth && !nextProps.users.login.type !== "logout") {
                if(requiresAuth === true) {
                    this.props.history.push("/login");
                }
            }

            //if authenticated
            if(nextProps.users.login.user) {
                const currentRoute = permissionsConfig.find(route => {
                    //if route exists
                    if(route.path === this.props.match.path) {
                        return true;
                    }
                });
                if(currentRoute !== null) {
                    let k  = 0;
                    currentRoute.permissions.forEach(permission => {
                        if(permission !== nextProps.users.login.user.userRole) {
                            k++
                        }
                    });
                    //if k is equal to the size of the array it means the user does not pose permission to access that route
                    //on the other hand, if it is different, he's allowed to proceed
                    if(k === currentRoute.permissions.length) {
                        console.log(nextProps);
                        this.props.history.push("/not-found");
                    }else {
                        this.setState({
                            loading: false
                        });
                    }
                }  
            }else {
                this.setState({
                    loading: false
                })
            }                    
        }

        render() {
            if(this.state.loading) {
                return <div className="loading"/>;
            }else {
                return (
                    <WantedComponent {...this.props}/>
                );
            }
        }
    }

    function mapStateToProps(state) {
        return {
            users: state.users
        }
    }

    return connect(mapStateToProps)(AuthCheck);
}

