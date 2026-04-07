import { useNavigate } from "react-router"
import { useState } from "react";

export default function ConfirmModal ({ onClose, onConfirm }) {
    const [ deleting, setdeleting ] = useState(false);
    const navigate = useNavigate();
    const handleDelete = async () => {
        if ( deleting ) return;
        setdeleting(true);
        try{  
            await onConfirm();
        }catch (err) {
            console.log(err.message);
        }finally{   
            onClose();
            setdeleting(false);
            navigate('/projects');
        }
}
    return (<>
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            
            <h2 className="text-lg font-semibold text-gray-900">
                Delete project?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. This will permanently delete your project.
            </p>

            <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 text-sm rounded-lg bg-gray-300 hover:bg-gray-200" 
                        onClick={ onClose }
                >
                    Cancel
                </button>
                <button className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600" 
                        onClick={ handleDelete }
                >
                    Delete
                </button>
            </div>

        </div>
        </div>
    </>)
}