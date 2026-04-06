import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function useFetch (api_path, refetch, setErrMsg) {
  const [ data, setData ] = useState({ body: [], header: '' });
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async() => {
      setIsLoading(true);
      setErrMsg('');
      try{
        const token = localStorage.getItem('token');
        if ( !token ) {
          navigate('/login');
          return;
        }
        const response = await fetch(api_path, {
          signal: controller.signal,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if ( response.status === 401 ){
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const data = await response.json();
        if ( !response.ok ) {
          throw new Error(data.message);
        }
        setData(data);
      }catch (err) {
        if ( err.name !== 'AbortError' ) {
          setErrMsg(err.message);
        }
      }finally{
        setIsLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [api_path, refetch, setErrMsg])

  return { data, isLoading }
}