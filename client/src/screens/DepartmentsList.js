import React, {Component} from "react";
import {connect} from "react-redux";
import {clearDepartments, clearDepartment, getDepartments} from "../actions/departmentActions";
import {countEsentials} from "../actions/otherActions";
import Department from "../components/Department";

class DepartmentsList extends Component {
    state = {
        departments: [],
        departmentsCount: 0,
        offset: 0,
        limit: 5,
        loaded: false,
        dummy: false
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(clearDepartments());
        this.props.dispatch(getDepartments(this.state.offset, this.state.limit));
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(nextProps.others.counts) {
            if(nextProps.others.counts) {
                if(nextProps.departments.departmentsList) {
                    let departments = nextProps.departments.departmentsList.departmentsData;
                    this.setState({
                        departments: departments,
                        offset: nextProps.departments.departmentsList.offset,
                        limit: nextProps.departments.departmentsList.limit,
                        departmentsCount: nextProps.others.counts.departmentsCount,
                        loaded: true
                    });
                }
            }

            if(nextProps.departments.deletedDepartment != null) {
                window.location.reload();
                this.props.dispatch(clearDepartment());
            }
        }
    }

    renderDepartments = (departmentsList) => {
        return departmentsList.map(department => {
            return (
                <Department key={department.departmentId} department={department} history={this.props.history} dispatch={this.props.dispatch} userRole={this.props.users.login.user.userRole}/>
            );
        });
    } 




    renderAddDepartmentButton = () => {
        return (
            <div className="add_button" onClick={() => this.props.history.push("/add-department")}>
                    Add department
            </div>
   
        );
    }


    renderNavButtons = () => {
        return (
            <div className="list_nav_buttons">
                <div className="prev" onClick={() => this.loadPrev(this.state.offset, this.state.limit)}>
                    Prev
                </div>
                <div className="next" onClick={() => this.loadNext(this.state.offset, this.state.limit)}>
                    Next
                </div>
            </div>
        )
    }

    loadNext = (offset, limit) => {
        if(offset + limit <= this.state.departmentsCount - 1) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getDepartments(offset + limit, limit));
        }
    }

    loadPrev = (offset, limit) => {
        if(offset - limit >= 0) {
            this.setState({
                loaded: false
            });
            this.props.dispatch(getDepartments(offset - limit, limit));
        }
    }

    render() {

        if(this.state.loaded == true) {
            return (
                <div className="list_container">

                    <h1>Departments list</h1>

                    {this.props.users.login.user.userRole == "admin" ? this.renderAddDepartmentButton() : null}

                    <div>

                        {this.state.departments.length > 0 ? this.renderDepartments(this.state.departments) : <div className="message">No departments yet.</div>}

                    </div>

                    {this.state.departments.length > 0 ? this.renderNavButtons() : null} 

                </div>

            );
        } else {
            return (
                <div className="loader"/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        departments: state.departments,
        others: state.others
    }
}

export default connect(mapStateToProps)(DepartmentsList);