import React from "react";
import {Switch, Route} from "react-router-dom";
import Layout from "./high_order_components/Layout";
import Auth from "./high_order_components/Auth";
import Login from "./screens/SignIn";
import Dashboard from "./screens/Dashboard";
import Logout from "./screens/SignOut";
import StudentList from "./screens/StudentsList";
import ProfessorsList from "./screens/ProfessorsList";
import AddStudent from "./screens/AddStudent";
import NotFound from "./screens/NotFound";
import AboutStudent from "./screens/AboutStudent";
import AddProfessor from "./screens/AddProfessor";
import AboutProfessor from "./screens/AboutProfessor";
import StudyGroupsList from "./screens/StudyGroupsList";
import AddStudyGroup from "./screens/AddStudyGroup";
import AboutStudyGroup from "./screens/AboutStudyGroup";
import CoursesList from "./screens/CoursesList";
import AddCourse from "./screens/AddCourse";
import AboutCourse from "./screens/AboutCourse";
import AddPresenceSheet from "./screens/AddPresenceSheet";
import AddNews from "./screens/AddNews";
import NewsList from "./screens/NewsList";
import AboutNews from "./screens/AboutNews";
import AddExam from "./screens/AddExam";
import AboutExam from "./screens/AboutExam";
import ExamsList from "./screens/ExamsList";
import AddSubject from "./screens/AddSubject";
import SubjectsList from "./screens/SubjectsList";
import AboutSubject from "./screens/AboutSubject";
import AddDepartment from "./screens/AddDepartment";
import AboutDepartment from "./screens/AboutDepartment";
import DepartmentsList from "./screens/DepartmentsList";
import Profile from "./screens/Profile";
import StudentOverview from "./screens/StudentOverview";
import DocumentsList from "./screens/DocumentsList";
import SendDocument from "./screens/SendDocument";
import ProfessorOverview from "./screens/ProfessorOverview";
import Chat from "./screens/Chat";


const Routes = () => {
    return (
        <Layout>
                <Switch>
                    <Route path="/" exact component={Auth(Dashboard, false)}/>
                    <Route path="/login" exact component={Auth(Login, false)}/>
                    <Route path="/logout" exact component={Auth(Logout, true)}/>
                    <Route path="/dashboard" exact component={Auth(Dashboard, true)}/>
                    <Route path="/students-list" exact component={Auth(StudentList, true)}/>
                    <Route path="/professors-list" exact component={Auth(ProfessorsList, true)}/>
                    <Route path="/add-student" exact component={Auth(AddStudent, true)}/>
                    <Route path="/student/:id" exact component={Auth(AboutStudent, true)}/>
                    <Route path="/not-found" exact component={NotFound}/>
                    <Route path="/add-professor" exact component={Auth(AddProfessor, true)}/>
                    <Route path="/professor/:id" exact component={Auth(AboutProfessor, true)}/>
                    <Route path="/studygroups-list" exact component={Auth(StudyGroupsList, true)}/>
                    <Route path="/add-studygroup" exact component={Auth(AddStudyGroup, true)}/>
                    <Route path="/studygroup/:id" exact component={Auth(AboutStudyGroup, true)}/>
                    <Route path="/courses-list" exact component={Auth(CoursesList, true)}/>
                    <Route path="/add-course" exact component={Auth(AddCourse, true)}/>
                    <Route path="/course/:id" exact component={Auth(AboutCourse, true)}/>
                    <Route path="/add-presencesheet/:id" exact component={Auth(AddPresenceSheet, true)}/>
                    <Route path="/add-news" exact component={Auth(AddNews, true)}/>
                    <Route path="/news-list" exact component={Auth(NewsList, true)}/>
                    <Route path="/news/:id" exact component={Auth(AboutNews, true)}/>
                    <Route path="/add-exam/:courseId" exact component={Auth(AddExam, true)}/>
                    <Route path="/add-exam" exact component={Auth(AddExam, true)}/>
                    <Route path="/exam/:id" exact component={Auth(AboutExam, true)}/>
                    <Route path="/exams-list" exact component={Auth(ExamsList, true)}/>
                    <Route path="/add-subject" exact component={Auth(AddSubject, true)}/>
                    <Route path="/subjects-list" exact component={Auth(SubjectsList, true)}/>
                    <Route path="/subject/:id" exact component={Auth(AboutSubject, true)}/>
                    <Route path="/add-department" exact component={Auth(AddDepartment, true)}/>
                    <Route path="/departments-list" exact component={Auth(DepartmentsList, true)}/>
                    <Route path="/department/:id" exact component={Auth(AboutDepartment, true)}/>
                    <Route path="/profile" exact component={Auth(Profile, true)}/>
                    <Route path="/student-overview" exact component={Auth(StudentOverview, true)}/>
                    <Route path="/professor-overview" exact component={Auth(ProfessorOverview, true)}/>
                    <Route path="/documents-list" exact component={Auth(DocumentsList, true)}/>
                    <Route path="/send-document" exact component={Auth(SendDocument, true)}/>
                    <Route path="/chat" exact component={Auth(Chat, true)}/>
                </Switch>
        </Layout>

    );
}

export default Routes;
