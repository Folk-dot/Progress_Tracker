import { useState, useRef } from "react";

export default function useEdit (api_path, setListAdded, setLists, setErrMsg) {
    const [ isEditing, setIsEditing ] = useState(false);
    const removeRef = useRef([]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleHeader = async(newHeader) =>{
        const token = localStorage.getItem('token');
        try{
            const response = await fetch(api_path, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newHeader })
            })
            if ( response.status === 401 ){
                throw new Error('Unauthorized');
            }
            if ( !response.ok ){
                throw new Error('Failed to rename')
            }
        }catch (err) {
            setErrMsg(err.message);
        };
    }

    const handleDelete = (list_id) => {
        removeRef.current.push(list_id);
        setLists(prev => prev.filter(list => list.list_id !== list_id));
    }

    const handleUnsave = () => {
        if ( removeRef.current.length === 0 ) {
            setIsEditing(false);
            return;
        }
        removeRef.current=[];
        setIsEditing(false);
        setListAdded(prev => !prev);
    }

    const handleSave = async() => {
        if ( removeRef.current.length === 0 ) {
            setIsEditing(false);
            return;
        }
        const token = localStorage.getItem('token');
        try{
            const response = await fetch(`${api_path}/todo-lists`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(removeRef.current)
            })
            if ( response.status === 401 ){
                throw new Error('Unauthorized');
            }
            if ( !response.ok ) {
                throw new Err('Failed to save');
            }
        }catch (err) {
            setErrMsg(err.message);
        }finally{
            removeRef.current=[];
            setIsEditing(false);
            setListAdded(prev => !prev);
        }
    }

    const handleToggle = (list_id) => {
        setLists(prev => prev.map(list => {
        if (list.list_id === list_id ) {
            const newStatus = !list.completed;
            updateStatus(list_id, newStatus);
            return { ...list, completed: newStatus }
        } 
            return list;
        }
        ));
    };

    const updateStatus = async(list_id, newStatus) => {
        const token = localStorage.getItem('token');
        setErrMsg('');
        try{
            const response = await fetch(`${api_path}/todo-lists/${list_id}`, {
                method: 'PATCH',
                headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completed: newStatus })
            })
        if ( response.status === 401 ){
            throw new Error('Unauthorized');
        }
        if ( !response.ok ){
            throw new Error('Please try again')
        }
        }catch (err) {
            setErrMsg(err.message);
        }
    }

    return [ isEditing, handleEdit, handleDelete, handleUnsave, handleSave, handleToggle, handleHeader]
}