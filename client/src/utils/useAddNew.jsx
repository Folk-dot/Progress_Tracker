import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

export default function useAddNew (api_path, topic, setUpdated, setErrMsg) {
    const [ value, setValue ] = useState('');
    const [ isAdding, setIsAdding ] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current?.focus();
    },[ isAdding ])

    const handleBlur = async() => {
        setUpdated(false)
        if ( !value.trim() ) {
            setValue('');
            setIsAdding(false);
            return;
        }
        const token = localStorage.getItem('token');
        setErrMsg('')
        try{
            const response = await fetch(api_path, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ [topic]: value })
            })
            if ( response.status === 401 ){
                throw new Error('Unauthorized');
            }   
            if ( !response.ok ) {
                throw new Error('Insertion error')
            }
            setUpdated(prev => !prev);
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

    const handleClick = () => {
        setIsAdding(true);
    }

    return [ inputRef, value, isAdding, handleChange, handleClick, handleBlur ];
}