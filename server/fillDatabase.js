const {sequelize} = require("./database");

const UserRole = require("./models/UserRole");
const User = require("./models/User");
const Cycle = require("./models/Cycle");
const Faculty = require("./models/Faculty");
const Student = require("./models/Student");
const StudyYear = require("./models/StudyYear");
const Subject = require("./models/Subject");
const Department = require("./models/Department");
const Professor = require("./models/Professor");
const StudyGroup = require("./models/StudyGroup");
const Course = require("./models/Course");
const Mark = require("./models/Mark");
const Exam = require("./models/Exam");
const PresenceSheet = require("./models/PresenceSheet");
const Presence = require("./models/Presence");
const News = require("./models/News");
const Document = require("./models/Document");



const cycles = require("./data/cycles");
const faculties = require("./data/faculties");
const studyYears = require("./data/studyYears");
const students = require("./data/students");
const subjects = require("./data/subjects");
const departments = require("./data/departments");
const professors = require("./data/professors");
const studyGroups = require("./data/studyGroups");
const userRoles = require("./data/userRoles");
const courses = require("./data/courses");
const exams = require("./data/exams");
const users = require("./data/users");
const news = require("./data/news");

module.exports = function() {
    sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
    .then(function(){
        return sequelize.sync({force: true});
    })
    .then(function(){
        return sequelize.query("SET FOREIGN_KEY_CHECKS = 1")
    })
    .then(function(){
        console.log("Database synchronised...");
        UserRole.bulkCreate(userRoles)
        .then(() => Cycle.bulkCreate(cycles))
        .then(() => Faculty.bulkCreate(faculties))
        .then(() => Department.bulkCreate(departments))
        .then(() => StudyYear.bulkCreate(studyYears))
        .then(() => Subject.bulkCreate(subjects))
        .then(() => Professor.bulkCreate(professors, {validate: true, individualHooks: true}))
        .then(() => StudyGroup.bulkCreate(studyGroups))
        .then(() => Student.bulkCreate(students, {validate: true, individualHooks: true}))
        .then(() => Course.bulkCreate(courses))
        .then(() => PresenceSheet.bulkCreate([]))
        .then(() => Mark.bulkCreate([]))
        .then(() => Exam.bulkCreate(exams))
        .then(() => User.bulkCreate(users, {validate: true, individualHooks: true}))
        .then(() => News.bulkCreate(news))
        .catch(error => console.log(error));

    
    }, function(err) {
        console.log(err);
    });
}
