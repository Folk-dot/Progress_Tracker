import { Homepage, Login, Register, Projects, Todolist } from "./components/App";

const routes = [
    {
        path: '/',
        element: <Homepage />
    },{
        path: '/login',
        element: <Login />
    },{
        path: '/register',
        element: <Register />
    },{
        path: '/projects',
        element: <Projects />
    },{
        path: '/projects/:project_id/todo-lists',
        element: <Todolist />
    }
]

export default routes;