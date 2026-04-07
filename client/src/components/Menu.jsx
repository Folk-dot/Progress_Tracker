import { useState, useRef, useEffect } from "react";

export default function Menu({ menus }) {
  const [expanded, setExpanded] = useState(false);
  const menusRef = useRef(null);

  useEffect(() => {        
    const handleOutsideClick = (e) => {
        if (menusRef.current && !menusRef.current.contains(e.target)) {
            setExpanded(false);
        };
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => { 
        document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [])

  return (
    <div ref={menusRef} className="relative inline-block text-left">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        ⋯
      </button>
      {expanded && (
        <div className="absolute top-8 right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {menus.map(({ name, fn }) => (
            <button
              key={`menu-${name}`}
              onClick={() => {
                setExpanded(false);
                fn();
              }}
              className={`w-full text-left px-4 py-2 text-sm ${name=='delete project'?'text-red-500 hover:bg-red-100':'text-gray-700'} 
                         hover:bg-gray-100 transition`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}