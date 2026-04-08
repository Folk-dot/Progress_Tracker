import '../styles/index.css';
import { Link, useParams } from "react-router"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ErrorMsg from "../components/ErrorMsg.jsx";
import useFetch from "../hooks/useFetch.jsx";
import useProjects from "../hooks/useProjects.jsx"
import useTodoLists from '../hooks/useTodoLists.jsx';
import Menu from "../components/Menu.jsx";
import ConfirmModal from '../components/ConfirmModal.jsx';
import ErrorValidation from '../components/ErrorValidation.jsx';
import ClientError from '../utils/ClientError.js';
const api_path = import.meta.env.VITE_API_URL;

export function Homepage(){
  return (<>
    <div className="centerized">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Progress Tracker
        </h1>
        <p className="text-gray-500 mt-3">
          Accomplish your goals with our help!
        </p>
        <div className="flex gap-4 mt-6 justify-center">
          <Link 
            to="/login" 
            className="w-30 px-5 py-2 rounded-lg bg-blue-500 text-white btn-motion hover:bg-blue-600"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="w-30 px-5 py-2 rounded-lg bg-gray-200 text-gray-800 btn-motion hover:bg-gray-300"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  </>)
}

export function Login(){
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errMsg, setErrMsg ] = useState({ message: '', fields: {} });
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrMsg({ message: '', fields: {} });
    setIsLoading(true);
    const formData = new FormData(e.target);
    const userData = { 
      username: formData.get('username').toLowerCase(),
      password: formData.get('password') 
    }
    try{
      const response = await fetch(`${api_path}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json();
      if ( !response.ok ) {
        throw new ClientError(data);
      }
      const token = data.token;
      localStorage.setItem('token', token);
      navigate('/projects');
    }catch (err) {
      console.error(err.code);
      setErrMsg({ message: err.message, fields: err.fields });
    }finally {
      setIsLoading(false);
    }
  }

  return (<>
    <div className="centerized">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            LOGIN
          </h1>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              name="username"
              id="username"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            { errMsg.fields.username && <ErrorValidation msg={errMsg.fields.username} /> }
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            { errMsg.fields?.password && <ErrorValidation msg={errMsg.fields.password} /> }
          </div>
          { errMsg.message && <ErrorMsg msg={errMsg.message} />}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 text-white 
                      hover:bg-blue-600 
                      btn-motion
                      disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Login...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Have no account?{" "}
            <Link 
              to="/register" 
              className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  </>)
}

export function Register(){
  const [ isLoading, setIsLoading ] = useState(false);
  const [ errMsg, setErrMsg ] = useState({ message: '', fields: {} });
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrMsg({ message: '', fields: {} });
    setIsLoading(true);
    const formData = new FormData(e.target);
    const userData = { 
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      username: formData.get('username').toLowerCase(),
      password: formData.get('password') 
    }
    try{
      const response = await fetch(`${api_path}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json();
      if ( !response.ok ){
        throw new ClientError(data);
      }
      const token = data.token
      localStorage.setItem('token', token);
      navigate('/projects');
    }catch (err) {
      console.error(err.code);
      setErrMsg({ message: err.message, fields: err.fields });
    }finally {
      setIsLoading(false);
    }
  };

  return(<>
  <div className='centerized'>
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
      <form onSubmit ={ handleSubmit} className='space-y-5' noValidate>
        <h1 className="text-2xl font-bold text-center text-gray-900">
          CREATE AN ACCOUNT
        </h1>
        <div>
          <label htmlFor="first_name" className="register-label">
            Firstname
          </label>
          <input 
            required
            type='text' 
            name='first_name' 
            id='first_name' 
            placeholder="please enter your firstname"
            className="register-input"/>
          { errMsg.fields.first_name && <ErrorValidation msg={errMsg.fields.first_name} /> }
        </div>
        <div>
          <label htmlFor="last_name" className="register-label">
            Lastname
          </label>
          <input 
            required
            type='text'  
            name='last_name' 
            id='last_name' 
            placeholder="please enter your lastname"
            className="register-input"/>
          { errMsg.fields.last_name && <ErrorValidation msg={errMsg.fields.last_name} /> }
        </div>
        <div>
          <label htmlFor="username" className="register-label">
            Email
          </label>
          <input 
            required
            type='email'  
            name='username' 
            id='username' 
            placeholder="please enter your email"
            className="register-input"/>
          { errMsg.fields.username && <ErrorValidation msg={errMsg.fields.username} /> }
        </div>
        <div>
          <label htmlFor="password" className="register-label">
            Password
          </label>
          <input 
            required
            type='password' 
            name='password' 
            id='password' 
            placeholder="please enter your password"
            className="register-input"/>
          { errMsg.fields.password && <ErrorValidation msg={errMsg.fields.password} /> }
        </div>
        { errMsg.message && <ErrorMsg msg={errMsg.message} /> }
        <button 
          disabled={ isLoading } 
          type='submit'
          className="w-full py-2 rounded-lg bg-blue-500 text-white 
                      hover:bg-blue-600 
                      btn-motion
                      disabled:opacity-50 disabled:cursor-not-allowed">
          { isLoading ? 'Registering...' : 'Register' }
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Already have an account?{" "}
          <Link 
            to='/login'
            className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
  </>)
}

export function Projects(){
  const projects_path = `${api_path}/api/projects`;
  const [ refetch, setRefetch ] = useState(false);
  const [ errMsg, setErrMsg ] = useState({ message: '', fields: {} });
  const { data, isLoading } = useFetch(projects_path, refetch, setErrMsg);
  const { input, button, state } = useProjects(projects_path, setRefetch, setErrMsg);
  const navigate = useNavigate();
  
  if ( isLoading ) {
    return <p>Loading...</p>;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    return;
  }
  
  return(<>
    <div className="centerized py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl py-10 px-15 space-y-6">
        { errMsg.message && <ErrorMsg msg={errMsg.message} /> }
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
            Hey {data.header} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Let’s make progress today.
            </p>          
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 btn-motion">
            Logout
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.body.length < 1
            ? 'No projects yet. Start by adding one 👇'
            : 'Here are your projects:'}
        </h2>
        <div className="space-y-3">
          {data.body.map(({ project_id, project_name }) => (
            <Link
              key={project_id}
              to={`/projects/${project_id}/todo-lists`}
              className="block border border-gray-200 px-4 py-3 bg-gray-50 rounded-lg 
                        hover:bg-blue-200 
                        btn-motion">
              {project_name}
            </Link>
          ))}
        </div>
        <div>
          {state.isAdding ? (
            <input
              ref={input.ref}
              type="text"
              name="new-project"
              id="new-project"
              value={input.value}
              onChange={input.onChange}
              onBlur={input.onBlur}
              placeholder="Enter project name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <button
              onClick={button.adding}
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 btn-motion"
            >
              + Add Project
            </button>
          )}
        </div>

      </div>
    </div>
  </>)
}

export function Todolist(){
  const { project_id } = useParams();
  const project_id_path = `${api_path}/api/projects/${project_id}`;
  const [ refetch, setRefetch ] = useState(false);
  const [ errMsg, setErrMsg ] = useState({ message: '', fields: {} });
  const [ lists, setLists ] = useState([]);
  const { data, isLoading } = useFetch(`${project_id_path}/todo-lists`, refetch, setErrMsg);
  const { input, button, header, state } = useTodoLists(project_id_path, setLists, setRefetch, setErrMsg);
  const [ showModal, setShowModal ] = useState(false);

  useEffect(() => {
    setLists(data.body);
  }, [data]);

  if ( isLoading ) {
    return <p>Loading...</p>
  }

  return (<>
    <div className="centerized py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        { errMsg.message && <ErrorMsg msg={errMsg.message} /> }
        { showModal && <ConfirmModal onClose={() => setShowModal(false)} onConfirm={button.deleteProject} /> }
        <div className="flex items-center justify-between">
          <Link 
            to="/projects" 
            className="py-2 px-2 bg-gray-300 text-sm text-black rounded-lg hover:bg-gray-400 btn-motion"
          >
            ← Back
          </Link>
          <h1
            key={data.header}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              e.target.textContent === data.header
                ? ''
                : header.update(e.target.textContent)
            }
            className="text-2xl font-bold text-gray-900 text-center flex-1 mx-4 outline-none focus:ring-2 focus:ring-blue-500 rounded">
            {data.header}
          </h1>
          <Menu
            menus={[
              { name: 'edit', fn: button.edit },
              { name: 'delete project', fn: () => setShowModal(true) }
            ]}
          />
        </div>
        <div className='space-y-6 px-5'>
          <h2 className="text-lg font-semibold text-gray-800">
            Todo Lists
          </h2>
          <div className="space-y-3">
            {lists.map(({ list_id, list_name, completed }) => (
              <div
                key={list_id}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg hover:bg-blue-200 btn-motion border border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    onChange={() => input.onToggle(list_id, !completed)}
                    checked={!!completed}
                    id={`list-${list_id}`}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <label
                    htmlFor={`list-${list_id}`}
                    className={`text-gray-800 ${completed ? 'line-through text-gray-400' : ''}`}
                  >
                    {list_name}
                  </label>
                </div>
                {state.isEditing && (
                  <button
                    onClick={() => button.deleteList(list_id)}
                    className="bg-red-500 text-white hover:bg-red-600 transition px-1.5 rounded-md"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>
          <div>
            {state.isEditing ? (
              <div className="flex justify-end gap-3">
                <button
                  onClick={button.discard}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 btn-motion"
                >
                  Discard
                </button>
                <button
                  onClick={button.save}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 btn-motion"
                >
                  Save
                </button>
              </div>
            ) : state.isAdding ? (
              <input
                ref={input.ref}
                type="text"
                value={input.value}
                onChange={input.onChange}
                onBlur={input.onBlur}
                placeholder="New todo list..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <button
                onClick={button.add}
                className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
              >
                + Add todo list
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </>)
}