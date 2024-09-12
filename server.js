require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;
require("./config/passport")(passport);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

const connectDB = require("./config/db");
connectDB();

const { formatDate, stripTags, truncate, editIcon, select } = require("./helpers/hbs");

app.engine('.hbs', exphbs.engine({ helpers: { formatDate, stripTags, truncate, editIcon, select }, defaultLayout: "main", extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname + "/public")));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: new MongoStore({ mongoUrl: process.env.MONGO_URI, collectionName: "session" }) }));

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



app.use("/", require("./routes/index.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/tasks", require("./routes/task.routes"));




app.listen(3000, () => {
    console.log(`server running  on port ${PORT}`);
});