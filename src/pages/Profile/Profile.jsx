// pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import './Profile.css';
import usersData from '../../data/users.json';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      const usr = JSON.parse(stored);
      setUser({ ...usr, avatar: usr.avatar || usr.creatorData?.profilePic });
      setFormData({
        name: usr.name,
        email: usr.email,
        bio: usr.bio || '',
        avatar: usr.avatar || usr.creatorData?.profilePic || ''
      });
      return;
    }

    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
      const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const allUsers = [...usersData.users, ...localUsers];
      const foundUser = allUsers.find(u => u.email === loggedInUserId);
      if (foundUser) {
        setUser({ ...foundUser, avatar: foundUser.avatar || foundUser.creatorData?.profilePic });
        if (foundUser.type === 'brand') {
          setFormData({
            name: foundUser.name,
            email: foundUser.email,
            description: foundUser.brandData.description || '',
            location: foundUser.brandData.location || '',
            pincode: foundUser.brandData.pincode || '',
            expectedReach: foundUser.brandData.expectedReach || '',
            focus: foundUser.brandData.focus || '',
            rating: foundUser.brandData.rating || '',
            budget: foundUser.brandData.budget || '',
            avatar: foundUser.avatar || foundUser.brandData?.profilePic || ''
          });
        } else {
          setFormData({
            name: foundUser.name,
            email: foundUser.email,
            bio: foundUser.creatorData.bio || '',
            followerCount: foundUser.creatorData.followerCount || '',
            pricing: foundUser.creatorData.pricing || '',
            services: (foundUser.creatorData.services || []).join(', '),
            youtube: foundUser.creatorData.platforms.youtube || '',
            instagram: foundUser.creatorData.platforms.instagram || '',
            tiktok: foundUser.creatorData.platforms.tiktok || '',
            twitter: foundUser.creatorData.platforms.twitter || '',
            avatar: foundUser.avatar || foundUser.creatorData?.profilePic || ''
          });
        }
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update the user data
    const updatedUser = {
      ...user,
      ...formData
    };
    
    // Update the users array
    const updatedUsers = usersData.users.map(u => 
      u.id === user.id ? updatedUser : u
    );
    
    // Persist to localStorage so data survives refresh

    // 1. Update userData (active session)
    localStorage.setItem('userData', JSON.stringify(updatedUser));

    // 2. If this user exists in registeredUsers, update that record too
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const idx = registeredUsers.findIndex(u => u.email === updatedUser.email);
    if (idx >= 0) {
      registeredUsers[idx] = updatedUser;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // 3. Update local component state
    setUser(updatedUser);
    setEditMode(false);

    alert('Profile updated successfully!');
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