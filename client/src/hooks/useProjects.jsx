import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import ClientError from "../utils/ClientError";

export default function useProjects (api_path, setRefetch, setErrMsg) {
    const [ value, setValue ] = useState('');
    const [ isAdding, setIsAdding ] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if ( !token) {
            console.error('UNAUTHORIZED');
            navigate('/login');
        }
    }, [ navigate ]);

    useEffect(() => {
        if ( isAdding ) {
            inputRef.current?.focus();
        }
    },[ isAdding ])

    const insertProject = async() => {
        setErrMsg({ message: '', fields: {} })
        if ( !value.trim() ) {
            setValue('');
            setIsAdding(false);
            return;
        }
        const token = localStorage.getItem('token');
        if ( !token ) {
            navigate('/login');
            return
        }
        try{
            const response = await fetch(api_path, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ project_name: value })
            })
            const data = await response.json();
            if ( !response.ok ){
                if ( data.status === 401 ) {
                    console.error(data.code);
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new ClientError(data);
            }
            setRefetch(prev => !prev);
        }catch (err) {
            console.error(err.code);
            setErrMsg({ message: err.message, fields: err.fields });
        }finally{
            setValue('');
            setIsAdding(false);
        };
    }

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleAdding = () => {
        setIsAdding(true);
    }

    return { 
        input: {
            ref: inputRef,
            value,
            onChange: handleChange,
            onBlur: insertProject
        },
        button: {
            adding: handleAdding
        },
        state: {
            isAdding
        }
    }; 
}