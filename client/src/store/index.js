import { configureStore } from '@reduxjs/toolkit';
import auth from './auth.slice';
import activate from './activate.slice';


const Store = configureStore({
    reducer: {
        auth,   
        activate
    }
});

export default Store;