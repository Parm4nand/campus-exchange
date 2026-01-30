import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, Shield, CheckCircle,
  Calendar, Package, Heart, Share2, MessageCircle, Phone,
  Image as ImageIcon, ChevronLeft, ChevronRight, X,
  Book, Laptop, User, CreditCard, Clock, Award,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import localDatabase from '../services/localDatabase';
// Sample detailed items data with seller IDs
const detailedItems = [
  {
    id: '1',
    title: 'Introduction to Algorithms (CLRS) - 4th Edition',
    description: 'Brand new MIT Press textbook. The comprehensive guide to algorithms used by computer science students worldwide.',
    price: 2499,
    originalPrice: 3499,
    category: 'books',
    campus: 'School of Cyber Security & Digital Forensics',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 127,
    sellerId: '2', // Admin user ID
    seller: 'CS Department',
    condition: 'New',
    quantity: 5,

    tags: ['Textbook', 'DSA', 'Computer Science'],
    views: 245,
    sold: 12,
    specifications: {
      author: 'Thomas H. Cormen',
      publisher: 'MIT Press',
      edition: '4th'
    }
  },
  {
    id: '2',
    title: 'Apple MacBook Air M1 2020 (8GB/256GB)',
    description: 'Lightly used MacBook Air with Apple M1 chip. Perfect for coding, design, and studies.',
    price: 54999,
    originalPrice: 79999,

    category: 'electronics',
    campus: 'School of Engineering & Technology',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 89,
    sellerId: '3', // Faculty user ID
    seller: 'TechGrad Student',
    condition: 'Excellent',
    quantity: 1,

    tags: ['Laptop', 'Apple', 'Student'],
    views: 567,
    sold: 0,
    specifications: {
      processor: 'Apple M1',
      ram: '8GB',
      storage: '256GB SSD'
    }
  },
  {
    id: '3',
    title: 'Ergonomic Study Desk with LED & Storage',
    description: 'Modern study desk with built-in shelves, drawers, and LED lighting. Perfect for dorm rooms.',
    price: 4599,
    originalPrice: 6999,
    category: 'furniture',
    campus: 'School of Police Science and Security Studies',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 45,
    sellerId: '1', // Student user ID
    seller: 'Campus Living',
    condition: 'Good',
    quantity: 2,

    tags: ['Furniture', 'Desk', 'Dorm'],
    views: 123,
    sold: 3,
    specifications: {
      material: 'Engineered Wood',
      dimensions: '120x60x75 cm'
    }
  },
  {
    id: '4',
    title: 'Sony WH-1000XM4 Wireless Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life. Perfect for study sessions.',
    price: 18999,
    originalPrice: 24999,
    category: 'electronics',
    campus: 'School of Management Studies',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 67,
    sellerId: '2', // Admin user ID
    seller: 'Audio Enthusiast',
    condition: 'Like New',
    quantity: 1,

    tags: ['Headphones', 'Wireless', 'Noise Cancelling'],
    views: 189,
    sold: 0,
    specifications: {
      battery: '30 hours',
      features: 'Noise Cancelling'
    }
  },
  {
    id: '5',
    title: 'Calculus & Linear Algebra Complete Notes',
    description: 'Comprehensive handwritten notes by topper student (CGPA 9.8). Digital PDF also available.',
    price: 499,
    originalPrice: 999,
    category: 'notes',
    campus: 'School of Doctoral Studies & Research',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 213,
    sellerId: '3', // Faculty user ID
    seller: 'Academic Excellence',
    condition: 'New',
    quantity: 10,

    tags: ['Notes', 'Engineering', 'Math'],
    views: 456,
    sold: 45,
    specifications: {
      pages: '120 pages',
      format: 'Handwritten + PDF'
    }
  },
  {
    id: '6',
    title: 'Casio Scientific Calculator fx-991EX',
    description: 'Brand new scientific calculator with 552 functions. Essential for engineering students.',
    price: 1499,
    originalPrice: 1999,
    category: 'electronics',
    campus: 'School of Forensic Science',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 156,
    sellerId: '1', // Student user ID
    seller: 'Calculator Store',
    condition: 'New',
    quantity: 8,

    tags: ['Calculator', 'Scientific', 'Engineering'],
    views: 321,
    sold: 23,
    specifications: {
      functions: '552 functions',
      display: '4-line display'
    }
  },
  {
    id: '7',
    title: 'Gaming PC Setup (Ryzen 5/RTX 3060/16GB)',
    description: 'Powerful gaming PC perfect for gaming and development work. Includes monitor and peripherals.',
    price: 64999,
    originalPrice: 89999,
    category: 'electronics',
    campus: 'School of Pharmacy',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 34,
    sellerId: '2', // Admin user ID
    seller: 'Gaming Club',
    condition: 'Very Good',
    quantity: 1,

    tags: ['Gaming PC', 'Computer', 'RTX 3060'],
    views: 432,
    sold: 0,
    specifications: {
      cpu: 'Ryzen 5 5600X',
      gpu: 'RTX 3060 12GB'
    }
  },
  {
    id: '8',
    title: 'Python & Data Science Complete Bundle',
    description: 'Complete set of textbooks for Python programming and Data Science. 3 books in excellent condition.',
    price: 2999,
    originalPrice: 4999,
    category: 'books',
    campus: 'School of Cyber Security & Digital Forensics',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 78,
    sellerId: '3', // Faculty user ID
    seller: 'Book Worm',
    condition: 'Excellent',
    quantity: 3,

    tags: ['Python', 'Data Science', 'Programming'],
    views: 198,
    sold: 7,
    specifications: {
      books: '3 Book Set',
      condition: 'Like New'
    }
  },
  {
    id: '9',
    title: 'Nike Air Force 1 Shoes (Size 9)',
    description: 'Classic white Nike Air Force 1 shoes. Worn only a few times, in perfect condition.',
    price: 3999,
    originalPrice: 5999,
    category: 'fashion',
    campus: 'School of Open Learning',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop',
    rating: 4.5,
    reviews: 42,
    sellerId: '1', // Student user ID
    seller: 'Fashion Student',
    condition: 'Like New',
    quantity: 1,

    tags: ['Shoes', 'Nike', 'Fashion'],
    views: 156,
    sold: 0,
    specifications: {
      size: '9',
      color: 'White'
    }
  },
  {
    id: '10',
    title: 'Basketball - Official Size 7',
    description: 'Professional basketball, used for college tournaments. Good condition with proper grip.',
    price: 899,
    originalPrice: 1499,
    category: 'sports',
    campus: 'School of Engineering & Technology',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    rating: 4.4,
    reviews: 23,
    sellerId: '2', // Admin user ID
    seller: 'Student',
    condition: 'Good',
    quantity: 2,

    tags: ['Basketball', 'Sports', 'Equipment'],
    views: 89,
    sold: 1,
    specifications: {
      size: 'Official Size 7',
      material: 'Leather'
    }
  }
];
const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [actionType, setActionType] = useState(''); // 'contact' or 'buy'



  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        // Try to get from database first
        const dbItem = await localDatabase.getItem(id);

        if (dbItem) {
          setItem(dbItem);
        } else {
          // Fallback to local items array
          const foundItem = detailedItems.find(item => item.id === id);
          setItem(foundItem || null);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        // Fallback to local items array
        const foundItem = detailedItems.find(item => item.id === id);
        setItem(foundItem || null);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="h-24 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const handleContactSeller = () => {
    if (!userData) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }
    setActionType('contact');
    setShowChatOptions(true);
  };



  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div
            className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
            onClick={() => setShowImageModal(true)}
          >
            <img
              src={item.images ? item.images[selectedImage] : item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
                toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Heart size={22} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {item.images ? (
              item.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${item.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))
            ) : (
              <button
                onClick={() => setSelectedImage(0)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === 0 ? 'border-blue-500' : 'border-gray-200'
                  }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            )}
          </div>

          {/* Image Modal */}
          {showImageModal && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 z-10"
                >
                  <X size={24} className="text-white" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : item.images.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={() => setSelectedImage(prev => prev < item.images.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
                <img
                  src={item.images ? item.images[selectedImage] : item.image}
                  alt={item.title}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Category & Condition */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {item.category.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${item.condition === 'New' ? 'bg-green-100 text-green-700' :
              item.condition === 'Excellent' ? 'bg-blue-100 text-blue-700' :
                item.condition === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
              }`}>
              {item.condition}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              {item.campus} Campus
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg">
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold ml-2">{item.rating}</span>
              <span className="text-gray-600 ml-1">({item.reviews} reviews)</span>
            </div>
            <div className="text-gray-600">
              <Eye size={18} className="inline mr-1" />
              {item.views} views
            </div>
            <div className="text-gray-600">
              <Package size={18} className="inline mr-1" />
              {item.sold} sold
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 mb-3">{item.description}</p>
            <p className="text-gray-600">{item.detailedDescription}</p>
          </div>

          {/* Highlights */}
          {item.highlights && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Highlights</h3>
              <ul className="space-y-2">
                {item.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(item.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {typeof item.seller === 'object' ? item.seller.name : item.seller}
                  </span>
                  <Shield size={16} className="text-green-500" />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  NFSU Student • Active Seller
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-lg font-bold text-blue-600">Usually replies in 1-2 hours</div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl">
                <div className="text-lg font-bold text-green-600">Campus Verified</div>
                <div className="text-xs text-gray-600">Student Account</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:relative lg:shadow-none lg:border-0 lg:mt-8">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Price Section */}
            <div className="flex-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-blue-600">₹{item.price.toLocaleString()}</span>
                {item.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                )}
                {item.discount > 0 && (
                  <span className="text-sm font-bold text-red-600">Save {item.discount}%</span>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {item.quantity} available • Campus Meetup Only
              </div>
              {/* Return Policy */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Return Policy</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">{item.returnPolicy}</p>
                      <p className="text-yellow-700 text-sm mt-1">Contact seller within 24 hours if there are issues</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={handleContactSeller}
                className="flex-1 lg:flex-none lg:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={20} className="inline mr-2" />
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Options Modal */}
      {showChatOptions && item && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {actionType === 'buy' ? 'Complete Purchase' : 'Contact Seller'}
                </h2>
                <button
                  onClick={() => {
                    navigate(`/chat?sellerId=${item.sellerId}&itemId=${item.id}&purpose=negotiate`);
                    setShowChatOptions(false);
                    setActionType('');
                  }}

                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">Price: ₹{item.price.toLocaleString()}</p>
                </div>
              </div>

              {actionType === 'buy' ? (
                <div className="space-y-3 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Discuss Purchase</h4>
                    <p className="text-green-700 text-sm">
                      Contact the seller to discuss price, condition, and arrange meetup for the item.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.seller.id}&itemId=${item.id}&purpose=negotiate`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">₹</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Negotiate Price</div>
                        <div className="text-sm text-gray-600">Discuss price and make an offer</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.sellerId}&itemId=${item.id}&purpose=questions`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">?</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Ask Questions</div>
                        <div className="text-sm text-gray-600">Get more details about the item</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.sellerId}&itemId=${item.id}&purpose=meet`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Arrange Meetup</div>
                        <div className="text-sm text-gray-600">Discuss pickup location & time</div>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700 font-medium">How would you like to contact the seller?</p>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.sellerId}&itemId=${item.id}&purpose=questions`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">?</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Ask Questions</div>
                        <div className="text-sm text-gray-600">Get more details about the item</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.seller.id}&itemId=${item.id}&purpose=negotiate`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">₹</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Negotiate Price</div>
                        <div className="text-sm text-gray-600">Make an offer or ask for discount</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate(`/chat?sellerId=${item.sellerId}&itemId=${item.id}&purpose=meet`);
                      setShowChatOptions(false);
                      setActionType('');
                    }}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Arrange Meetup</div>
                        <div className="text-sm text-gray-600">Discuss pickup location & time</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowChatOptions(false);
                    setActionType('');
                  }}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
