import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, Camera, Package, DollarSign,
  Tag, MapPin, CheckCircle, AlertCircle, Shield,
  Clock, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import localDatabase from '../services/localDatabase';
import toast from 'react-hot-toast';

const SellItem = () => {
  const navigate = useNavigate();
  const { userData, userRole } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'books',
    description: '',
    price: '',
    campus: 'main',
    condition: 'good',
    images: [],
    contactMethod: 'chat'
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'books', label: 'Books & Study Material', icon: '📚' },
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'furniture', label: 'Furniture', icon: '🪑' },
    { value: 'clothing', label: 'Clothing & Fashion', icon: '👕' },
    { value: 'sports', label: 'Sports Equipment', icon: '⚽' },
    { value: 'other', label: 'Other', icon: '📦' },
  ];

  const conditions = [
    { value: 'new', label: 'New', description: 'Never used, with tags' },
    { value: 'like_new', label: 'Like New', description: 'Used but looks brand new' },
    { value: 'good', label: 'Good', description: 'Normal signs of wear' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but functional' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, needs repair' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Uploaded images before processing:', uploadedImages);
    if (!userData) {
      toast.error('Please login to sell items');
      navigate('/login');
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      toast.error('Please enter item title');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter item description');
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare item data
      const itemData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseInt(formData.price) || 0,
        category: formData.category,
        condition: formData.condition,
        campus: formData.campus,
        sellerId: userData.id,
        sellerName: userData.name || userData.email.split('@')[0],
        sellerRole: userRole || 'student',
        images: await Promise.all(uploadedImages.map(async (img) => {
          // Convert blob URL to data URL for persistence
          if (img.preview.startsWith('blob:')) {
            const response = await fetch(img.preview);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          }
          return img.preview; // Already a data URL or external URL
        })),
        contactMethod: formData.contactMethod
      };

      console.log('Item images to save:', itemData.images);
      console.log('First image type:', typeof itemData.images[0]);
      console.log('First image preview (first 50 chars):', itemData.images[0]?.substring(0, 50));
      // Submit to database
      const result = await localDatabase.createItem(itemData);

      if (result.success) {
        if (result.status === 'pending') {
          toast.success(
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-500" size={20} />
              <div>
                <div className="font-semibold">Item Submitted for Approval</div>
                <div className="text-sm">Your item will be reviewed within 24 hours</div>
              </div>
            </div>,
            { duration: 5000 }
          );
        } else {
          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <div className="font-semibold">Item Published Successfully!</div>
                <div className="text-sm">Your item is now live on marketplace</div>
              </div>
            </div>,
            { duration: 4000 }
          );
        }

        // Reset form
        setFormData({
          title: '',
          category: 'books',
          description: '',
          price: '',
          campus: 'main',
          condition: 'good',
          images: [],
          contactMethod: 'chat'
        });
        setUploadedImages([]);

        // Navigate back after a delay
        setTimeout(() => {
          navigate('/marketplace');
        }, 1500);
      } else {
        toast.error('Failed to submit item. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting item:', error);
      toast.error('Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 5 - uploadedImages.length); // Max 5 images

    // Simulate uploaded images
    const simulatedImages = newImages.map((file, index) => ({
      id: uploadedImages.length + index + 1,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setUploadedImages([...uploadedImages, ...simulatedImages]);
  };

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  // Check if user can create items (students and admins can)
  const canCreateItem = userRole === 'student' || userRole === 'admin';

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>

        <div className="bg-white rounded-2xl shadow-card border border-gray-200 p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please login to list items for sale.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!canCreateItem) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Marketplace
        </button>

        <div className="bg-white rounded-2xl shadow-card border border-gray-200 p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-red-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            Only students and administrators can list items for sale.
            Your role ({userRole || 'guest'}) does not have this permission.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Marketplace
      </button>

      <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sell Your Item</h1>
              <p className="text-blue-100">List your item for sale and connect with interested buyers</p>
            </div>
            {userRole === 'admin' && (
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Shield size={14} />
                ADMIN MODE
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            {/* Item Images */}
            <div>
              <label className="block text-gray-700 font-bold mb-4 text-lg">
                Item Photos
                <span className="text-gray-500 font-normal ml-2">(Up to 5 photos)</span>
              </label>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {/* Upload Button */}
                <label className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50 ${uploadedImages.length > 0 ? 'border-blue-300' : 'border-gray-300'
                  }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadedImages.length >= 5 || isSubmitting}
                  />
                  <Camera size={32} className={`mb-2 ${uploadedImages.length >= 5 ? 'text-gray-300' : 'text-gray-400'}`} />
                  <span className={`text-sm ${uploadedImages.length >= 5 ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add Photos
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {uploadedImages.length}/5
                  </span>
                </label>

                {/* Uploaded Images */}
                {uploadedImages.map((image) => (
                  <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      disabled={isSubmitting}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                ⚡ Tip: Clear, well-lit photos get 3x more responses!
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-lg">
                Item Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., MacBook Air M1 2020, Physics Textbook 3rd Edition"
                className="input-field text-lg"
                required
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-sm mt-1">Be specific to attract the right buyers</p>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      disabled={isSubmitting}
                      className={`p-3 border rounded-xl text-left transition-all ${formData.category === cat.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Condition *</label>
                <div className="space-y-2">
                  {conditions.map(cond => (
                    <label
                      key={cond.value}
                      className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.condition === cond.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={cond.value}
                        checked={formData.condition === cond.value}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                      <div>
                        <p className="font-medium">{cond.label}</p>
                        <p className="text-sm text-gray-600">{cond.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your item in detail. Include specifications, features, reason for selling, etc."
                rows={5}
                className="input-field"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Price and Campus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500">
                    <DollarSign size={20} />
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 65000"
                    className="input-field pl-12"
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-gray-500 text-sm mt-1">Fair pricing helps sell faster</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Campus *</label>
                <select
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="input-field"
                  disabled={isSubmitting}
                >
                  <option value="main">Main Campus</option>
                  <option value="north">North Campus</option>
                  <option value="south">South Campus</option>
                </select>
              </div>
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Preferred Contact Method</label>
              <div className="flex gap-4">
                <label className={`flex-1 ${isSubmitting ? 'opacity-50' : ''}`}>
                  <input
                    type="radio"
                    name="contact"
                    value="chat"
                    checked={formData.contactMethod === 'chat'}
                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  <span>In-app Chat (Recommended)</span>
                </label>
                <label className={`flex-1 ${isSubmitting ? 'opacity-50' : ''}`}>
                  <input
                    type="radio"
                    name="contact"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  <span>Phone Call</span>
                </label>
              </div>
            </div>

            {/* Admin Approval Note - Show only for students */}
            {userRole === 'student' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="text-blue-600 mt-0.5" size={24} />
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Admin Approval Required</h4>
                    <p className="text-blue-700 mb-2">
                      All student listings go through admin review to ensure they meet campus guidelines.
                      Your item will be live within 24 hours if approved.
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>No prohibited items (alcohol, weapons, etc.)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Reasonable pricing for campus market</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Clear, accurate description and photos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Immediate Approval Note - Show only for admins */}
            {userRole === 'admin' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Shield className="text-green-600 mt-0.5" size={24} />
                  <div>
                    <h4 className="font-bold text-green-800 mb-2">Admin Privilege: Immediate Approval</h4>
                    <p className="text-green-700 mb-2">
                      As an administrator, your items are automatically approved and will be live immediately.
                    </p>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Item will appear in marketplace instantly</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>No review queue for admin listings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        <span>Use responsibly for official campus items</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                disabled={isSubmitting}
                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {userRole === 'admin' ? 'Publishing...' : 'Submitting...'}
                  </>
                ) : userRole === 'admin' ? 'Publish Item' : 'Submit for Approval'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItem;
