import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/post';


const Post = ({getPost, post: { post, loading} }) => {
  
    const {id} = useParams();
    useEffect(() => {
        getPost(id);
    },[getPost]);

    return ( loading || post===null ? <Spinner/> :  <Fragment>
    <section className='container'>
        <div>
           <Link to="/posts" className="btn">
              Back to Post
            </Link>
        </div>
        <div className=''>
            <PostItem post={post} showActions={false} />
        </div> 
    </section>        
        </Fragment>);
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
};

const mapStateToProps = state =>({
    post: state.post
});

export default connect(mapStateToProps, {getPost})(Post);