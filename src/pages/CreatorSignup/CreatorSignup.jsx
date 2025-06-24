import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import './CreatorSignup.css';

const CreatorSignup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profilePic: null,
    platforms: {
      youtube: '',
      instagram: '',
      tiktok: '',
      twitter: ''
    },
    services: [],
    pricing: '',
    followerCount: '',
    bio: ''
  });
  const [profilePreview, setProfilePreview] = useState('');
  const [profilePicData, setProfilePicData] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    'Sponsored Posts',
    'Product Reviews',
    'Brand Ambassadorships',
    'Giveaways',
    'Affiliate Marketing',
    'Content Creation'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [name]: value
      }
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => {
      const newServices = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // read file as dataURL
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setProfilePicData(dataUrl);
        setProfilePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Email uniqueness will be handled by backend

    // Validate at least one service selected
    if (formData.services.length === 0) {
      setError('Please select at least one service');
      setIsSubmitting(false);
      return;
    }

    const newUser = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      type: 'creator',
      creatorData: {
        profilePic: profilePicData,
        platforms: formData.platforms,
        services: formData.services,
        pricing: formData.pricing,
        followerCount: formData.followerCount,
        bio: formData.bio,
      },
    };

    signup(newUser)
      .then((data) => {
        if (onSignup) {
          onSignup(data.user.email, data.user);
        }
        navigate('/');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="creator-signup-container">
      <div className="creator-signup-card">
        <h2>Creator Registration</h2>
        <p>Join our platform to connect with brands</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group profile-pic-group">
                <label>Profile Picture</label>
                <div className="profile-pic-upload">
                  <div className="profile-pic-preview">
                    {profilePreview ? (
                      <img src={profilePreview} alt="Profile Preview" />
                    ) : (
                      <div className="empty-preview">+</div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </div>
              </div>
              <div className="form-group-col">
                <div className="form-group">
                  <label>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password*</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Platform Links</h3>
            <div className="platform-grid">
              <div className="form-group">
                <label>YouTube</label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.platforms.youtube}
                  onChange={handlePlatformChange}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.platforms.instagram}
                  onChange={handlePlatformChange}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div className="form-group">
                <label>TikTok</label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.platforms.tiktok}
                  onChange={handlePlatformChange}
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </div>
              <div className="form-group">
                <label>Twitter/X</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.platforms.twitter}
                  onChange={handlePlatformChange}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Services Offered*</h3>
            <div className="services-grid">
              {serviceOptions.map(service => (
                <div
                  key={service}
                  className={`service-option ${formData.services.includes(service) ? 'selected' : ''}`}
                  onClick={() => handleServiceToggle(service)}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Business Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Follower Count*</label>
                <select
                  name="followerCount"
                  value={formData.followerCount}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Range</option>
                  <option value="1K-10K">1K-10K</option>
                  <option value="10K-50K">10K-50K</option>
                  <option value="50K-100K">50K-100K</option>
                  <option value="100K-500K">100K-500K</option>
                  <option value="500K-1M">500K-1M</option>
                  <option value="1M+">1M+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Average Pricing (USD)*</label>
                <select
                  name="pricing"
                  value={formData.pricing}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Range</option>
                  <option value="$50-$100">$50-$100</option>
                  <option value="$100-$500">$100-$500</option>
                  <option value="$500-$1K">$500-$1K</option>
                  <option value="$1K-$5K">$1K-$5K</option>
                  <option value="$5K+">$5K+</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Bio*</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Tell brands about yourself and your content..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register as Creator'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatorSignup;