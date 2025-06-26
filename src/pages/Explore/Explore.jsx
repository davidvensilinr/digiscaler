<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/api';
=======
import { useState } from 'react';
import usersData from '../../data/users.json';
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db
import { useNavigate } from 'react-router-dom';
import './Explore.css';

const Explore = ({ user, userType: initialUserType = null }) => {
  const [userType, setUserType] = useState(initialUserType || user?.type || 'creator');
  const navigate = useNavigate();
  const currentEmail = user?.email;

<<<<<<< HEAD
  const [creators, setCreators] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const creatorsRes = await fetchUsers('creator');
        const brandsRes = await fetchUsers('brand');
        setCreators(creatorsRes.users.filter(u => u.email !== currentEmail));
        setBrands(brandsRes.users.filter(u => u.email !== currentEmail));
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, [currentEmail]);
=======
  // Load data from bundled json + any newly registered users
  const baseUsers = usersData.users;
  const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

  const mergedUsers = [...baseUsers, ...localUsers];

  const creators = mergedUsers.filter(u => u.type === 'creator' && u.email !== currentEmail);
  const brands = mergedUsers.filter(u => u.type === 'brand' && u.email !== currentEmail);

  const toggleUserType = () => {
    setUserType(userType === 'creator' ? 'brand' : 'creator');
  };
>>>>>>> 4ba1158c8d85578c65bd23c69ed8c23e5093b1db

  return (
    <div className="explore-container">
      <h1 className="explore-title">my-app</h1>
      
      <div className="user-type-toggle">
        <button 
          className={`toggle-btn ${userType === 'creator' ? 'active' : ''}`}
          onClick={() => setUserType('creator')}
        >
          Creators
        </button>
        <button 
          className={`toggle-btn ${userType === 'brand' ? 'active' : ''}`}
          onClick={() => setUserType('brand')}
        >
          Brands
        </button>
      </div>

      <div className="profiles-grid">
        {userType === 'creator'
          ? creators.map(creator => {
              const initials = creator.name?.split(' ').map(n => n[0]).join('');
              const data = creator.creatorData || {};
              const primaryPlatform = Object.keys(data.platforms || {}).find(key => data.platforms[key]);
              return (
                <div key={creator.email} className="profile-card">
                  <div className="profile-image">
                    {creator.creatorData?.profilePic || creator.avatar ? (
                      <img src={creator.creatorData?.profilePic || creator.avatar} alt={creator.name} />
                    ) : (
                      <div className="initials">{initials}</div>
                    )}
                  </div>
                  <h3>{creator.name}</h3>
                  {primaryPlatform && (
                    <p><strong>Platform:</strong> {primaryPlatform}</p>
                  )}
                  {data.followerCount && (
                    <p><strong>Followers:</strong> {data.followerCount}</p>
                  )}
                  {data.services && data.services.length > 0 && (
                    <p><strong>Services:</strong> {data.services.slice(0, 2).join(', ')}{data.services.length > 2 ? '...' : ''}</p>
                  )}
                  <button className="connect-btn" onClick={() => navigate(`/chat/${creator.email}`)}>Connect</button>
                </div>
              );
            })
          : brands.map(brand => {
              const initials = brand.name?.split(' ').map(n => n[0]).join('');
              const data = brand.brandData || {};
              return (
                <div key={brand.email} className="profile-card">
                  <div className="profile-image">
                    {brand.brandData?.profilePic || brand.avatar ? (
                      <img src={brand.brandData?.profilePic || brand.avatar} alt={brand.name} />
                    ) : (
                      <div className="initials">{initials}</div>
                    )}
                  </div>
                  <h3>{brand.name}</h3>
                  {data.focus && (
                    <p><strong>Focus:</strong> {data.focus}</p>
                  )}
                  {data.rating && (
                    <p><strong>Rating:</strong> {data.rating}</p>
                  )}
                  {data.budget && (
                    <p><strong>Budget:</strong> ${data.budget}</p>
                  )}
                  <button className="connect-btn" onClick={() => navigate(`/chat/${brand.email}`)}>Connect</button>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Explore;