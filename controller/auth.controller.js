
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User.model");

const logout = (req, res) => {
    req.logout((err) => {
        if (err) { return res.render("error/500") }
        res.redirect("/");
    });
}


const getRegister = (req, res) => {
    return res.render("signup", { layout: "login" })
};


const postRegister = async (req, res) => {
    try {

        const { name, email, password, password2 } = req.body;
        let errors = [];

        if (!name || !email || !password || !password2) { errors.push({ msg: "Please fill in all fields" }); }
        if (password !== password2) { errors.push({ msg: "Passwords do not match" }); }
        if (password.length < 6) { errors.push({ msg: "Password should be at least 6 characters" }); }


        if (errors.length > 0) {
            res.render("signup", { "layout": "login", errors, name, email, password, password2 });
        } else {
            const oldUser = await User.findOne({ email: email });
            errors.push({ msg: "Email is already registered" });

            if (oldUser) {
                res.render("signup", { "layout": "login", errors, name, email, password, password2 });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                const newUser = await new User({ firstName: name, email, password: hash, confirmPassword: await bcrypt.hash(password2, salt) }).save();
                if (newUser) {
                    res.render("login", { "layout": "login", success_msg: "You are now registered and can log in" });
                } else {
                    res.render("error/404");
                }
            }
        }
    } catch (error) {
        res.render("error/500");
    }


};

const postLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.render("login", { "layout": "login", error_msg: "Please fill in all fields" }); }

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.render('login', { "layout": "login", error_msg: info.message }); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);

};




module.exports = { logout, getRegister, postRegister, postLogin };