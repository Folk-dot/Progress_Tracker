import pool from "./pool.js";

export const getUser = async(username) => {
        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [ username ]);
        return rows[0];
}

export const registerUser = async(first, last, username, password) => {
        const { rows } = await pool.query("INSERT INTO users(first_name, last_name, username, password) VALUES($1, $2, $3, $4) RETURNING user_id", [ first, last, username, password ]);
        return rows[0].user_id;
}

export const getProjects = async(user_id) => {
        const { rows } = await pool.query("SELECT project_id, project_name FROM projects WHERE user_id = $1 ORDER BY project_id", [ user_id ])
        // returns project_id and project_name array
        return rows;
}

export const insertProject = async(user_id, project_name) => {
        await pool.query("INSERT INTO projects(project_name, user_id) VALUES($1, $2)", [ project_name, user_id ]);
}

export const getTodoLists = async(project_id) => {
        const { rows } = await pool.query("SELECT list_id, list_name, completed FROM todo_lists WHERE project_id = $1 ORDER BY completed", [ project_id ]);
        //returns list_id, list_name, and completed(true/false) array
        return rows;
}

export const insertTodoList = async(project_id, list_name) => {
        await pool.query("INSERT INTO todo_lists(list_name, project_id) VALUES($1, $2)", [ list_name, project_id ]);
}

export const updateTodoList = async(list_id, status) => {
        await pool.query("UPDATE todo_lists SET completed = $2 WHERE list_id = $1", [ list_id, status ]);
}

export const deleteTodoList = async(removedListsArr) => {
        await pool.query("DELETE FROM todo_lists WHERE list_id = ANY($1)", [ removedListsArr ]);
}

export const updateProjectName = async(project_id, newName) => {
        await pool.query("UPDATE projects SET project_name = $1 WHERE project_id = $2", [ newName, project_id ]);
}

export const deleteProject = async (project_id) => {
        await pool.query("DELETE FROM projects WHERE project_id = $1", [ project_id ]);
}