import api from '../utils/api';
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR } from './types';
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async dispatch =>
{
    if(localStorage.token)
    {
        setAuthToken(localStorage.token);  
        console.log(localStorage.token);
    }
    try
    {
        const res = await api.get('/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }
    catch(err)
    {
        dispatch({
            type: AUTH_ERROR
        });
    }
}

// Register User
export const register = ({ name, email, password }) => async dispatch => 
{
     // const config = 
     // {
     //     headers: 
     //     {
     //         'Content-Type': 'application/json'
     //     }
     // }
    
     const body = JSON.stringify({ name, email, password});
    
    try
    {
        const res = await api.post('/users', body);
        dispatch(
        {
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    }
    catch(err)
    {
        const errors = err.response.data.errors;
        if(errors)
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger') ));

        dispatch({
            type: REGISTER_FAIL
        });
    }
}