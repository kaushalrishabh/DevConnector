import api from '../utils/api';
import {setAlert} from './alert';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST
} from './types';

// GET ALL POSTS

export const getPosts = () => async dispatch => {
    try
    {
        const res = await api.get('/posts');
        
        dispatch({
            type: GET_POSTS,
            payload: res.data
        });
    }
    catch(err)
    {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

//ADD LIKE
export const addLike = id => async dispatch => {
    try
    {
        const res = await api.put(`/posts/like/${id}`);
        
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        });
    }
    catch(err)
    {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

//REMOVE LIKE
export const removeLike = id => async dispatch => {
    try
    {
        const res = await api.put(`/posts/unlike/${id}`);
        
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        });
    }
    catch(err)
    {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Delete a Post

export const deletePost = (id) => async dispatch => {
    try
    {
        await api.delete(`/posts/${id}`);
        
        dispatch({
            type: DELETE_POST,
            payload: id 
        });
        
        dispatch(setAlert('Post Removed', 'success'));
    }
    catch(err)
    {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// Add a Post

export const addPost = (formData) => async dispatch => {
    try
    {
        const res = await api.post('/posts', formData);
        
        dispatch({
            type: ADD_POST,
            payload: res.data 
        });
        
        dispatch(setAlert('Post Created', 'success'));
    }
    catch(err)
    {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};