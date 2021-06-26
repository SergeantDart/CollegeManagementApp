import {combineReducers} from "redux";
import users from "./userReducers";
import others from "./otherReducers";
import students from "./studentReducers";
import professors from "./professorReducers";
import faculties from "./facultyReducers";
import studyGroups from "./studyGroupReducers";
import studyYears from "./studyYearReducers";
import departments from "./departmentReducers";
import courses from "./courseReducers";
import subjects from "./subjectsReducers";
import presenceSheets from "./presenceSheetReducers";
import marks from "./markReducers";
import news from "./newsReducers";
import exams from "./examReducers";
import documents from "./documentReducers";


const rootReducer = combineReducers({
    users,
    students,
    professors,
    faculties,
    studyGroups,
    studyYears,
    departments,
    courses,
    subjects,
    presenceSheets,
    marks,
    news,
    exams,
    documents,
    others
});

export default rootReducer;