import React, {Component} from "react";
import {Link} from "react-router-dom";
import FontAwesome from "react-fontawesome";
import {connect} from "react-redux";

class NavItems extends Component {

    state = {
        items: [
            {
                class: "nav_item",
                icon: "home",
                text: "Home",
                link: "/",
                restricted: false
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Login",
                link: "/login",
                restricted: false,
                excluded: true
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Student overview",
                link: "/student-overview",
                restricted: true,
                permissions: ["student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Professor overview",
                link: "/professor-overview",
                restricted: true,
                permissions: ["professor"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Students",
                link: "/students-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Study Groups",
                link: "/studygroups-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Professors",
                link: "/professors-list",
                restricted: true,
                permissions: ["admin", "professor"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Departments",
                link: "/departments-list",
                restricted: true,
                permissions: ["admin", "professor"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Courses",
                link: "/courses-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Exams",
                link: "/exams-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Subjects",
                link: "/subjects-list",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "News",
                link: "/news-list",
                restricted: true,
                permissions: ["admin"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Send docs",
                link: "/send-document",
                restricted: true,
                permissions: ["professor", "student"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Received docs",
                link: "/documents-list",
                restricted: true,
                permissions: ["admin"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Profile",
                link: "/profile",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            },
            {
                class: "nav_item",
                icon: "file-text-o",
                text: "Logout",
                link: "/logout",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            }
        ]   
    }

    generateNavItem = (item, index) => {
        return (
            <div key={index} className={item.class}>
                <Link to={item.link} onClick={this.props.onHideNav}>
                    <FontAwesome name={item.icon}/>
                    {item.text}
                </Link>
            </div>
        );
    }

    validateNavItemPermissions = (item, index) => {
        if(item.permissions.includes(this.props.users.login.user.userRole)) {
            return this.generateNavItem(item, index);
        }else {
            return null;
        }
    }

    renderNavItems = (items) => {
        return this.props.users.login ?
        items.map((item, index) => {
            if(this.props.users.login.isAuth) {
                return !item.excluded ?
                           item.permissions ?
                                this.validateNavItemPermissions(item, index)
                                :
                                this.generateNavItem(item, index)
                           :
                           null;
            }else {
                return !item.restricted ?
                           this.generateNavItem(item, index)
                           :
                           null;
            }
        })
        :
        null
    }

    render() {
        return (
            <div>
            
                {this.renderNavItems(this.state.items)}

             </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users
    };
}

export default connect(mapStateToProps)(NavItems);