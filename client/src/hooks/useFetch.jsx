import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ClientError from "../utils/ClientError";

export default function useFetch (api_path, refetch, setErrMsg) {
  const [ data, setData ] = useState({ body: [], header: '' });
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async() => {
      setIsLoading(true);
      setErrMsg({ message: '', fields: {} });
      try{
        const token = localStorage.getItem('token');
        if ( !token ) {
          console.error('UNAUTHORIZED');
          navigate('/login');
          return;
        }
        const response = await fetch(api_path, {
          signal: controller.signal,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await response.json();
        if ( !response.ok ) {
          if ( data.status === 401 ) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new ClientError(data);
        }
        setData(data);
      }catch (err) {
        if ( err.name !== 'AbortError' ) {
          console.log(err)
          console.error(err.code);
          setErrMsg({ message: err.message, fields: err.fields });
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