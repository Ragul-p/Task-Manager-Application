const Task = require("../models/Task.modeljs");

const getLogin = (req, res) => {
    return res.render("login", { layout: "login" });
}


const getDashboard = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).lean();
        res.render("dashboard", { name: req.user.firstName, tasks, image: req.user.image });
    } catch (error) {
        res.render("error/500");
    }
}




module.exports = { getLogin, getDashboard };