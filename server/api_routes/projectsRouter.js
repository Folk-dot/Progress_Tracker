import { Router } from "express";
import authMiddleware from "../controller/authController.js";
import * as db from '../db/queries.js';
const projectsRouter = Router();

projectsRouter.use(authMiddleware);
projectsRouter.get('/', async(req, res, next) => {
    const { user_id, username } = req.user;
    try{
        const user_info = await db.getUser(username);
        const { first_name, last_name } = user_info;
        const projects = await db.getProjects(user_id);
        res.status(200).json({ body: projects, header: `${last_name}, ${first_name}` });
        return;
    }catch (err) {
        next(err);
    }
});
projectsRouter.post('/', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_name } = req.body;
    try{
        await db.insertProject(user_id, project_name);
        res.status(201).json({ message: 'Insert project success'})
        return;
    }catch (err) {
        next(err);
    }
});
projectsRouter.patch('/:project_id', async(req, res, next) => {
    const { project_id } = req.params;
    const { newHeader } = req.body;
    try{
        await db.updateProjectName(project_id, newHeader);
        res.status(200).json({ message: 'Updated successfully' });
    }catch (err) {
        next(err);
    }
})
projectsRouter.get('/:project_id/todo-lists', async(req, res, next) => {
    const { project_id } = req.params;
    const { user_id } = req.user;
    try{
        const project_info = await db.getProjects(user_id);
        const { project_name } = project_info.find(item => item.project_id == project_id);
        const todo_lists = await db.getTodoLists(project_id);
        res.status(200).json({ body: todo_lists, header: project_name });
    }catch (err) {
        next(err);
    }
});
projectsRouter.post('/:project_id/todo-lists', async(req, res, next) => {
    const { project_id } = req.params;
    const { list_name } = req.body;
    try{
        await db.insertTodoList(project_id, list_name);
        res.status(201).json({ message: 'Insert todo-list success' });
    }catch (err) {
        next(err);
    }
});
projectsRouter.delete('/:project_id/todo-lists', async(req, res, next) => {
    const removedListsArr = req.body;
    try{
        await db.deleteTodoList(removedListsArr);
        res.status(200).json({ message: 'Deleted successfully'});
    }catch (err) {
        next(err);
    }
})
projectsRouter.patch('/:project_id/todo-lists/:list_id', async(req, res, next) => {
    const { list_id } = req.params;
    const { completed } = req.body;
    try{
        await db.updateTodoList(list_id, completed);
        res.status(201).json({ message: 'List update success' });
    }catch (err) {
        next(err);
    }
})

export default projectsRouter;