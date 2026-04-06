import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";

export default function useTodoLists (api_path, setLists, setRefetch, setErrMsg) {
    const [ value, setValue ] = useState('');
    const [ isAdding, setIsAdding ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const inputRef = useRef(null);
    const removeRef = useRef([]);
    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('token');

    const unauth = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [ navigate ]);

    const fetchTemplate = async(path, method, body) => {
        const token = getToken();
        const response = await fetch(path, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            ...( body && { body: JSON.stringify(body) })
        })
        if ( response.status === 401 ) {
            unauth();
            return null
        }
        if ( !response.ok ) {
            throw new Error("Request failed");
        }
        return response;
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
        setErrMsg('')
        if ( !value.trim() ) {
            setValue('');
            setIsAdding(false);
            return;
        }
        try{
            await fetchTemplate(`${api_path}/todo-lists`, 'POST', {list_name: value})
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

    const handleEditing = () => {
        setIsEditing(true);
    }

    const updateHeader = async(newHeader) =>{
        setErrMsg('');
        try{
            await fetchTemplate(api_path, 'PATCH', {newHeader})
        }catch (err) {
            setErrMsg(err.message);
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
        setErrMsg('');
        if ( removeRef.current.length === 0 ) {
            setIsEditing(false);
            return;
        }
        try{
            await fetchTemplate(`${api_path}/todo-lists`, 'DELETE', removeRef.current)
        }catch (err) {
            setErrMsg(err.message);
        }finally{
            removeRef.current=[];
            setIsEditing(false);
            setRefetch(prev => !prev);
        }
    }

    const handleToggle = (list_id) => {
        let newStatus;
        setLists(prev => prev.map(list => {
        if (list.list_id === list_id ) {
            newStatus = !list.completed;
            return { ...list, completed: newStatus }
        } 
            return list;
        }));
        updateStatus(list_id, newStatus);
    };

    const updateStatus = async(list_id, newStatus) => {
        setErrMsg('');
        try{
            await fetchTemplate(`${api_path}/todo-lists/${list_id}`, 'PATCH', {completed: newStatus});
        }catch (err) {
            setErrMsg(err.message);
        }
    }

    const deleteProject = async() => {
        try{
            await fetchTemplate(api_path, 'DELETE', null);
        }catch (err) {
            setErrMsg(err.message);
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
            deleteList: deleteList,
            edit: handleEditing,
            save: handleSave,
            discard: handleDiscard,
            deleteProject: deleteProject
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