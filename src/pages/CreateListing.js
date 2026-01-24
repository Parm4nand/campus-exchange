import React, { useState } from 'react';
import { Upload, Camera, DollarSign, Tag, MapPin, Package, CheckCircle, AlertCircle, X } from 'lucide-react';

const CreateListing = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: 'Good',
    campus: 'NFSU Delhi',
    images: [],
    tags: []
  });

  const categories = [
    'Textbooks', 'Furniture', 'Electronics', 'Clothing',
    'Study Materials', 'Sports Equipment', 'Other'
  ];

  const conditions = [
    { value: 'New', label: 'Brand New' },
    { value: 'Like New', label: 'Like New' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Other', label: 'Other' }
  ];

  const campuses = ['NFSU Delhi', 'NFSU Mumbai', 'NFSU Bangalore', 'NFSU Chennai'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Simulate image upload
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, submit to backend
    console.log('Submitting listing:', formData);
    alert('Listing created successfully!');
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      condition: 'Good',
      campus: 'NFSU Delhi',
      images: [],
      tags: []
    });
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Sell an Item</h1>
              <p className="text-white/90 text-xl">List your item for sale on campus marketplace</p>
            </div>
            <div className="hidden md:block">
              <Tag className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-8">
        {/* Progress Steps */}
        <div className="card p-6 mb-8 blue-glow">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= stepNum
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-24 h-1 mx-2 ${
                    step > stepNum ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-4 text-center">
            <div className={`font-medium ${step >= 1 ? 'text-primary' : 'text-gray-500'}`}>Basic Info</div>
            <div className={`font-medium ${step >= 2 ? 'text-primary' : 'text-gray-500'}`}>Details</div>
            <div className={`font-medium ${step >= 3 ? 'text-primary' : 'text-gray-500'}`}>Photos</div>
            <div className={`font-medium ${step >= 4 ? 'text-primary' : 'text-gray-500'}`}>Review</div>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-2">What are you selling?</h2>
                  <p className="text-gray-600">Start by telling us about your item</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Item Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Introduction to Algorithms Textbook"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {categories.map(category => (
                        <button
                          type="button"
                          key={category}
                          onClick={() => handleInputChange('category', category)}
                          className={`p-3 rounded-xl text-center transition-all ${
                            formData.category === category
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your item in detail. Include condition, features, and any flaws..."
                      rows={4}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary"
                    disabled={!formData.title || !formData.category || !formData.description}
                  >
                    Continue to Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-2">Item Details</h2>
                  <p className="text-gray-600">Add pricing and condition information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Condition *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="input-field"
                      required
                    >
                      {conditions.map(cond => (
                        <option key={cond.value} value={cond.value}>
                          {cond.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Campus Location *
                    </label>
                    <select
                      value={formData.campus}
                      onChange={(e) => handleInputChange('campus', e.target.value)}
                      className="input-field"
                      required
                    >
                      {campuses.map(campus => (
                        <option key={campus} value={campus}>{campus}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Tags (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Add tags separated by commas"
                      className="input-field"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const tag = e.target.value.trim();
                          if (tag) {
                            handleInputChange('tags', [...formData.tags, tag]);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleInputChange('tags', formData.tags.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-primary-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    disabled={!formData.price || !formData.condition || !formData.campus}
                  >
                    Continue to Photos
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-2">Add Photos</h2>
                  <p className="text-gray-600">Upload clear photos of your item. First photo will be the cover.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Image Upload Box */}
                  <label className="aspect-square border-2 border-dashed border-primary-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary-50 transition-colors">
                    <Camera className="w-8 h-8 text-primary mb-2" />
                    <span className="text-primary font-medium">Add Photos</span>
                    <span className="text-xs text-gray-500 mt-1">Up to 10 images</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {/* Uploaded Images */}
                  {formData.images.map((image) => (
                    <div key={image.id} className="relative aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {formData.images.indexOf(image) === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">Photo Tips</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use good lighting and take photos from multiple angles</li>
                        <li>• Show any flaws or damage clearly</li>
                        <li>• Include photos of accessories or original packaging</li>
                        <li>• Avoid blurry or dark photos</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn-primary"
                    disabled={formData.images.length === 0}
                  >
                    Review Listing
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-2">Review Your Listing</h2>
                  <p className="text-gray-600">Check everything before publishing</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Preview */}
                  <div className="lg:col-span-2">
                    <div className="card p-6">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 mb-4">
                        {formData.images[0] ? (
                          <img
                            src={formData.images[0].url}
                            alt={formData.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-primary-300" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-dark mb-2">{formData.title || 'Item Title'}</h3>
                      <p className="text-gray-600 mb-4">{formData.description || 'Item description will appear here'}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            ${formData.price || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formData.campus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Summary */}
                  <div className="space-y-6">
                    <div className="card p-6">
                      <h4 className="font-bold text-dark mb-4">Listing Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium text-dark">{formData.category || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-medium text-dark">{formData.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium text-dark">{formData.campus}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Photos</p>
                          <p className="font-medium text-dark">{formData.images.length} images</p>
                        </div>
                        {formData.tags.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500">Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 p-6 rounded-xl">
                      <div className="flex items-start gap-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-primary-800">Ready to Publish?</p>
                          <p className="text-sm text-primary-700 mt-1">Your listing will be visible to all campus members.</p>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn-primary w-full"
                      >
                        Publish Listing
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-secondary"
                  >
                    Back to Photos
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Publish Listing
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Clear Photos</h3>
                <p className="text-sm text-gray-600">Better photos = faster sales</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Fair Pricing</h3>
                <p className="text-sm text-gray-600">Research similar items first</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Quick Responses</h3>
                <p className="text-sm text-gray-600">Be ready to answer questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
