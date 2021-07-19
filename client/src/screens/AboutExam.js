import {Component} from "react";
import {connect} from "react-redux";
import FormField from "../components/FormField";
import {Link} from "react-router-dom";
import {clearCoursesList, getCourses} from "../actions/coursesActions";
import {updateExam, clearExam, getExam} from "../actions/examActions";
import moment from "moment";
import {clearSubject, getSubjectByExamId} from "../actions/subjectActions";


class AboutExam extends Component {

    state = {
        edit: false,
        exam: null,
        subject: {},
        courses: [],
        error: "",
        loading: false,
        formData: {
            courseId: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "course_id",
                    label: "Course: ",
                    options: []
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examDescription: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "exam_description",
                    label: "Exam description: ",
                    type: "text",
                    placeholder: "Exam description..."
                },
                validation: {
                    required: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examDate: {
                element: "input",
                value: "",
                config: {
                    disabled: true,
                    name: "exam_date",
                    label: "Exam date: ",
                    type: "text",
                    placeholder: "Exam date, DD/MM/YYYY..."
                },
                validation: {
                    required: true,
                    date: true
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
            examIsOnline: {
                element: "select",
                value: "",
                config: {
                    disabled: true,
                    name: "exam_is_online",
                    label: "Exam type: ",
                    options: [
                        {
                            id: 0,
                            name: "online"
                        },
                        {
                            id: 1,
                            name: "physical"
                        }
 
                    ]
                },
                validation: {
                    required: true,
                },
                isValid: false,
                isBlurred: false,
                validationMessage: ""
            },
        }
    };


    UNSAFE_componentWillMount() {
        this.props.dispatch(clearCoursesList());
        this.props.dispatch(clearExam());
        this.props.dispatch(clearSubject());

        this.props.dispatch(getSubjectByExamId(this.props.match.params.id));
        this.props.dispatch(getCourses());
        this.props.dispatch(getExam(this.props.match.params.id));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if(nextProps.courses.coursesList) {
            if(nextProps.subjects.subject) {
                this.setState({
                    subject: nextProps.subjects.subject
                });

                if(nextProps.exams.exam) {
                
                    console.log(nextProps);
                    
                    let tempFormData = this.state.formData;
                    let courseOptions = [];
    
                    nextProps.courses.coursesList.coursesData.map((course) => {
                        courseOptions.push({
                            id: course.courseId,
                            name: `${course.courseName} - group no. ${course.studyGroupId}`
                        });
                    });
    
                    for (var key of Object.keys(tempFormData)) {
                        tempFormData[key].value = nextProps.exams.exam[key];
                        tempFormData[key].isValid = true;
                    }
    
                    tempFormData.courseId.config.options = courseOptions;
    
                    tempFormData.courseId.defaultValue = nextProps.exams.exam.courseId;
                    tempFormData.courseId.value = nextProps.exams.exam.courseId;
    
                    tempFormData.examIsOnline.defaultValue = nextProps.exams.exam.examIsOnline == true ? 0 : 1;
                    tempFormData.examIsOnline.value = nextProps.exams.exam.examIsOnline == true ? 0 : 1;
    
                    tempFormData.examDate.value = moment(tempFormData.examDate.value).format("DD/MM/YYYY");
    
                    console.log(nextProps);
                    this.setState({
                        exam: nextProps.exams.exam,
                        formData: tempFormData,
                        loading: false
                    });
                }
            }
                
            if(nextProps.exams.updatedExam) {
                if(nextProps.exams.updatedExam.message) {
                    this.setState({
                        error: nextProps.exams.updatedExam.message
                    });
                }else {
                    let tempFormData = this.state.formData;
                    for(var key of Object.keys(tempFormData)) {
                        tempFormData[key].config.disabled = true;
                    }
                    this.setState({
                        exam: nextProps.exams.updatedExam,
                        loading: false,
                        edit: false,
                        formData: tempFormData
                    });
                }
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

        return error;
    }

    renderButton = () => {
        return  this.state.edit === false
                ?
                <button onClick={() => this.editHandlle()}>EDIT</button>
                :
                <div>
                    <button onClick={(event) => this.saveHandle(event)}>SAVE</button>
                    <button onClick={(event) => this.cancelHandle(event)}>CANCEL</button>
                </div>
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

    renderSubjectInformation = (subject) => {
        return (
            <div className="about_right_container">
                <h2>
                    About subject
                    <Link to={{ 
                        pathname:`/subject/${subject.subjectId}`,
                        state: {fromDashboard: true }}}>
                            {` ${subject.subjectName}`}
                    </Link>
                </h2>

                <div className="subject_details">
                    <div className="left">
                        Final mark percentage: 
                    </div>
                    <div className="right">
                        {`${subject.subjectTheoryMarks}%`}
                    </div>
                </div>

                
                <div className="subject_details">
                    <div className="left">
                        Credit points: 
                    </div>
                    <div className="right">
                        {subject.subjectCreditScore}
                    </div>
                </div>

            </div>
        )
    }

    cancelHandle = () => {
        let tempFormData = this.state.formData;

        for (var key of Object.keys(tempFormData)) {
            tempFormData[key].value = this.state.exam[key];
            tempFormData[key].isValid = true;
            tempFormData[key].config.disabled = true;
            tempFormData[key].isBlurred = false;
        }

        tempFormData.examDate.value = moment(this.state.exam.examDate).format("DD/MM/YYYY");


        tempFormData.courseId.defaultValue =this.state.exam.courseId;
        tempFormData.courseId.value = this.state.exam.courseId;


        this.setState({
            formData: tempFormData,
            edit: false,
            error: ""
        });
    }

    editHandlle = () => {
        let tempFormData = this.state.formData;
        for(let key in tempFormData) {
            if(key != "courseId")
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
            dataToSubmit.examDate = moment(dataToSubmit.examDate, "DD/MM/YYYY");
            dataToSubmit.examIsOnline = dataToSubmit.examIsOnline == 0 ? true : false;
            this.props.dispatch(clearExam());
            this.props.dispatch(updateExam(this.state.exam.examId, dataToSubmit));
            this.setState({
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

    render() {
        if(!this.state.loading && this.state.exam) {
            return (
                <div className="about_container">
                    <div className="about_left_container">
                        <FormField
                            id={"courseId"}
                            formData={this.state.formData.courseId}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>
                        <FormField
                            id={"examDescription"}
                            formData={this.state.formData.examDescription}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"examDate"}
                            formData={this.state.formData.examDate}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        <FormField
                            id={"examIsOnline"}
                            formData={this.state.formData.examIsOnline}
                            changeHandle={(formResponse) => this.updateForm(formResponse)}/>

                        {this.props.users.login.user.userRole == "admin" ? this.renderButton() : null}
                        {this.renderError()}

                    </div>

                    {this.renderSubjectInformation(this.state.subject)}

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
        exams: state.exams,
        subjects: state.subjects,
        courses: state.courses
    }
}

export default connect(mapStateToProps)(AboutExam);