const express = require("express");
const router = express.Router();
const Story = require("../models/Task.modeljs");
const { ensureAuth } = require("../middleware/auth.middleware");
const { getAddTask, postAddTask, getEditTask, postEditTask, deleteTask, getSingleTask,
    getTaskByUser, getAllPendingTask, getSearchTask } = require("../controller/task.controller");



router.get("/add", ensureAuth, getAddTask);
router.post("/", ensureAuth, postAddTask);


router.get("/edit/:id", ensureAuth, getEditTask);
router.put('/:id', ensureAuth, postEditTask)


router.delete('/:id', ensureAuth, deleteTask)
router.get('/:id', ensureAuth, getSingleTask);


router.get('/user/:userId', ensureAuth, getTaskByUser)
router.get("/", ensureAuth, getAllPendingTask);


router.get('/search/:query', ensureAuth, getSearchTask)

module.exports = router;