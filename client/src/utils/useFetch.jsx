import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function useFetch (api_path, trigger, setErrMsg) {
  const [ data, setData ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async() => {
      setIsLoading(true);
      setErrMsg('');
      try{
        const token = localStorage.getItem('token');
        const response = await fetch(api_path, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if ( response.status === 401 ){
          navigate('/login');
          return
        }
        const data = await response.json();
        if ( !response.ok ) {
          throw new Error(data.message);
        }
        setData(data);
      }catch (err) {
        setErrMsg(err.message);
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
  }, [trigger])
  return [ data, isLoading ]
}