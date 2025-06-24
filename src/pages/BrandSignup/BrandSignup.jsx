import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import './BrandSignup.css';

const BrandSignup = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    location: '',
    pincode: '',
    description: '',
    expectedReach: '',
    focus: '',
    rating: '',
    budget: '',
    productImages: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.productImages.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);

    setFormData(prev => ({
      ...prev,
      productImages: [...prev.productImages, ...files]
    }));
  };

  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    const newImages = [...formData.productImages];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, productImages: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const newUser = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      type: 'brand',
      brandData: {
        location: formData.location,
        pincode: formData.pincode,
        description: formData.description,
        expectedReach: formData.expectedReach,
        focus: formData.focus,
        rating: formData.rating,
        budget: formData.budget,
        productImages: formData.productImages.map((img) => img.name),
      },
    };

    signup(newUser)
      .then((data) => {
        if (onSignup) {
          onSignup(data.user.email, data.user);
        }
        navigate('/');
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="brand-signup-container">
      <div className="brand-signup-card">
        <h2>Brand Registration</h2>
        <p>Create your brand profile to connect with creators</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Account Information</h3>
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
            <div className="form-group">
              <label>Brand Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Brand Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Brand Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Reach*</label>
                <select
                  name="expectedReach"
                  value={formData.expectedReach}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="1K-10K">1K-10K</option>
                  <option value="10K-50K">10K-50K</option>
                  <option value="50K-100K">50K-100K</option>
                  <option value="100K+">100K+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Focus Area*</label>
                <select
                  name="focus"
                  value={formData.focus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Tech">Tech</option>
                  <option value="Food">Food</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= formData.rating ? 'filled' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Monthly Budget (USD)*</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="100"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Product Images (Max 5)</h3>
            <div className="image-upload-container">
              <label className="image-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-button">+ Upload Images</div>
              </label>
              <div className="image-previews">
                {previewImages.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Brand'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandSignup;