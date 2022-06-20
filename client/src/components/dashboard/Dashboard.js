import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import { DashboadActions } from './DashboadActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({ 
   getCurrentProfile,
   deleteAccount,
   auth: {user}, 
   profile: {profile, loading} 
}) => 
{
   useEffect(() => {
      getCurrentProfile();
   }, [getCurrentProfile]);
  
   return loading && profile ===null ?  <Spinner /> : 
      <section className = "container">
         <Fragment>
            <h1 className='large text-primary'> Dashboard </h1>
            <p className = "lead">
               <i className="fas fa-user"> </i> Welcome {user && user.name}
            </p>
            {profile!==null ? (
               <Fragment>
                  <DashboadActions /> 
                  <Experience experience ={profile.experience} />
                  <Education education ={profile.education} />
                  <div className='my-2'>
                     <button onClick={() => deleteAccount()} className='btn btn-danger'>
                        <i className='fas fa-user-minus'></i> Delete My Account
                     </button>
                  </div>
               </Fragment> ): (
               <Fragment>
                  <p>  Profile Does not exist, Please add some information </p>
                  <Link to="/create-profile" className="btn btn-primary my-1">
                     Create Profile
                  </Link>
               </Fragment> )}
         </Fragment> 
      </section>;
};

Dashboard.propTypes = {
   getCurrentProfile: PropTypes.func.isRequired,
   deleteAccount: PropTypes.func.isRequired,
   auth: PropTypes.object.isRequired,
   profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
   auth: state.auth,
   profile: state.profile
});


export default connect(mapStateToProps, { deleteAccount, getCurrentProfile })(Dashboard);