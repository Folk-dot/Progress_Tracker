import '../styles/App.css';
import { Link, useParams } from "react-router"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ErrorMsg from "../components/Error.jsx";
import useFetch from "../hooks/useFetch.jsx";
import useProjects from "../hooks/useProjects.jsx"
import useTodoLists from '../hooks/useTodoLists.jsx';
import Menu from "../components/Menu.jsx";
const api_path = import.meta.env.VITE_API_URL;

export function Homepage(){
  return (<>
    <div className='homepage'>
      <h1>Welcome to Progress Tracker</h1>
      <p>Accomplish your goals with our helps!</p>
      <div className='container'>
        <Link to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
      </div>
    </div>
  </>)
}

export function Login(){
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');
  const navigate = useNavigate();
    
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
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
        throw new Error(data.message);
      }
      const token = data.token;
      localStorage.setItem('token', token);
      navigate('/projects');
    }catch (err) {
      setError(err.message);
    }finally {
      setIsLoading(false);
    }
  }

  return (<>
    <div className='login'>
      <form onSubmit={ handleSubmit }>
        <h1>LOGIN</h1>
        <label htmlFor="username">Email: 
            <input type='email' name='username' id='username' placeholder="please enter your email"/>
        </label>
        <label htmlFor="password">Password: 
            <input type='password' name='password' id='password' placeholder="please enter your password"/>
        </label>
        { error && <ErrorMsg msg={error} /> }
        <button disabled={isLoading} type='submit'>{ isLoading ? 'Login...' : 'Login' }</button>
      </form>
      <div className='container'>
        <p>Have no account?</p>
        <Link to='/register'>Create an account</Link>
      </div>
    </div>
  </>)
}

export function Register(){
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
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
        throw new Error(data.message);
      }
      const token = data.token
      localStorage.setItem('token', token);
      navigate('/projects');
    }catch (err) {
      setError(err.message);
    }finally {
      setIsLoading(false);
    }
  };

  return(<>
    <div className='register'>
      <form onSubmit ={ handleSubmit}>
        <h1>CREATE AN ACCOUNT</h1>
        <label htmlFor="first_name">Firstname:
          <input type='text' name='first_name' id='first_name' placeholder="please enter your firstname"/>
        </label>
        <label htmlFor="last_name">Lastname:
          <input type='text' name='last_name' id='last_name' placeholder="please enter your lastname"/>
        </label>
        <label htmlFor="username">Email:
          <input type='email' name='username' id='username' placeholder="please enter your email"/>
        </label>
        <label htmlFor="password">Password:
          <input type='password' name='password' id='password' placeholder="please enter your password"/>
        </label>
        { error && <ErrorMsg msg={error} /> }
        <button disabled={ isLoading } type='submit'>{ isLoading ? 'Registering...' : 'Register' }</button>
      </form>
      <div className='container'>
        <p>Have an account?</p>
        <Link to='/login'>Login</Link>
      </div>
    </div>
  </>)
}

export function Projects(){
  const projects_path = `${api_path}/api/projects`;
  const [ refetch, setRefetch ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');
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
    <div className='projects'>
      { errMsg && <ErrorMsg msg={errMsg} /> }
      <div className="header">
        <h1>{`Hello ${data.header}!`}</h1>
        <button onClick={ handleLogout }>Logout</button>
      </div>
      <h2>{ data.body.length < 1 ? 'You have no project' : 'Here are your projects:'}</h2>
      <div className='projectCardContainer'>
        { data.body.map(({ project_id, project_name }) => 
          <div className="projectCard" key={project_id}>
            <Link  to={`/projects/${project_id}/todo-lists`}>
              {project_name}
            </Link>
          </div>
        )}
      </div>

      { state.isAdding ? 
        <input 
          ref={ input.ref }
          type='text' 
          name='new-project' 
          id='new-project' 
          value={ input.value } 
          onChange={ input.onChange } 
          onBlur={ input.onBlur } 
        /> 
        : <button className='addProject' onClick={ button.adding }>add project</button> }
    </div>
  </>)
}

export function Todolist(){
  const { project_id } = useParams();
  const project_id_path = `${api_path}/api/projects/${project_id}`;
  const [ refetch, setRefetch ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');
  const [ lists, setLists ] = useState([]);
  const { data, isLoading } = useFetch(`${project_id_path}/todo-lists`, refetch, setErrMsg);
  const { input, button, header, state } = useTodoLists(project_id_path, setLists, setRefetch, setErrMsg);

  useEffect(() => {
    setLists(data.body);
  }, [data]);

  if ( isLoading ) {
    return <p>Loading...</p>
  }

  return (<>
    <div class='todoLists'>
      { errMsg && <ErrorMsg msg={errMsg} /> }
      <h1 key={data.header} contentEditable suppressContentEditableWarning onBlur={ (e) => e.target.textContent === data.header ? '' : header.update(e.target.textContent) }>{data.header}</h1>
      <h2>Todo Lists:</h2>
      <div className='listCardContainer'>
        { lists.map(({ list_id, list_name, completed }) => 
          <div className="listCard" key={list_id}>
            <div className='left'>
              <input 
                  type='checkbox' 
                  onChange={ () => input.onToggle }
                  checked={ completed }
                  id={`list-${list_id}`}
                />
              <label htmlFor={`list-${list_id}`}>
                {list_name}
              </label>
            </div>
            { state.isEditing && <button className='deleteBtn' onClick={()=>button.deleteList(list_id)}>-</button>}
          </div>  
        )}
      </div>
      { state.isEditing ?
        <div className='saveContainer'>
          <button id='discardBtn' onClick={ button.discard }>Discard</button>
          <button id='saveBtn' onClick={ button.save }>Save</button> 
        </div> 
        : (state.isAdding ? 
          <input 
            ref={ input.ref }
            type='text'
            value={ input.value }
            onChange={ input.onChange }
            onBlur={ input.onBlur }
          /> 
          : <div className='editContainer'>
              <button id='editBtn' onClick={ button.edit }>Edit</button> 
              <button id='addListBtn' onClick={ button.add }>Add todo-list</button>
            </div>)
        }
    <Link to='/projects'>Back</Link>
  </div>
  </>)
}