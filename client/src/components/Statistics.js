import {Component} from "react";
import {connect} from "react-redux";
import {countEsentials} from "../actions/otherActions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChalkboardTeacher, faUserGraduate, faBook, faUniversity} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

class Statistics extends Component {

    state = {
        done: false
    }

    UNSAFE_componentWillMount() {
        this.props.dispatch(countEsentials());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);

        const subjectsCount = nextProps.others.counts.subjectsCount;
        const professorsCount = nextProps.others.counts.professorsCount;
        const studentsCount = nextProps.others.counts.studentsCount;
        const departmentsCount = nextProps.others.counts.departmentsCount;
        this.setState({
            containers: [
                {
                    className: "subjects",
                    path: "/subjects-list",
                    icon: faBook,
                    text: `Subjects: ${subjectsCount}`
                },
                {
                    className: "professors",
                    path: "/professors-list",
                    icon: faChalkboardTeacher,
                    text: `Professors: ${professorsCount}`
                },
                {
                    className: "students",
                    path: "/students-list",
                    icon: faUserGraduate,
                    text: `Students: ${studentsCount}`
                },
                {
                    className: "departments",
                    path: "/departments-list",
                    icon: faUniversity,
                    text: `Departments: ${departmentsCount}`
                }
                
            ],
            done: true
        })
    }

    generateContainers = (containers) => {
        return containers.map((container, index) => {
            return (
                <div key={index} className={container.className}>
                    <Link to={container.path} style={{
                        marginBottom: "10px",
                    }}>
                        <FontAwesomeIcon icon={container.icon} style={{
                            display: "block",
                            margin: "1.25vw auto",
                            fontSize: "6vw"
                        }}/>
                        {container.text}
                    </Link>
                </div>
            )
        })
    }

    
    render() {
        if(this.state.done === true) {
            return (

                <div className="admin_dashboard">

                    <h2>Summary of academics: </h2>
                    
                    <div className="count_container">
                        
                        {this.generateContainers(this.state.containers)}

                    </div>

                </div>

            );
        }else {
            return (
                <div className="loading"/>
            );
        }
    }      
}

function mapStateToProps(state) {
    return {
        users: state.users,
        others: state.others
    }
}
export default connect(mapStateToProps)(Statistics);