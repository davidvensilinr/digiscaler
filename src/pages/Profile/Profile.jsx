// pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import './Profile.css';
// import api helpers if needed in future

const Profile = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialUser) {
      setFormData({
        name: initialUser.name,
        email: initialUser.email,
        bio: initialUser.bio || '',
        avatar: initialUser.avatar || initialUser.creatorData?.profilePic || '',
      });
    }
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app we would PATCH user details to backend.
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    setEditMode(false);
  };

  if (!user) {
    return <div className="profile-container">Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!editMode && (
          <button 
            className="edit-button"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name*</label>
            <input name="name" value={formData.name || ''} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Email*</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
          </div>

          {user.type === 'brand' ? (
            <>
              <div className="form-group"><label>Description*</label><textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Location*</label><input name="location" value={formData.location} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Pincode*</label><input name="pincode" value={formData.pincode} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Expected Reach*</label><input name="expectedReach" value={formData.expectedReach} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Focus*</label><input name="focus" value={formData.focus} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Rating</label><input name="rating" value={formData.rating} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Budget*</label><input type="number" name="budget" value={formData.budget} onChange={handleInputChange} required /></div>
            </>
          ) : (
            <>
              <div className="form-group"><label>Bio</label><textarea name="bio" rows="3" value={formData.bio} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Follower Count*</label><input name="followerCount" value={formData.followerCount} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Pricing*</label><input name="pricing" value={formData.pricing} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Services (comma separated)</label><input name="services" value={formData.services} onChange={handleInputChange} /></div>
              <h4>Platform Links</h4>
              <div className="form-group"><label>YouTube</label><input name="youtube" value={formData.youtube} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Instagram</label><input name="instagram" value={formData.instagram} onChange={handleInputChange} /></div>
              <div className="form-group"><label>TikTok</label><input name="tiktok" value={formData.tiktok} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Twitter/X</label><input name="twitter" value={formData.twitter} onChange={handleInputChange} /></div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="avatar-section">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.name}'s avatar`} className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="info-section">
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;