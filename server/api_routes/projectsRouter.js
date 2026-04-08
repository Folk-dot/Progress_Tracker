import { Router } from "express";
import authMiddleware from "../controller/authController.js";
import * as db from '../db/queries.js';
import ServerError from "../utils/ServerError.js";
const projectsRouter = Router();

projectsRouter.use(authMiddleware);
projectsRouter.get('/', async(req, res, next) => {
    const { user_id } = req.user;
    try{
        const results = await db.getProjects(user_id);
        const header = `${results[0]?.last_name}, ${results[0]?.first_name}`;
        const body = results.map(({project_id, project_name}) => ({project_id, project_name}));
        if ( !body[0].project_id ) {
            return res.status(200).json({ body: [], header });
        }
        res.status(200).json({ body, header });
        return;
    }catch (err) {
        next(err);
    }
});
projectsRouter.post('/', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_name } = req.body;
    try{
        const result = await db.insertProject(user_id, project_name);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Project not found', 404);
        }
        res.status(201).json({ message: 'Insert project success'})
        return;
    }catch (err) {
        next(err);
    }
});
projectsRouter.patch('/:project_id', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const { newHeader } = req.body;
    try{
        const result = await db.updateProjectName(project_id, newHeader, user_id);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Project not found', 404);
        }
        res.status(200).json({ message: 'Updated successfully' });
    }catch (err) {
        next(err);
    }
})
projectsRouter.delete('/:project_id', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_id } = req.params;
    try {
        const result = await db.deleteProject(project_id, user_id);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Project not found', 404);
        }
        res.sendStatus(204);
    }catch (err) {
        next(err);
    }
})
projectsRouter.get('/:project_id/todo-lists', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_id } = req.params;
    try{
        const result = await db.getTodoLists(project_id, user_id);
        if ( result.length === 0 ) {
            throw new ServerError('NOT_FOUND', 'Todo lists not found', 404);
        }
        const header = result[0]?.project_name || '';
        const body = result.map(({project_name, ...rest}) => rest);
        if ( !body[0].list_id ) {
            return res.status(200).json({ body:[], header })
        }
        res.status(200).json({ body, header });
    }catch (err) {
        next(err);
    }
});
projectsRouter.post('/:project_id/todo-lists', async(req, res, next) => {
    const { user_id } = req.user;
    const { project_id } = req.params;
    const { list_name } = req.body;
    try{
        const result = await db.insertTodoList(project_id, list_name, user_id);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Project not found', 404 )
        }
        res.status(201).json({ message: 'Insert todo-list success' });
    }catch (err) {
        next(err);
    }
});
projectsRouter.delete('/:project_id/todo-lists', async(req, res, next) => {
    const { user_id } = req.user;
    const removedListsArr = req.body;
    try{
        const result = await db.deleteTodoList(removedListsArr, user_id);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Todo lists not found', 404);
        }
        res.status(200).json({ message: 'Deleted successfully'});
    }catch (err) {
        next(err);
    }
})
projectsRouter.patch('/:project_id/todo-lists/:list_id', async(req, res, next) => {
    const { user_id } = req.user;
    const { list_id } = req.params;
    const { completed } = req.body;
    try{
        const result = await db.updateTodoList(list_id, completed, user_id);
        if ( result.rowCount === 0 ) {
            throw new ServerError('NOT_FOUND', 'Todo lists not found', 404);
        }
        res.status(201).json({ message: 'List update success' });
    }catch (err) {
        next(err);
    }
})

export default projectsRouter;