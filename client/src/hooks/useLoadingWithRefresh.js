import { useEffect, useState } from "react";
// import { useDispatch } from 'react-redux';
// import api from '../helper/http';
// import { setAuth } from '../store/auth.slice';



export function useLoadingWithRefresh() {
    const [loading, setloading] = useState(true);
    // const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            try {
                // const { data } = await api.get('/api/refresh')
                // dispatch(setAuth(data));
                setloading(false);
            } catch (error) {
                // log
                setloading(false);
            }
        })()

        // eslint-disable-next-line
    }, []);

    return { loading };
}