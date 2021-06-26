import {Component} from "react";
import {getCourse, updateCourse, clearCourse} from "../actions/coursesActions";
import {getProfessors, clearProfessors} from "../actions/professorActions";
import {getStudyGroups, clearStudyGroups} from "../actions/studyGroupActions";
import {getSubjects, clearSubjects} from "../actions/subjectActions";
import moment from "moment";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import AddPresenceSheet from "./AddPresenceSheet";
import {Link} from "react-router-dom";
import {clearMarks, clearMark, updateMark, getMarksByCourseId} from "../actions/markActions";
import {clearPresenceSheetsList, getPresenceSheetsByCourseId, getPresencesByPresenceSheet, clearPresences} from "../actions/presenceSheetActions";
import Mark from "../components/Mark";
import {clearExam, getExamByCourseId} from "../actions/examActions";

class AboutCourse extends Component {

    state = {
        isPresenceListLoaded: false,
        isExamProgrammed: false,
        exam: {},
        presenceSheet: {},
        presences: [],
        marks: [],
        edit: false,
        isAddPresenceSheetSelected: false,
        loading: true,
        course: {},
        error: "",
        formData: {
            courseName: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "course_name",
                    label: "Course name: ",
                    type: "text",
                    placeholder: "Course name..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            courseTime: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "course_time",
                    label: "Course time: ",
                    type: "text",
                    placeholder: "Day of the week, HH:MM..."
                },
                validation: {
                    required: true,
                    courseTime: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            courseDescription: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "course_description",
                    label: "Description: ",
                    type: "text",
                    placeholder: "Course description..."
                },
                validation: {
                    required: true,
                    minLength: 8
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            studyGroupId: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "study_group_id",
                    label: "Study group: ",
                    options: []
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            subjectId: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "subject_id",
                    label: "Subject: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            professorId: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "professor_id",
                    label: "Professor: ",
                    options: []
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            }
        }
    }

    UNSAFE_componentWillMount() {
        //dispatch an action to clarify if course is teached by the professor
        this.props.dispatch(clearCourse());
        this.props.dispatch(clearStudyGroups());
        this.props.dispatch(clearSubjects());
        this.props.dispatch(clearProfessors());
        this.props.dispatch(clearPresenceSheetsList());
        this.props.dispatch(clearPresences());
        this.props.dispatch(clearMarks());
        this.props.dispatch(clearExam());

        this.props.dispatch(getExamByCourseId(this.props.match.params.id));
        this.props.dispatch(getPresenceSheetsByCourseId(this.props.match.params.id));
        this.props.dispatch(getMarksByCourseId(this.props.match.params.id));
        this.props.dispatch(getCourse(this.props.match.params.id));
        this.props.dispatch(getStudyGroups());
        this.props.dispatch(getSubjects());
        this.props.dispatch(getProfessors());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.courses.course) {
            if(nextProps.studyGroups.studyGroupsList) {
                if(nextProps.subjects.subjectsList) {
                    if(nextProps.professors.professorsList) {
                        if(nextProps.exams.exam) {

                            let tempFormData = this.state.formData;
                            let studyGroupOptions = [];
                            let subjectOptions = [];
                            let professorOptions = [];
                            let exam = {};
                            let isExamProgrammed = false;

                            if(nextProps.exams.exam.message) {
                                isExamProgrammed = false;
                            }else {
                                isExamProgrammed = true;
                                exam = nextProps.exams.exam;

                            }

                            
                            nextProps.studyGroups.studyGroupsList.studyGroupsData.map((studyGroup) => {
                                studyGroupOptions.push({
                                    id: studyGroup.studyGroupId,
                                    name: studyGroup.studyGroupId
                                });
                            });
    
                            nextProps.subjects.subjectsList.subjectsData.map((subject) => {
                                subjectOptions.push({
                                    id: subject.subjectId,
                                    name: subject.subjectName
                                });
                            });
    
                            nextProps.professors.professorsList.professorsData.map((professor) => {
                                professorOptions.push({
                                    id: professor.professorId,
                                    name: `${professor.professorFirstName} ${professor.professorLastName}`
                                });
                            });
    
                            for(var key of Object.keys(tempFormData)) {
                                tempFormData[key].value = nextProps.courses.course[key];
                                tempFormData[key].isValid = true;
                            }
                            
                            tempFormData.courseTime.value = moment(tempFormData.courseTime.value).format("dddd HH:mm");
    
                            tempFormData.studyGroupId.config.options = studyGroupOptions;
                            tempFormData.subjectId.config.options = subjectOptions;
                            tempFormData.professorId.config.options = professorOptions;
    
                            tempFormData.studyGroupId.defaultValue = nextProps.courses.course.studyGroupId;
                            tempFormData.studyGroupId.value = nextProps.courses.course.studyGroupId;
    
                            tempFormData.subjectId.defaultValue = nextProps.courses.course.subjectId;
                            tempFormData.subjectId.value = nextProps.courses.course.subjectId;
    
                            tempFormData.professorId.defaultValue = nextProps.courses.course.professorId;
                            tempFormData.professorId.value = nextProps.courses.course.professorId;
                            
                            if(nextProps.presenceSheets.presenceSheetsList) {
    
                                if(nextProps.marks.marksList) {
    
                                    console.log(nextProps)
                                    this.setState({
                                        presenceSheetsList: nextProps.presenceSheets.presenceSheetsList,
                                        marks: nextProps.marks.marksList,
                                        course: nextProps.courses.course,
                                        presenceSheetsList: nextProps.presenceSheets.presenceSheetsList,
                                        isExamProgrammed: isExamProgrammed,
                                        exam: exam,
                                        formData: tempFormData,
                                        loading: false
                                    });
                                }
                            }
                        }      
                    }
                }
            }
        }

        if(nextProps.marks.updatedMark != null) {
            window.location.reload();
            this.props.dispatch(clearMark())
        }

        if(nextProps.presenceSheets.presencesList) {
            this.setState({
                presences: nextProps.presenceSheets.presencesList,
                isPresenceListLoaded: true
            })
        }

        if(nextProps.courses.updatedCourse) {
            if(nextProps.courses.updatedCourse.message) {
                this.setState({
                    error: nextProps.courses.updatedCourse.message,
                });
            }else {
                this.props.dispatch(clearCourse());
                this.props.history.push("/courses-list");
            }
        }
    }

    updateForm = (formResponse) => {
        let newFormData = {...this.state.formData}
        let newElement = {...newFormData[formResponse.id]};

        newElement.value = formResponse.event.target.value;

        if(formResponse.isBlurred) {
            let isValid = this.validateData(newElement);
            newElement.isValid = isValid[0];
            newElement.validationMessage = isValid[1];
            newElement.isBlurred = formResponse.isBlurred;
        }

        newFormData[formResponse.id] = newElement;
        this.setState({
            formData: newFormData
        });
    }



    validateData = (data) => {

        let error = [true, ""];

        if(data.validation.required) {
            const isValid = data.value.trim() !== "" ? true : false;
            const message = `${!isValid ? "This field is required !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.email) {
            const isValid = /\S+@\S+\.\S+/.test(data.value);
            const message = `${!isValid ? "This field must be a valid email address !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.minLength) {
            const isValid = data.value.length >= data.validation.minLength ? true : false;
            const message = `${!isValid ? `This field must be at least ${data.validation.minLength} characters long !` : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.date) {
            const isValid = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(data.value);
            const message = `${!isValid ? "This field must be a valid date in DD/MM/YYYY format !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        if(data.validation.courseTime) {
            var dateParts = data.value.split(" ");
            var validDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            const isValidDay = (validDays.indexOf(dateParts[0]) > 0) ? true : false;
            const isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(dateParts[1]);
            
            const isValid = isValidDay & isValidTime;
            const message = `${!isValid ? "This field must be a valid date in dddd HH:mm format !" : ""}`;
            error = !isValid ? [isValid, message] : error;
        }

        return error;
    }


    renderError = () => {
        return  this.state.error != ""
                ?
                <div className="error">
                    {this.state.error}
                </div>
                :
                null
    }

    renderButton = () => {
        return  this.state.edit === false
                ?
                <button onClick={() => this.editHandlle()}>EDIT</button>
                :
                <button onClick={(event) => this.saveHandle(event)}>SAVE</button>
    }

    editHandlle = () => {
        let tempFormData = this.state.formData;
        for(let key in tempFormData) {
            tempFormData[key].config.disabled = false;
        }
        this.setState({
            formData: tempFormData,
            edit: true
        });
    }

    saveHandle = (event) => {
        event.preventDefault();
        let dataToSubmit = {};
        let isFormValid = true;

        for(let key in this.state.formData) {
            dataToSubmit[key] = this.state.formData[key].value;
        }


        for(let key in this.state.formData) {
            isFormValid = isFormValid && this.state.formData[key].isValid ? true : false;
        }

        if(isFormValid) {
            document.body.click();
            let tempFormData = this.state.formData;
            for(let key in tempFormData) {
                tempFormData[key].config.disabled = true;
            }
            dataToSubmit.courseTime = moment(dataToSubmit.courseTime, "dddd HH:mm");
            this.props.dispatch(updateCourse(this.state.course.courseId, dataToSubmit));
            this.setState({
                formData: tempFormData,
                error: "",
                loading: true,
                edit: false
            });
        }else {
            this.setState({
                error: "Something must have happened..."
            });
        }
    }

    
    //presence sheet integration

    renderAddPresenceSheetButton = () => {
        return <button onClick={() => this.addPresenceSheetHandle()}>ADD PRESENCE SHEET</button>
    }

    presenceSheetHandle = () => {
        this.setState({
            isAddPresenceSheetSelected: true
        });
    }
    
    addPresenceSheetHandle = () => {
        console.log(this.state.isAddPresenceSheetSelected);
        let temp;
        temp = this.state.isAddPresenceSheetSelected ? false : true;
        this.setState({
            isAddPresenceSheetSelected: temp
        });

        if(this.state.isAddPresenceSheetSelected) {
            window.location.reload(false);
        }
    }

    changeHandle = (event) => {
        this.setState({
            presenceSheet: {
                presenceSheetId: event.target.value,
                isPresenceListLoaded: false
            }
        });

        this.props.dispatch(clearPresences());
        this.props.dispatch(getPresencesByPresenceSheet(event.target.value));
    }

    renderPresences = () => {
        if(this.state.isPresenceListLoaded) {
            return this.state.presences.map(presence => {
                return (
                    <div key={presence.presenceId} className="presence_row">
                        <div className="left">
                            <Link to={{ 
                                pathname:`/student/${presence.Student.studentId}`,
                                state: {fromDashboard: true }}}>
                                        {`${presence.Student.studentFirstName} ${presence.Student.studentLastName}`}
                            </Link>
                        </div>
                        <div className="right">
                            {presence.presenceStatus ? "PRESENT" : "ABSENT"}
                        </div>
                    </div>
                );
            })
        }
    }

    renderPresenceSheet = () => {
        if(this.state.isAddPresenceSheetSelected) {
            return (
                <div>
                    <AddPresenceSheet courseId={this.state.course.courseId} addPresenceSheetHandle={this.addPresenceSheetHandle}/>
                </div>
            ) 
        }else {
            return (
                <div className="add_presences_container">
                    <h2>Presence report</h2>
                    <select
                        value={this.state.presenceSheet.presenceSheetDate}
                        defaultValue=""
                        name="presence_status"
                        onChange={(event) => this.changeHandle(event)}>

                            <option value="" disabled>Select wanted presence sheet date...</option>
                            {this.state.presenceSheetsList.map(presenceSheet => {
                                return (
                                    <option key={presenceSheet.presenceSheetId} value={presenceSheet.presenceSheetId}>
                                        {moment(presenceSheet.presenceSheetDate).format("DD/MM/YYYY")}
                                    </option>
                                )
                            })}
                    </select>
                    {this.renderPresences()}
                </div>
            );
        }
    }

    //marks integration
    renderMarks = (marks) => {
        return marks.map(mark => {
            return <Mark mark={mark} subjectTheoryMarks={this.state.course.Subject.subjectTheoryMarks} subjectPracticalMarks={this.state.course.Subject.subjectPracticalMarks} updateMark={(markId, mark) => this.updateMarkHandle(markId, mark)}/>
        });
    }

    updateMarkHandle = (markId, mark) => {
        this.props.dispatch(updateMark(markId, mark));
    }

    renderMarksInformation = () => {
        return this.state.marks.length > 0 ?
                <div className="add_marks_container">       
                    <div className="label_t">
                        Theory
                    </div>
                    <div className="label_p">
                        Practical
                    </div>
                    {this.renderMarks(this.state.marks)}
                </div>
                :
                null
    }

    //exam management
    programmExamHandle = () => {
        this.state.isExamProgrammed ?
        this.setState({
            error: "Exam is already programmed !"
        })
        :
        this.props.history.push(`/add-exam/${this.props.match.params.id}`)
    }

    renderProgrammExamButton = () => {
        return <button onClick={() => this.programmExamHandle()}>PROGRAMM EXAM</button>
    }

    renderExamInformation = () => {
        return this.state.isExamProgrammed ?
                <Link to={{ 
                    pathname:`/exam/${this.state.exam.examId}`,
                    state: {fromDashboard: true }}}>
                        <div className="exam_info">
                            {`Exam for this course is programmed on ${moment(this.state.exam.examDate).format("DD/MM/YYYY")}`}
                        </div>
                </Link>

                :
                <div className="exam_info">
                    Exam is not programmed yet...
                </div>
    }

    renderShowSubjectPageButton = () => {
        return <button onClick={() => this.props.history.push(`/subject/${this.state.course.subjectId}`)}>VIEW SUBJECT</button>
    }

    render() {
        if(!this.state.loading) {
            return (
                <div>
                    <div className="about_container">
                        <div className="about_left_container">
                        <FormField
                                id={"courseName"}
                                formData={this.state.formData.courseName}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                            <FormField
                                id={"courseTime"}
                                formData={this.state.formData.courseTime}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"courseDescription"}
                                formData={this.state.formData.courseDescription}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"studyGroupId"}
                                formData={this.state.formData.studyGroupId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"subjectId"}
                                formData={this.state.formData.subjectId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                            <FormField
                                id={"professorId"}
                                formData={this.state.formData.professorId}
                                changeHandle={(formResponse) => this.updateForm(formResponse)}/>             
                        
                            {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}
                            {this.renderShowSubjectPageButton()}
                            {this.props.users.login.user.userRole == "admin" || (this.props.users.login.user.userRole == "professor" && this.state.course.Professor.professorEmail == this.props.users.login.user.userEmail) ? this.renderAddPresenceSheetButton() : null}
                            {this.props.users.login.user.userRole == "admin" || (this.props.users.login.user.userRole == "professor" && this.state.course.Professor.professorEmail == this.props.users.login.user.userEmail) ? this.renderProgrammExamButton() : null}
                            {this.renderError()}


                        </div>
                        {this.props.users.login.user.userRole == "admin" || (this.props.users.login.user.userRole == "professor" && this.state.course.Professor.professorEmail == this.props.users.login.user.userEmail)
                        ? (
                            <div className="about_right_container">
                                <div className="bottom">
                                    {this.renderPresenceSheet()}
                                </div>
                            </div>
                        )
                        :  
                        null}

                    </div>
                    
                    {this.props.users.login.user.userRole == "admin" || this.props.users.login.user.userRole == "professor" ? this.renderMarksInformation() : null}

                    {this.renderExamInformation()}

                </div>
            )
        }else {
            return (
                <div className="loader"/>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        courses: state.courses,
        studyGroups: state.studyGroups,
        subjects: state.subjects,
        professors: state.professors,
        presenceSheets: state.presenceSheets,
        marks: state.marks,
        exams: state.exams
    }
}

export default connect(mapStateToProps)(AboutCourse);