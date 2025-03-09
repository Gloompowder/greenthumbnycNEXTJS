import React, { useState } from 'react';
import styles from './Account.module.css';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: ''
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Add your update logic here
  };

  return (
    <div className={styles.accountContainer}>
      <h1 className={styles.accountTitle}>Account Account</h1>

      <div className={styles.accountSection}>
        <h2 className={styles.sectionTitle}>Profile Information</h2>
        
        <div className={styles.profileSection}>
          <div className={styles.profilePicture}>
            <label htmlFor="profile-upload">
              <img 
                src={profileImage || '/default-profile.png'} 
                alt="Profile" 
                className={styles.profileImage}
              />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className={styles.accountInfo}>
            {isEditing ? (
              <>
                <input
                  className={styles.accountInput}
                  placeholder="Name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  required
                />
                <input
                  className={styles.accountInput}
                  type="email"
                  placeholder="Email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  required
                />
                <input
                  className={styles.accountInput}
                  type="password"
                  placeholder="New Password"
                  value={userInfo.password}
                  onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                />
                <div className={styles.accountActions}>
                  <button
                    type="submit"
                    className={styles.accountButton}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.accountButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.accountInfoText}>Name: {userInfo.name}</p>
                <p className={styles.accountInfoText}>Email: {userInfo.email}</p>
                <div className={styles.accountActions}>
                  <button
                    type="button"
                    className={styles.accountButton}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className={`${styles.accountButton} ${styles.dangerButton}`}
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    Delete Account
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className={styles.confirmationDialog}>
          <div className={styles.confirmationContent}>
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to permanently delete your account? This action cannot be undone.</p>
            <div className={styles.confirmationButtons}>
              <button
                className={`${styles.accountButton} ${styles.dangerButton}`}
                onClick={() => {/* Add delete logic here */}}
              >
                Delete Account
              </button>
              <button
                className={styles.accountButton}
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;