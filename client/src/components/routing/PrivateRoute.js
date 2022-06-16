import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = 
({
    component: Component,
    auth: { isAuthenticated, loading }
}) => {
    if(!loading && isAuthenticated) return <Component />;
   
        return <Navigate to="/login" />;
};
//         <Route 
//             {...rest}
//             render={props => 
//                 !isAuthenticated && !loading ? 
//                 ( 
//                     <Navigate to="/login" />
//                 ) : (
//                     <Component {...props} />
//                 )
//             } 
//         />
// );

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state =>({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);