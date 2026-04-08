import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import ClientError from "../utils/ClientError";

export default function useTodoLists (api_path, setLists, setRefetch, setErrMsg) {
    const [ value, setValue ] = useState('');
    const [ isAdding, setIsAdding ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const inputRef = useRef(null);
    const removeRef = useRef([]);
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('token');

    const unauth = useCallback(() => {
        console.error('UNAUTHORIZED')
        localStorage.removeItem('token');
        navigate('/login');
    }, [ navigate ]);

    const fetchTemplate = async(path, method, body) => {
        setErrMsg({ message: '', fields: {} })
        const token = getToken();
        const response = await fetch(path, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            ...( body && { body: JSON.stringify(body) })
        })
        if ( response.status === 204 ) {
            return;
        }
        const data = await response.json();
        if ( !response.ok ) {        
            if ( data.status === 401 ) {
                unauth();
                return;
            }
            throw new ClientError(data);
        }
        return;
    }

    useEffect(() => {
        const token = getToken();
        if (!token) {
            unauth();
        }
    }, [unauth]);

    useEffect(() => {
        if ( isAdding ) {
            inputRef.current?.focus();
        }
    },[ isAdding ])

    const insertItem = async() => {
        if ( !value.trim() ) {
            setValue('');
            setIsAdding(false);
            return;
        }
        try{
            await fetchTemplate(`${api_path}/todo-lists`, 'POST', {list_name: value})
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

    const handleEditing = () => {
        setIsEditing(true);
    }

    const updateHeader = async(newHeader) =>{
        try{
            await fetchTemplate(api_path, 'PATCH', {newHeader})
        }catch (err) {
            console.error(err.code);
            setErrMsg({ message: err.message, fields: err.fields });
        };
    }

    const deleteList = (list_id) => {
        if ( !removeRef.current.includes(list_id) ){
            removeRef.current.push(list_id);
        }
        setLists(prev => prev.filter(list => list.list_id !== list_id));
    }

    const handleDiscard = () => {
        setIsEditing(false);
        if ( removeRef.current.length === 0 ) {
            return;
        }
        removeRef.current=[];
        setRefetch(prev => !prev);
    }

    const handleSave = async() => {
        if ( removeRef.current.length === 0 ) {
            setIsEditing(false);
            return;
        }
        try{
            await fetchTemplate(`${api_path}/todo-lists`, 'DELETE', removeRef.current)
        }catch (err) {
            console.error(err.code);
            setErrMsg({ message: err.message, fields: err.fields });
        }finally{
            removeRef.current=[];
            setIsEditing(false);
            setRefetch(prev => !prev);
        }
    }

    const handleToggle = (list_id, newStatus) => {
        setLists(prev => prev.map(list => 
            list.list_id === list_id  ? { ...list, completed: newStatus } : list
        ));
        updateStatus(list_id, newStatus);
    };

    const updateStatus = async(list_id, newStatus) => {
        try{
            await fetchTemplate(`${api_path}/todo-lists/${list_id}`, 'PATCH', {completed: newStatus});
        }catch (err) {
            console.error(err.code);
            setErrMsg({ message: err.message, fields: err.fields });
        }
    }

    const deleteProject = async() => {
        try{
            await fetchTemplate(api_path, 'DELETE', null);
        }catch (err) {
            console.error(err.code);
            setErrMsg({ message: err.message, fields: err.fields });
        }
    }

    return { 
        input: {
            ref: inputRef,
            value,
            onChange: handleChange,
            onBlur: insertItem,
            onToggle: handleToggle
        },
        button: {
            add: handleAdding,
            deleteList,
            edit: handleEditing,
            save: handleSave,
            discard: handleDiscard,
            deleteProject
        },
        header: {
            update: updateHeader
        },
        state: {
            isAdding,
            isEditing
        }
    }; 
}