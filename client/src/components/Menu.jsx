import { useState } from "react";

export default function Menu ({ menus }) {
    const [ expanded, setExpanded ] = useState(false);
    return (<>
        <button onClick={()=>setExpanded(prev=>!prev)}>...</button>
        { expanded && menus.map(({name, fn}, index) => 
            <button key={`menu-${index}`} onClick={fn}>{name}</button>
        )}
    </>)
}