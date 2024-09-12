const Task = require("../models/Task.modeljs");


const getAddTask = (req, res) => {
    res.render("tasks/add");
}

const postAddTask = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Task.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        res.render("error/500");
    }
}





const getEditTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, }).lean();
        if (!task) { return res.render('error/404') }

        if (task.user != req.user.id) {
            res.redirect('/tasks')
        } else {
            res.render('tasks/edit', { task });
        }
    } catch (err) {
        return res.render('error/500')
    }
}




const postEditTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).lean();
        if (!task) { return res.render('error/404'); }

        if (task.user != req.user.id) {
            res.redirect('/tasks')
        } else {
            task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
            res.redirect('/dashboard')
        }
    } catch (err) {
        return res.render('error/500')
    }
}


const deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).lean();
        if (!task) { return res.render('error/404'); }

        if (task.user != req.user.id) {
            res.redirect('/tasks')
        } else {
            await Task.deleteOne({ _id: req.params.id })
            res.redirect('/dashboard')
        }

    } catch (err) {
        return res.render('error/500')
    }
}






const getSingleTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).populate('user').lean()
        if (!task) { return res.render('error/404') }

        if (task?.user?._id != req.user.id && task.status == 'Pending') {
            res.render('error/404')
        } else {
            res.render('tasks/show', { task });
        }
    } catch (err) {
        res.render('error/404');
    }
}




const getTaskByUser = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.params.userId, status: 'Pending' }).populate('user').lean();
        res.render('tasks/index', { tasks });
    } catch (err) {
        res.render('error/500');
    }
}



const getAllPendingTask = async (req, res) => {
    try {
        const tasks = await Task.find({ status: "Pending" }).populate("user").sort({ createdAt: "desc" }).lean();                
        res.render("tasks/index", { tasks });
    } catch (error) {
        res.render("error/500");
    }
}



const getSearchTask = async (req, res) => {
    try {
        const tasks = await Task.find({ title: new RegExp(req.query.query, 'i'), status: 'Pending' }).populate('user').sort({ createdAt: 'desc' }).lean();
        res.render('tasks/index', { tasks })
    } catch (err) {
        res.render('error/404')
    }
}

module.exports = {
    getAddTask, postAddTask, getEditTask, postEditTask, deleteTask, getSingleTask,
    getTaskByUser, getAllPendingTask, getSearchTask
};