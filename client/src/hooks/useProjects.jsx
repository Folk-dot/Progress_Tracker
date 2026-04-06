import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

export default function useProjects (api_path, setRefetch, setErrMsg) {
    const [ value, setValue ] = useState('');
    const [ isAdding, setIsAdding ] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if ( !token) {
            navigate('/login');
        }
    }, [ navigate ]);

    useEffect(() => {
        if ( isAdding ) {
            inputRef.current?.focus();
        }
    },[ isAdding ])

    const insertProject = async() => {
        setErrMsg('')
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
            if ( response.status === 401 ){
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }   
            if ( !response.ok ) {
                throw new Error('Insertion error')
            }
            setRefetch(prev => !prev);
        }catch (err) {
            setErrMsg(err.message);
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