import React, {Component} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connect} from "react-redux";
import {faChalkboardTeacher, faUserGraduate, faBook, faUniversity, faHome, faSignInAlt, faUsers, faFileAlt, faUserAlt, faComments, faChalkboard, faNewspaper, faFileUpload, faFileDownload, faIdCard} from "@fortawesome/free-solid-svg-icons";

class NavItems extends Component {

    state = {
        items: [
            {
                class: "nav_item",
                icon: faHome,
                text: "Home",
                link: "/",
                restricted: false
            },
            {
                class: "nav_item",
                icon: faSignInAlt,
                text: "Login",
                link: "/login",
                restricted: false,
                excluded: true
            },
            {
                class: "nav_item",
                icon: faIdCard,
                text: "Student overview",
                link: "/student-overview",
                restricted: true,
                permissions: ["student"]
            },
            {
                class: "nav_item",
                icon: faIdCard,
                text: "Professor overview",
                link: "/professor-overview",
                restricted: true,
                permissions: ["professor"]
            },
            {
                class: "nav_item",
                icon: faUserGraduate,
                text: "Students",
                link: "/students-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: faUsers,
                text: "Study groups",
                link: "/studygroups-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: faChalkboardTeacher,
                text: "Professors",
                link: "/professors-list",
                restricted: true,
                permissions: ["admin", "professor"]
            },
            {
                class: "nav_item",
                icon: faUniversity,
                text: "Departments",
                link: "/departments-list",
                restricted: true,
                permissions: ["admin", "professor"]
            },
            {
                class: "nav_item",
                icon: faChalkboard,
                text: "Courses",
                link: "/courses-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: faFileAlt,
                text: "Exams",
                link: "/exams-list",
                restricted: true,
                permissions: ["admin", "professor", "student"]
            },
            {
                class: "nav_item",
                icon: faBook,
                text: "Subjects",
                link: "/subjects-list",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            },
            {
                class: "nav_item",
                icon: faNewspaper,
                text: "News",
                link: "/news-list",
                restricted: true,
                permissions: ["admin"]
            },
            {
                class: "nav_item",
                icon: faFileUpload,
                text: "Send docs",
                link: "/send-document",
                restricted: true,
                permissions: ["professor", "student"]
            },
            {
                class: "nav_item",
                icon: faFileDownload,
                text: "Received docs",
                link: "/documents-list",
                restricted: true,
                permissions: ["admin"]
            },
            {
                class: "nav_item",
                icon: faComments,
                text: "Chat",
                link: "/chat",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            },
            {
                class: "nav_item",
                icon: faUserAlt,
                text: "Profile",
                link: "/profile",
                restricted: true,
                permissions: ["admin", "student", "professor"]
            },
            {
                class: "nav_item",
                icon: faSignInAlt,
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
                    <FontAwesomeIcon id="nav_icon" icon={item.icon}/>
                    <span id="nav_text"></span>{item.text}
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