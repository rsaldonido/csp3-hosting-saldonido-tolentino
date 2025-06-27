import React, { useState } from 'react';
import '../styles/ResetPassword.css';

// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token'); // assuming JWT is stored in localStorage

      const response = await fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/users/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        } )
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been successfully changed.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <h3 className="reset-password-title">Update Password</h3>

            <div className="form-group-tech-reset">
              <label htmlFor="currentPassword" className="form-label-tech-reset mb-3">
                <FontAwesomeIcon icon={faLock} className="me-2" />
                Current Password
              </label>
              <input
                type="password"
                className="form-control-tech-reset"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group-tech-reset mb-3">
              <label htmlFor="newPassword" className="form-label-tech-reset">
                <FontAwesomeIcon icon={faLock} className="me-2" /> 
                New Password
              </label>
              <input
                type="password"
                className="form-control-tech-reset"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {message && <div className="alert-success-tech">{message}</div>}
            {error && <div className="alert-danger-tech">{error}</div>}

            <button type="submit" className="submit-btn-tech-reset" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
