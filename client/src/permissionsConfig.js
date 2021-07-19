import SignIn from "./screens/SignIn";
import SignOut from "./screens/SignOut";

import AboutStudent from "./screens/AboutStudent";
import AboutProfessor from "./screens/AboutProfessor";
import AboutStudyGroup from "./screens/AboutStudyGroup";
import AboutCourse from "./screens/AboutCourse";
import AboutNews from "./screens/AboutNews";
import AboutExam from "./screens/AboutExam";
import AboutSubject from "./screens/AboutSubject";
import AboutDepartment from "./screens/AboutDepartment";

import StudentsList from "./screens/StudentsList";
import ProfessorsList from "./screens/ProfessorsList";
import SubjectsList from "./screens/SubjectsList";
import StudyGroupsList from "./screens/StudyGroupsList";
import NewsList from "./screens/NewsList";
import CoursesList from "./screens/CoursesList";
import ExamsList from "./screens/ExamsList";
import DepartmentsList from "./screens/DepartmentsList";


import AddStudent from "./screens/AddStudent";
import AddProfessor from "./screens/AddProfessor";
import AddStudyGroup from "./screens/AddStudyGroup";
import AddCourse from "./screens/AddCourse";
import AddNews from "./screens/AddNews";
import AddExam from "./screens/AddExam";
import AddSubject from "./screens/AddSubject";
import AddDepartment from "./screens/AddDepartment";
import Profile from "./screens/Profile";

import StudentOverview from "./screens/StudentOverview";
import ProfessorOverview from "./screens/ProfessorOverview";

import SendDocument from "./screens/SendDocument";
import DocumentsList from "./screens/DocumentsList";

import Chat from "./screens/Chat";
import Dashboard from "./screens/Dashboard";



const roles = {admin: "admin", professor: "professor", student: "student"};

export const permissionsConfig = [
    {
        component: Dashboard,
        path: "/",
        title: "Dashboard",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: DocumentsList,
        path: "/documents-list",
        title: "Documents list",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: SendDocument,
        path: "/send-document",
        title: "Send document",
        exact: true,
        permissions: [
            roles.professor,
            roles.student
        ]
    },
    {
        component: SignIn,
        path: "/login",
        title: "Login",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: SignOut,
        path: "/logout",
        title: "Logout",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: StudentsList,
        path: "/students-list",
        title: "Students list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddStudent,
        path: "/add-student",
        title: "Add student",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutStudent,
        path: "/student/:id",
        title: "About student",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: ProfessorsList,
        path: "/professors-list",
        title: "Professors list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor
        ]
    },
    {
        component: AboutProfessor,
        path: "/professor/:id",
        title: "About professor",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor
        ]
    },
    {
        component: AddProfessor,
        path: "/add-professor",
        title: "Add professor",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: StudyGroupsList,
        path: "/studygroups-list",
        title: "Study groups list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddStudyGroup,
        path: "/add-studygroup",
        title: "Add study group",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutStudyGroup,
        path: "/studygroup/:id",
        title: "About study group",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddCourse,
        path: "/add-course",
        title: "Add Course",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutCourse,
        path: "/course/:id",
        title: "About course",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: CoursesList,
        path: "/courses-list",
        title: "Courses list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: ExamsList,
        path: "/exams-list",
        title: "Exams list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddExam,
        path: "/add-exam/:courseId",
        title: "Add exam with course id",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor
        ]
    },
    {
        component: AddExam,
        path: "/add-exam",
        title: "Add exam without course id",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutExam,
        path: "/exam/:id",
        title: "About exam",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: SubjectsList,
        path: "/subjects-list",
        title: "Subjects list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddSubject,
        path: "/add-subject",
        title: "Add subject",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutSubject,
        path: "/subject/:id",
        title: "About subject",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: NewsList,
        path: "/news-list",
        title: "News list",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutNews,
        path: "/news/:id",
        title: "About news",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: AddNews,
        path: "/add-news",
        title: "Add news",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AddDepartment,
        path: "/add-department",
        title: "Add department",
        exact: true,
        permissions: [
            roles.admin
        ]
    },
    {
        component: AboutDepartment,
        path: "/department/:id",
        title: "About department",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor
        ]
    },
    {
        component: DepartmentsList,
        path: "/departments-list",
        title: "Departments list",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor
        ]
    },
    {
        component: Profile,
        path: "/profile",
        title: "Profile",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    },
    {
        component: StudentOverview,
        path: "/student-overview",
        title: "Student overview",
        exact: true,
        permissions: [
            roles.student
        ]
    },
    {
        component: ProfessorOverview,
        path: "/professor-overview",
        title: "Professor overview",
        exact: true,
        permissions: [
            roles.professor
        ]
    },
    {
        component: Chat,
        path: "/chat",
        title: "Room chat",
        exact: true,
        permissions: [
            roles.admin,
            roles.professor,
            roles.student
        ]
    }
];