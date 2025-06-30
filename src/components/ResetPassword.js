import React, { useState } from 'react';
import '../styles/ResetPassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';


const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = (submitEvent) => {
    submitEvent.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    fetch('https://kchtg2e005.execute-api.us-west-2.amazonaws.com/production/users/update-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.message && data.message.toLowerCase().includes('success')) {
        setMessage('Password has been successfully changed.');
        setCurrentPassword('');
        setNewPassword('');
      } else if (data && data.message) {
        setError(data.message);
      } else {
        setError('Failed to reset password.');
      }
      setLoading(false);
    });

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
                onChange={(changeEvent) => setCurrentPassword(changeEvent.target.value)}
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
                onChange={(changeEvent) => setNewPassword(changeEvent.target.value)}
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
