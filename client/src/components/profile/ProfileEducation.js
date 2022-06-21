import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const ProfileEducation =({ 
    education: { school, degree, fieldofstudy, current, to, from, description }
 }) => <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
        {formatDate(from) } - {!to ? 'Now' :  formatDate(to) }
    </p>
    <p>
        <strong> Position </strong> {degree}
    </p>
    <p>
        <strong> Description </strong> {fieldofstudy}
    </p>
    <p>
        <strong> Description </strong> {description}
    </p>
    </div>;
  

ProfileEducation.propTypes = {
education: PropTypes.array.isRequired    
};

export default ProfileEducation;