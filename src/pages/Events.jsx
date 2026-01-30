import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, MapPin, Users, Clock, Ticket, Share2,
  Search, Filter, ChevronRight, ChevronLeft, Heart,
  Camera, Trophy, Award, Star, Image as ImageIcon,
  Video, Music, BookOpen, Gamepad, Coffee, GraduationCap,
  X, XCircle, Sliders, CheckCircle, AlertCircle, ExternalLink,
  Download, Bookmark, BarChart, Tag, Zap, TrendingUp, Plus,
  Info, UserPlus, DollarSign, FileText, Users as UsersIcon,
  Shield, EyeOff, Mail, Phone, Building, Crown, Medal, UserCheck,
  ArrowRight, Shield as ShieldIcon, ChevronDown, ChevronUp,
  Users as Users2, Globe, Wifi, TrendingDown, Camera as CameraIcon,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import localDatabase from '../services/localDatabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import HorizontalGallery from '../components/HorizontalGallery';
import HorizontalImageScroller from '../components/HorizontalGallery';
const Events = () => {
  const { userData, userRole } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    type: 'all',
    campus: 'all',
    price: 'all',
    sortBy: 'upcoming'
  });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [likedEvents, setLikedEvents] = useState(new Set());
  const [showRegistrationModal, setShowRegistrationModal] = useState(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    specialRequirements: ''
  });
  const [createEventForm, setCreateEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00',
    endDate: '',
    endTime: '18:00',
    location: '',
    type: 'academic',
    category: 'tech',
    price: 0,
    maxParticipants: 100,
    organizer: '',
    contact: '',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    galleryImages: [], // ADD THIS - Array for multiple images
    tags: '',
    highlights: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Add this to your existing state declarations
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef(null);
  // Load events from database
  useEffect(() => {
    loadEvents();

    // Load user's registered events from localStorage or API
    const savedRegistrations = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    setRegisteredEvents(new Set(savedRegistrations));

    const savedLikes = JSON.parse(localStorage.getItem('likedEvents') || '[]');
    setLikedEvents(new Set(savedLikes));
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const dbEvents = await localDatabase.getEvents();
      setEvents(dbEvents);
      setFilteredEvents(dbEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can create events
  const canCreateEvents = userRole === 'admin' || userRole === 'event_society';

  // Check if user is event society or admin for panel access
  const canAccessEventSocietyPanel = userRole === 'admin' || userRole === 'event_society';

  // Categories with icons
  const categories = [
    { id: 'all', label: 'All Events', icon: <Calendar className="text-blue-600" size={20} />, count: events.length },
    { id: 'tech', label: 'Tech & Coding', icon: <BookOpen className="text-purple-600" size={20} />, count: events.filter(e => e.category === 'tech').length },
    { id: 'sports', label: 'Sports', icon: <Gamepad className="text-green-600" size={20} />, count: events.filter(e => e.category === 'sports').length },
    { id: 'business', label: 'Business', icon: <TrendingUp className="text-yellow-600" size={20} />, count: events.filter(e => e.category === 'business').length },
    { id: 'arts', label: 'Arts & Cultural', icon: <Music className="text-pink-600" size={20} />, count: events.filter(e => e.category === 'arts').length },
    { id: 'research', label: 'Research', icon: <GraduationCap className="text-indigo-600" size={20} />, count: events.filter(e => e.category === 'research').length },
    { id: 'music', label: 'Music', icon: <Music className="text-red-600" size={20} />, count: events.filter(e => e.category === 'music').length },
  ];

  // Event types
  const eventTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'academic', label: 'Academic', icon: '🎓' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' },
    { id: 'workshop', label: 'Workshop', icon: '🔧' },
    { id: 'social', label: 'Social', icon: '🎉' },
  ];

  // Campus options
  const campusOptions = [
    { id: 'all', label: 'All Campuses' },
    { id: 'main', label: 'Main Campus' },
    { id: 'north', label: 'North Campus' },
    { id: 'south', label: 'South Campus' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'upcoming', label: 'Upcoming First' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'registrations', label: 'Most Registrations' },
    { id: 'date', label: 'Date (Earliest)' },
  ];
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Filter function
  const applyFilters = () => {
    setLoading(true);

    let result = [...events];

    // Apply category filter
    if (activeFilters.category !== 'all') {
      result = result.filter(event => event.category === activeFilters.category);
    }

    // Apply type filter
    if (activeFilters.type !== 'all') {
      result = result.filter(event => event.type === activeFilters.type);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query))) ||
        event.organizer.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (activeFilters.sortBy === 'popular') {
      result.sort((a, b) => b.registeredCount - a.registeredCount);
    } else if (activeFilters.sortBy === 'registrations') {
      result.sort((a, b) => (b.registeredCount / b.maxParticipants) - (a.registeredCount / a.maxParticipants));
    } else if (activeFilters.sortBy === 'date') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (activeFilters.sortBy === 'upcoming') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setTimeout(() => {
      setFilteredEvents(result);
      setLoading(false);
    }, 300);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchQuery, events]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handleTypeChange = (typeId) => {
    setActiveFilters(prev => ({
      ...prev,
      type: typeId
    }));
  };

  const handleSortChange = (sortId) => {
    setActiveFilters(prev => ({
      ...prev,
      sortBy: sortId
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({
      category: 'all',
      type: 'all',
      campus: 'all',
      price: 'all',
      sortBy: 'upcoming'
    });
    setActiveCategory('all');
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category !== 'all') count++;
    if (activeFilters.type !== 'all') count++;
    if (activeFilters.sortBy !== 'upcoming') count++;
    return count;
  };
  // Auto-scroll effect - SMOOTHER VERSION
useEffect(() => {
  if (!isAutoPlaying || filteredEvents.length === 0) return;

  const interval = setInterval(() => {
    setCurrentSlide(prev => {
      const next = prev + 1;
      return next >= filteredEvents.length ? 0 : next;
    });
  }, 8000); // 8 seconds

  return () => clearInterval(interval);
}, [filteredEvents.length, isAutoPlaying]);

// Add smooth transition class based on current slide
useEffect(() => {
  if (scrollContainerRef.current && filteredEvents.length > 0) {
    const container = scrollContainerRef.current;
    const cardWidth = container.children[0]?.offsetWidth || 0;
    const gap = 24; // 24px gap between cards
    
    // Remove transition class for instant positioning
    container.classList.remove('smooth-scroll');
    
    // Set scroll position
    container.scrollLeft = currentSlide * (cardWidth + gap);
    
    // Add transition class back after a tiny delay
    setTimeout(() => {
      container.classList.add('smooth-scroll');
    }, 10);
  }
}, [currentSlide, filteredEvents.length]);

  // Scroll to current slide
  useEffect(() => {
    if (scrollContainerRef.current && filteredEvents.length > 0) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.offsetWidth || 0;
      container.scrollTo({
        left: currentSlide * (cardWidth + 24), // 24px for gap
        behavior: 'smooth'
      });
    }
  }, [currentSlide, filteredEvents.length]);
  // Event handlers
  const handleLike = (eventId) => {
    const newLikedEvents = new Set(likedEvents);
    if (newLikedEvents.has(eventId)) {
      newLikedEvents.delete(eventId);
      toast.success('Removed from saved events');
    } else {
      newLikedEvents.add(eventId);
      toast.success('Saved to your events');
    }
    setLikedEvents(newLikedEvents);
    localStorage.setItem('likedEvents', JSON.stringify([...newLikedEvents]));
  };
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showRegistrationModal || showEventDetailModal || showCreateEventModal) return;

      if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => prev > 0 ? prev - 1 : filteredEvents.length - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => prev < filteredEvents.length - 1 ? prev + 1 : 0);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredEvents.length, showRegistrationModal, showEventDetailModal, showCreateEventModal]);

  const handleRegisterClick = (eventId) => {
    if (!userData) {
      toast.error('Please login to register for events');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setSelectedEvent(event);

    // Pre-fill form with user data
    setRegistrationForm({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      department: userData.department || '',
      year: userData.year || '',
      specialRequirements: ''
    });

    // Close event detail modal if it's open
    if (showEventDetailModal) {
      setShowEventDetailModal(null);
      // Note: Don't remove modal-open class here because we're opening another modal
    }

    setShowRegistrationModal(eventId);
    document.body.classList.add('modal-open');
  };

  const handleRegistrationSubmit = async (eventId) => {
    if (!registrationForm.name || !registrationForm.email || !registrationForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsRegistering(true);

    try {
      const result = await localDatabase.registerForEvent(eventId, userData.id);

      if (result.success) {
        if (result.registered) {
          const newRegistrations = new Set(registeredEvents);
          newRegistrations.add(eventId);
          setRegisteredEvents(newRegistrations);
          localStorage.setItem('registeredEvents', JSON.stringify([...newRegistrations]));

          // Reload events to update registration count
          await loadEvents();

          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>Successfully registered for the event!</span>
            </div>,
            { duration: 4000 }
          );
        } else {
          toast.info(result.message || 'Already registered for this event');
        }

        setShowRegistrationModal(null);
        document.body.classList.remove('modal-open');
      } else {
        toast.error('Failed to register for event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event');
    } finally {
      setIsRegistering(false);
      setRegistrationForm({
        name: '',
        email: '',
        phone: '',
        department: '',
        year: '',
        specialRequirements: ''
      });
    }
  };
  const handleUnregisterFromEvent = async (eventId) => {
    if (!userData) {
      toast.error('Please login to manage registrations');
      return;
    }

    if (!window.confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    try {
      const result = await localDatabase.unregisterFromEvent(eventId, userData.id);

      if (result.success) {
        if (result.unregistered) {
          // Remove from registered events
          const newRegistrations = new Set(registeredEvents);
          newRegistrations.delete(eventId);
          setRegisteredEvents(newRegistrations);
          localStorage.setItem('registeredEvents', JSON.stringify([...newRegistrations]));

          // Reload events to update registration count
          await loadEvents();

          toast.success(
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>Successfully unregistered from the event</span>
            </div>,
            { duration: 4000 }
          );

          // Close the detail modal
          setShowEventDetailModal(null);
          document.body.classList.remove('modal-open');
        } else {
          toast.info(result.message || 'Not registered for this event');
        }
      } else {
        toast.error(result.error || 'Failed to unregister from event');
      }
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast.error('Failed to unregister from event');
    }
  };

  const handleShare = async (event) => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleViewAllClick = () => {
    // Reset filters to show all events
    handleResetFilters();
    toast.success('Showing all events');
  };

  const handleViewDetails = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetailModal(eventId);
      document.body.classList.add('modal-open');
    }
  };

  const handleCreateEvent = () => {
    if (!userData) {
      toast.error('Please login to create events');
      return;
    }

    if (!canCreateEvents) {
      toast.error('Only Event Society and Administrators can create events');
      return;
    }

    setCreateEventForm({
      title: '',
      description: '',
      date: '',
      time: '10:00',
      endDate: '',
      endTime: '18:00',
      location: '',
      type: 'academic',
      category: 'tech',
      price: 0,
      maxParticipants: 100,
      organizer: userData.name || '',
      contact: userData.email || '',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
      tags: '',
      highlights: ''
    });
    setShowCreateEventModal(true);
  };

  const handleCreateEventSubmit = async () => {
    if (!createEventForm.title || !createEventForm.description || !createEventForm.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingEvent(true);

    try {
      const eventData = {
        title: createEventForm.title,
        description: createEventForm.description,
        date: createEventForm.date,
        time: createEventForm.time,
        endDate: createEventForm.endDate || createEventForm.date,
        endTime: createEventForm.endTime,
        location: createEventForm.location,
        type: createEventForm.type,
        category: createEventForm.category,
        price: parseInt(createEventForm.price) || 0,
        maxParticipants: parseInt(createEventForm.maxParticipants) || 100,
        creatorId: userData.id,
        creatorName: userData.name || userData.email,
        creatorRole: userRole,
        organizer: createEventForm.organizer,
        contact: createEventForm.contact,
        image: createEventForm.image,
        tags: createEventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        highlights: createEventForm.highlights.split(',').map(h => h.trim()).filter(h => h)
      };

      const result = await localDatabase.createEvent(eventData);

      if (result.success) {
        if (result.status === 'pending') {
          toast.success('✅ Event submitted for admin approval! You\'ll be notified once it\'s live.');
        } else {
          toast.success('✅ Event created and published successfully!');
        }

        // Reload events
        await loadEvents();
        setShowCreateEventModal(false);
      } else {
        toast.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRemainingSpots = (event) => {
    const registeredCount = event.registeredUsers ? event.registeredUsers.length : 0;
    return Math.max(0, event.maxParticipants - registeredCount);
  };

  const getRegistrationProgress = (event) => {
    const registeredCount = event.registeredUsers ? event.registeredUsers.length : 0;
    return (registeredCount / event.maxParticipants) * 100;
  };

  const EventCard = ({ event }) => {
    const isRegistered = registeredEvents.has(event.id);
    const isLiked = likedEvents.has(event.id);
    const remainingSpots = getRemainingSpots(event);
    const progress = getRegistrationProgress(event);

    // Show status badge for pending events
    const showStatusBadge = event.status === 'pending';

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full max-w-2xl mx-auto w-full">
        {/* Event Image with Horizontal Scroller */}
        <div className="relative h-56 md:h-64 overflow-hidden">
          <HorizontalImageScroller
            images={[
              event.image,
              ...(event.galleryImages || []).filter(img => img && img.trim())
            ]}
            height="h-56 md:h-64"
          />

          {/* Like & Share Buttons (keep this part) */}
          <div className="absolute top-3 right-3 flex gap-1 z-10">
            <button
              onClick={() => handleLike(event.id)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
            <button
              onClick={() => handleShare(event)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Previous Year Winner Badge */}
          {event.previousYear && event.previousYear.winners && event.previousYear.winners.length > 0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-2 text-center max-w-[120px]">
                <Trophy size={14} className="mx-auto mb-1" />
                <div className="text-xs font-bold">
                  {event.previousYear.winners[0].name || 'Previous Winner'}
                </div>
                {event.previousYear.winners[0].position === 1 && (
                  <div className="text-[10px] opacity-90">🥇 Champion</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Event Content - Optimized for horizontal */}
        <div className="p-5 md:p-6">
          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{event.title}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Registration Progress - Only show for approved events */}
          {event.status === 'approved' && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>{event.registeredUsers ? event.registeredUsers.length : 0} registered</span>
                  <span>{remainingSpots} spots left</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mb-2">
                    <Zap size={14} className="text-yellow-500" />
                    <span>Highlights</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {event.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        • {highlight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {event.status === 'pending' ? (
              <button
                className="flex-1 bg-yellow-100 text-yellow-800 font-semibold py-2.5 px-4 rounded-xl text-sm shadow-md"
                disabled
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} />
                  Awaiting Approval
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isRegistered) {
                    handleUnregisterFromEvent(event.id);
                  } else {
                    handleRegisterClick(event.id);
                  }
                }}
                className={`flex-1 font-semibold py-2.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 ${isRegistered
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {isRegistered ? (
                    <>
                      <X size={16} />
                      Unregister
                    </>
                  ) : (
                    <>
                      <Ticket size={16} />
                      Register Now
                    </>
                  )}
                </div>
              </button>
            )}
            <button
              onClick={() => handleViewDetails(event.id)}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm flex items-center gap-2"
            >
              <Info size={16} />
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden mb-8">
        <div className="relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-yellow-300" size={24} />
                <span className="text-yellow-200 font-medium">NFSU Campus Events</span>
              </div>

              {/* Event Society Panel Button - Only for Event Society and Admin */}
              {canAccessEventSocietyPanel && (
                <button
                  onClick={() => navigate('/event-society')}
                  className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                  <ShieldIcon size={18} />
                  Event Society Panel
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Join Amazing Campus Events</h1>
            <p className="text-lg text-blue-100 mb-6">
              Discover exciting events, workshops, and competitions happening across NFSU campuses.
              Network, learn, and create unforgettable memories!
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search events, workshops, competitions..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin/Event Society Notice */}
      {userRole === 'admin' && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-yellow-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Admin Controls Active</h4>
                <p className="text-sm text-gray-600">Your events are published immediately without approval.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/event-society')}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <ShieldIcon size={18} />
              Event Panel
            </button>
          </div>
        </div>
      )}

      {userRole === 'event_society' && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UsersIcon className="text-blue-600" size={24} />
              <div>
                <h4 className="font-semibold text-gray-900">Event Society Mode</h4>
                <p className="text-sm text-gray-600">Your events require admin approval before being published.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/event-society')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Users2 size={18} />
              Event Society Panel
            </button>
          </div>
        </div>
      )}

      {/* Student Notice - Cannot create events */}


      {/* Event Society Panel Mobile Button - For mobile view */}
      {canAccessEventSocietyPanel && (
        <div className="md:hidden mb-6">
          <button
            onClick={() => navigate('/event-society')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <ShieldIcon size={20} />
            Event Society Panel
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Event Categories Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Browse Events</h2>
          <button
            onClick={handleResetFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Reset Filters
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.icon}
              <span>{category.label}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="relative px-2 md:px-4"> {/* Added padding for arrows */}
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={(e) => {
              setIsAutoPlaying(false);
              setTouchStart(e.touches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.touches[0].clientX);
            }}
            onTouchEnd={() => {
              if (touchStart && touchEnd) {
                const distance = touchStart - touchEnd;
                const minSwipeDistance = 50;

                if (distance > minSwipeDistance) {
                  // Swipe left
                  setCurrentSlide(prev => prev < filteredEvents.length - 1 ? prev + 1 : 0);
                } else if (distance < -minSwipeDistance) {
                  // Swipe right
                  setCurrentSlide(prev => prev > 0 ? prev - 1 : filteredEvents.length - 1);
                }
              }

              setTouchStart(null);
              setTouchEnd(null);
              setTimeout(() => setIsAutoPlaying(true), 3000);
            }}
          >
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className={`flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[50vw] xl:w-[40vw] snap-center px-2 transition-all duration-500 ${currentSlide === filteredEvents.findIndex(e => e.id === event.id)
                  ? 'scale-[1.02]'
                  : 'opacity-90 hover:opacity-100'
                  }`}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
          {/* Auto-play Controls */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              aria-label={isAutoPlaying ? 'Pause auto-scroll' : 'Play auto-scroll'}
            >
              {isAutoPlaying ? (
                <>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-2 h-5 border-l-2 border-r-2 border-gray-700"></div>
                  </div>
                  <span className="text-sm font-medium">Pause Auto-scroll</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-r-0 border-transparent border-l-gray-700 ml-1"></div>
                  </div>
                  <span className="text-sm font-medium">Play Auto-scroll</span>
                </>
              )}
            </button>

            <span className="text-sm text-gray-500">

            </span>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {filteredEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-blue-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
          {/* Navigation Arrows */}
          {filteredEvents.length > 1 && (
            <div className="hidden md:flex justify-between items-center absolute left-0 right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <button
                onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : filteredEvents.length - 1)}
                className="pointer-events-auto p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                aria-label="Previous event"
              >
                <ChevronLeft size={24} className="text-gray-700" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => prev < filteredEvents.length - 1 ? prev + 1 : 0)}
                className="pointer-events-auto p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                aria-label="Next event"
              >
                <ChevronRight size={24} className="text-gray-700" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Try different search terms' : 'No events available at the moment'}
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center modal-overlay overflow-y-auto py-8">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Register for Event</h2>
              <button
                onClick={() => setShowRegistrationModal(null)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{formatFullDate(selectedEvent.date)}</span>
                  <span>•</span>
                  <Clock size={14} />
                  <span>{formatTime(selectedEvent.time)}</span>
                  <span>•</span>
                  <MapPin size={14} />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleRegistrationSubmit(selectedEvent.id);
              }}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                        placeholder="your.email@nfsu.ac.in"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select
                        value={registrationForm.department}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, department: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select Department</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="CE">Civil</option>
                        <option value="BBA">Business</option>
                        <option value="LAW">Law</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={registrationForm.year}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, year: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      >
                        <option value="">Select Year</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                        <option value="PG">Post Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements</label>
                    <textarea
                      value={registrationForm.specialRequirements}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, specialRequirements: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      rows="2"
                      placeholder="Any dietary restrictions, accessibility needs, or other requirements..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isRegistering ? 'Registering...' : 'Complete Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showEventDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center modal-overlay overflow-y-auto py-8">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
              <button
                onClick={() => {
                  setShowEventDetailModal(null);
                  document.body.classList.remove('modal-open');
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Event Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="lg:w-2/3">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedEvent.title}</h1>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
                        <Calendar size={14} />
                        <span className="text-sm font-medium">{formatFullDate(selectedEvent.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full">
                        <Clock size={14} />
                        <span className="text-sm font-medium">{formatTime(selectedEvent.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full">
                        <MapPin size={14} />
                        <span className="text-sm font-medium">{selectedEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full">
                        <DollarSign size={14} />
                        <span className="text-sm font-medium">{selectedEvent.price === 0 ? 'FREE' : `₹${selectedEvent.price}`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5">
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-900">{selectedEvent.registeredUsers ? selectedEvent.registeredUsers.length : 0}</div>
                        <div className="text-sm text-gray-600">Registered Participants</div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Remaining Spots</span>
                          <span>{getRemainingSpots(selectedEvent)} / {selectedEvent.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(getRegistrationProgress(selectedEvent), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      {selectedEvent.status === 'approved' && (
                        <button
                          onClick={() => {
                            if (registeredEvents.has(selectedEvent.id)) {
                              handleUnregisterFromEvent(selectedEvent.id);
                            } else {
                              setShowEventDetailModal(null);
                              handleRegisterClick(selectedEvent.id);
                            }
                          }}
                          className={`w-full py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${registeredEvents.has(selectedEvent.id)
                            ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                            }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {registeredEvents.has(selectedEvent.id) ? (
                              <>
                                <X size={18} />
                                Unregister from Event
                              </>
                            ) : (
                              <>
                                <Ticket size={18} />
                                Register Now
                              </>
                            )}
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Image Gallery with Horizontal Gallery */}
              <div className="mb-8">
                {/* Main Event Image */}
                <div className="mb-6">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                  />
                </div>

                {/* Combined Gallery (Main + Gallery Images) */}
                {selectedEvent.galleryImages && selectedEvent.galleryImages.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CameraIcon className="text-blue-600" size={20} />
                      Event Gallery
                    </h3>

                    {/* Import and use HorizontalGallery */}
                    <HorizontalGallery
                      images={[selectedEvent.image, ...selectedEvent.galleryImages.filter(img => img && img.trim())]}
                      title="All Event Images"
                    />

                    <p className="text-sm text-gray-600 mt-3">
                      Scroll horizontally to view all images. Click on any image to view fullscreen.
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About This Event</h3>
                <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Highlights */}
              {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Event Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvent.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <Zap size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Year Winners Section */}
              {selectedEvent.previousYear && selectedEvent.previousYear.winners && selectedEvent.previousYear.winners.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="text-yellow-500" size={20} />
                      Previous Year Winners ({selectedEvent.previousYear.year || 'Last Year'})
                    </h3>
                    {selectedEvent.previousYear.prizeMoney > 0 && (
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-yellow-600" />
                          <span className="font-bold text-yellow-800">Prize Pool: ₹{selectedEvent.previousYear.prizeMoney}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Winners List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {selectedEvent.previousYear.winners.map((winner, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                            {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{winner.name}</div>
                            <div className="text-sm text-gray-600">{winner.team || winner.event || winner.project || 'Participant'}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <div className="font-medium text-gray-900">Prize: {winner.prize}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gallery Images */}
                  {selectedEvent.previousYear.galleryImages && selectedEvent.previousYear.galleryImages.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <CameraIcon className="text-blue-600" size={18} />
                        Event Gallery
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedEvent.previousYear.galleryImages.slice(0, 6).map((img, index) => (
                          <div key={index} className="aspect-square rounded-xl overflow-hidden">
                            <img
                              src={img}
                              alt={`Event gallery ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Event Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium text-gray-900">{selectedEvent.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">{selectedEvent.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Participants</span>
                      <span className="font-medium text-gray-900">{selectedEvent.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Organizer</span>
                      <span className="font-medium text-gray-900">{selectedEvent.organizer}</span>
                    </div>
                    {selectedEvent.contact && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact</span>
                        <span className="font-medium text-gray-900">{selectedEvent.contact}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Tag size={18} className="text-purple-600" />
                      Event Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {selectedEvent.status === 'approved' && (
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        if (registeredEvents.has(selectedEvent.id)) {
                          handleUnregisterFromEvent(selectedEvent.id);
                        } else {
                          setShowEventDetailModal(null);
                          handleRegisterClick(selectedEvent.id);
                        }
                      }}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-center ${registeredEvents.has(selectedEvent.id)
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                    >
                      {registeredEvents.has(selectedEvent.id) ? 'Unregister' : 'Register Now'}
                    </button>
                    <button
                      onClick={() => handleShare(selectedEvent)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                      Share Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button
                onClick={() => {
                  setShowCreateEventModal(false);
                  document.body.classList.remove('modal-open');
                }}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateEventSubmit();
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                    <input
                      type="text"
                      value={createEventForm.title}
                      onChange={(e) => setCreateEventForm({ ...createEventForm, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={createEventForm.description}
                      onChange={(e) => setCreateEventForm({ ...createEventForm, description: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Describe your event"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        value={createEventForm.date}
                        onChange={(e) => setCreateEventForm({ ...createEventForm, date: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={createEventForm.time}
                        onChange={(e) => setCreateEventForm({ ...createEventForm, time: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={createEventForm.location}
                      onChange={(e) => setCreateEventForm({ ...createEventForm, location: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      placeholder="e.g., Main Auditorium"
                      required
                    />
                  </div>
                  {/* Image Upload Section - Updated for Multiple Images */}
                  <div className="space-y-4">
                    {/* Main Event Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Event Image *</label>
                      <div className="flex gap-3 mb-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCreateEventForm({ ...createEventForm, image: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex-1 p-3 border border-gray-300 rounded-xl"
                        />
                        {createEventForm.image && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-300">
                            <img
                              src={createEventForm.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={createEventForm.image}
                        onChange={(e) => setCreateEventForm({ ...createEventForm, image: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl"
                        placeholder="Or paste main image URL here"
                      />
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Additional Gallery Images</label>
                        <span className="text-xs text-gray-500">Optional - Add up to 5 images</span>
                      </div>

                      <div className="space-y-3 mb-3">
                        {createEventForm.galleryImages.map((imageUrl, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newGalleryImages = [...createEventForm.galleryImages];
                                    newGalleryImages[index] = reader.result;
                                    setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-xl"
                            />
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) => {
                                const newGalleryImages = [...createEventForm.galleryImages];
                                newGalleryImages[index] = e.target.value;
                                setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-xl"
                              placeholder={`Gallery image ${index + 1} URL`}
                            />
                            {imageUrl && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                <img
                                  src={imageUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop';
                                  }}
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newGalleryImages = createEventForm.galleryImages.filter((_, i) => i !== index);
                                setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (createEventForm.galleryImages.length < 5) {
                            setCreateEventForm(prev => ({
                              ...prev,
                              galleryImages: [...prev.galleryImages, '']
                            }));
                          } else {
                            toast.error('Maximum 5 gallery images allowed');
                          }
                        }}
                        className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        + Add Gallery Image ({createEventForm.galleryImages.length}/5)
                      </button>

                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Use high-quality images from unsplash.com (e.g., https://images.unsplash.com/photo-xxx)
                      </p>
                    </div>
                  </div>
                  {/* Gallery Images Section - MULTIPLE IMAGES */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                      <span className="text-xs text-gray-500">Optional - Add multiple images</span>
                    </div>

                    {/* Main Image Upload */}
                    <div className="mb-4">
                      <label className="block text-xs text-gray-600 mb-1">Main Event Image *</label>
                      <div className="flex gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCreateEventForm({ ...createEventForm, image: reader.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex-1 p-3 border border-gray-300 rounded-xl"
                        />
                        {createEventForm.image && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-300">
                            <img
                              src={createEventForm.image}
                              alt="Main preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={createEventForm.image}
                        onChange={(e) => setCreateEventForm({ ...createEventForm, image: e.target.value })}
                        className="w-full mt-2 p-3 border border-gray-300 rounded-xl"
                        placeholder="Or paste main image URL here"
                      />
                    </div>

                    {/* Gallery Images Upload */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Additional Gallery Images</label>
                      <div className="space-y-3">
                        {createEventForm.galleryImages.map((imageUrl, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    const newGalleryImages = [...createEventForm.galleryImages];
                                    newGalleryImages[index] = reader.result;
                                    setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-xl"
                            />
                            <input
                              type="text"
                              value={imageUrl}
                              onChange={(e) => {
                                const newGalleryImages = [...createEventForm.galleryImages];
                                newGalleryImages[index] = e.target.value;
                                setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                              }}
                              className="flex-1 p-3 border border-gray-300 rounded-xl"
                              placeholder={`Gallery image ${index + 1} URL (optional)`}
                            />
                            {imageUrl && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                <img
                                  src={imageUrl}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop';
                                  }}
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newGalleryImages = [...createEventForm.galleryImages];
                                newGalleryImages.splice(index, 1);
                                setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCreateEventForm(prev => ({
                          ...prev,
                          galleryImages: [...prev.galleryImages, '']
                        }))}
                        className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        + Add Another Image
                      </button>

                      <p className="text-xs text-gray-500 mt-2">
                        Tip: Upload up to 5 images to showcase your event. Main image is required.
                      </p>
                    </div>
                  </div>
                  {/* Highlights Field - ADD THIS */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Highlights</label>
                    <textarea
                      value={createEventForm.highlights}
                      onChange={(e) => setCreateEventForm({ ...createEventForm, highlights: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      rows="2"
                      placeholder="Enter highlights separated by commas (e.g., Prize Pool ₹50,000, Free Food, Certificate)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple highlights with commas</p>
                  </div>
                  {/* Role-based approval notice */}
                  {userRole === 'event_society' ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-yellow-600" size={18} />
                        <span className="font-medium text-yellow-800">Admin Approval Required</span>
                      </div>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <div>• Your event will be reviewed by campus administration</div>
                        <div>• Approval usually takes 24-48 hours</div>
                        <div>• You'll be notified once approved</div>
                      </div>
                    </div>
                  ) : userRole === 'admin' ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-600" size={18} />
                        <span className="font-medium text-green-800">Admin Privilege: Immediate Publication</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>• Your event will be published immediately</div>
                        <div>• No approval queue for admin events</div>
                        <div>• Use responsibly for official campus events</div>
                      </div>
                    </div>
                  ) : null}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isCreatingEvent}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isCreatingEvent ? 'Creating Event...' :
                      userRole === 'admin' ? 'Publish Event' : 'Submit for Approval'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Button (Admin & Event Society only) */}
      {canCreateEvents && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-110 flex items-center justify-center"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
