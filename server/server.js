const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
//app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "./client/build")))//middleware appliance
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        greeting: "Hello"
    })
})

//backend data processing routes
require("./routes/userRoutes")(app);
require("./routes/studentRoutes")(app);
require("./routes/professorRoutes")(app);
require("./routes/subjectRoutes")(app);
require("./routes/facultyRoutes")(app);
require("./routes/studyGroupRoutes")(app);
require("./routes/studyYearRoutes")(app);
require("./routes/departmentRoutes")(app);
require("./routes/courseRoutes")(app);
require("./routes/courseRoutes")(app);
require("./routes/presenceRoutes")(app);
require("./routes/markRoutes")(app);
require("./routes/newsRoutes")(app);
require("./routes/examRoutes")(app);
require("./routes/documentRoutes")(app);

require("./fillDatabase")();



//powering up the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

