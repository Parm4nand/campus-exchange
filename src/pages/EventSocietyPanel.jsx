import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Clock, MapPin, DollarSign,
  Edit, Trash2, Eye, BarChart2, TrendingUp,
  Trophy, Award, Camera, Upload, CheckCircle,
  XCircle, AlertCircle, ChevronDown, ChevronUp,
  Search, Filter, Download, Share2, UserPlus,
  Mail, Phone, GraduationCap, Building, Tag,
  Plus, X, ArrowLeft, Shield, Users as UsersIcon,
  Package, MessageSquare, Bell, Settings, LogOut,
  BarChart, PieChart, LineChart, Target, Star,
  Heart, Bookmark, ExternalLink, Copy, QrCode,
  Image as ImageIcon, Video, Music, Gamepad,
  Coffee, BookOpen, Laptop, Smartphone, Headphones,
  Watch, Camera as CameraIcon, Speaker, Keyboard,
  Mouse, Router, Server, Database, Cpu, Terminal,
  Wifi, Bluetooth, Battery, Power, Sun, Moon,
  Cloud, CloudRain, CloudSnow, CloudLightning,
  Wind, Thermometer, Droplets, Umbrella, Trees,
  Mountain, Waves, Volcano, Tornado, Hurricane,
  Snowflake, Fire, Droplet, Leaf, Sprout,
  Flower, TreePine, TreeDeciduous, Bug, Fish,
  Bird, Rabbit, Cat, Dog, Whale, Turtle,
  Crown, Medal, Flag, Zap, Sparkles, Rocket,
  Target as TargetIcon, TrendingDown, RefreshCw,
  Lock, Unlock, Key, Shield as ShieldIcon,
  AlertTriangle, Info, HelpCircle, ThumbsUp,
  ThumbsDown, MessageCircle, PhoneCall, Video as VideoIcon,
  Mail as MailIcon, Send, Paperclip, Smile,
  Frown, Meh, Laugh, Angry, Heart as HeartIcon,
  Star as StarIcon, Bookmark as BookmarkIcon,
  Bell as BellIcon, Settings as SettingsIcon,
  User as UserIcon, UserCheck, UserX, UserPlus as UserPlusIcon,
  Users as Users2, UserMinus, Loader2
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import localDatabase from '../services/localDatabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EventSocietyPanel = () => {
  const { userData, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    approvedEvents: 0,
    pendingEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
    pastEvents: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetail, setShowEventDetail] = useState(null);
  const [showUpdateWinners, setShowUpdateWinners] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [winnersForm, setWinnersForm] = useState({
    winners: [{ position: 1, name: '', prize: '' }],
    prizeMoney: 0,
    galleryImages: ['', '', ''], // Should already be there
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
    galleryImages: ['', '', ''],
    tags: '',
    highlights: ''
  });
  const [isUpdatingWinners, setIsUpdatingWinners] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Check if user is event society OR admin (FIXED: Allow admins too)
  useEffect(() => {
    if (userRole !== 'event_society' && userRole !== 'admin') {
      toast.error('Access denied. Event Society or Admin members only.');
      navigate('/events');
      return;
    }
    loadEvents();
  }, [userRole, navigate]);

  const loadEvents = async () => {
    try {
      setLoading(true);

      // If admin, get all events. If event_society, get only their events
      let societyEvents;
      if (userRole === 'admin') {
        // Admin can see all events
        societyEvents = await localDatabase.getEvents({ showAll: true });
      } else {
        // Event Society can only see their own events
        societyEvents = await localDatabase.getEventsBySociety(userData.id);
      }

      const allEvents = await localDatabase.getEvents({ showAll: true });

      setEvents(societyEvents);

      // Calculate stats
      const now = new Date();
      const approvedEvents = societyEvents.filter(e => e.status === 'approved');
      const pendingEvents = societyEvents.filter(e => e.status === 'pending');
      const upcomingEvents = societyEvents.filter(e => new Date(e.date) > now);
      const pastEvents = societyEvents.filter(e => new Date(e.date) <= now);

      const totalRegistrations = societyEvents.reduce((sum, event) =>
        sum + (event.registeredCount || 0), 0
      );

      setStats({
        totalEvents: societyEvents.length,
        approvedEvents: approvedEvents.length,
        pendingEvents: pendingEvents.length,
        totalRegistrations,
        upcomingEvents: upcomingEvents.length,
        pastEvents: pastEvents.length
      });
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewEvent = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setShowEventDetail(event);
    }
  };

  const handleUpdateWinners = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setWinnersForm({
        winners: event.winners && event.winners.length > 0 ? event.winners : [{ position: 1, name: '', prize: '' }],
        prizeMoney: event.previousYear?.prizeMoney || 0,
        galleryImages: event.galleryImages && event.galleryImages.length > 0 ? event.galleryImages : ['']
      });
      setShowUpdateWinners(eventId);
    }
  };

  const handleAddWinner = () => {
    setWinnersForm(prev => ({
      ...prev,
      winners: [...prev.winners, { position: prev.winners.length + 1, name: '', prize: '' }]
    }));
  };

  const handleRemoveWinner = (index) => {
    if (winnersForm.winners.length > 1) {
      setWinnersForm(prev => ({
        ...prev,
        winners: prev.winners.filter((_, i) => i !== index)
      }));
    }
  };

  const handleWinnerChange = (index, field, value) => {
    const newWinners = [...winnersForm.winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinnersForm(prev => ({ ...prev, winners: newWinners }));
  };

  const handleAddGalleryImage = () => {
    setWinnersForm(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, '']
    }));
  };

  const handleGalleryImageChange = (index, value) => {
    const newImages = [...winnersForm.galleryImages];
    newImages[index] = value;
    setWinnersForm(prev => ({ ...prev, galleryImages: newImages }));
  };

  const handleRemoveGalleryImage = (index) => {
    if (winnersForm.galleryImages.length > 1) {
      setWinnersForm(prev => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmitWinners = async () => {
    if (!selectedEvent) return;

    // Validate winners
    const validWinners = winnersForm.winners.filter(w => w.name.trim() && w.prize.trim());
    if (validWinners.length === 0) {
      toast.error('Please add at least one winner');
      return;
    }

    setIsUpdatingWinners(true);

    try {
      const result = await localDatabase.updateEventWinners(selectedEvent.id, {
        winners: validWinners,
        prizeMoney: winnersForm.prizeMoney,
        galleryImages: winnersForm.galleryImages.filter(img => img.trim())
      });

      if (result.success) {
        toast.success('Winners updated successfully!');
        setShowUpdateWinners(null);
        setSelectedEvent(null);
        loadEvents(); // Reload events to show updated data
      } else {
        toast.error('Failed to update winners');
      }
    } catch (error) {
      console.error('Error updating winners:', error);
      toast.error('Failed to update winners');
    } finally {
      setIsUpdatingWinners(false);
    }
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
        organizer: createEventForm.organizer || userData.name,
        contact: createEventForm.contact || userData.email,
        image: createEventForm.image,
        galleryImages: createEventForm.galleryImages.filter(img => img && img.trim()),
        tags: createEventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        highlights: createEventForm.highlights.split(',').map(h => h.trim()).filter(h => h)
      };

      const result = await localDatabase.createEvent(eventData);

      if (result.success) {
        toast.success('✅ Event submitted for admin approval! You\'ll be notified once it\'s live.');
        setShowCreateEvent(false);
        loadEvents(); // Reload events
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

  const handleExportRegistrations = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Year', 'Special Requirements', 'Registered At'];
    const registrations = event.registeredUsers || [];

    // For now, just show a toast since we don't have actual user data
    toast.success(`Exporting ${registrations.length} registrations for ${event.title}`);

    // In a real app, you would:
    // 1. Fetch user details for each registration
    // 2. Create CSV/Excel file
    // 3. Trigger download
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      // For now, just update status to inactive
      await localDatabase.updateEvent(eventId, { isActive: false });
      toast.success('Event deleted successfully');
      loadEvents(); // Reload events
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return event.status === 'approved';
    if (activeTab === 'pending') return event.status === 'pending';
    if (activeTab === 'upcoming') return new Date(event.date) > new Date();
    if (activeTab === 'past') return new Date(event.date) <= new Date();
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Events', count: events.length, icon: <Calendar size={18} /> },
    { id: 'approved', label: 'Approved', count: stats.approvedEvents, icon: <CheckCircle size={18} /> },
    { id: 'pending', label: 'Pending', count: stats.pendingEvents, icon: <AlertCircle size={18} /> },
    { id: 'upcoming', label: 'Upcoming', count: stats.upcomingEvents, icon: <Clock size={18} /> },
    { id: 'past', label: 'Past Events', count: stats.pastEvents, icon: <Calendar size={18} /> },
  ];

  if (userRole !== 'event_society' && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldIcon className="text-purple-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Event Society Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need Event Society or Administrator privileges to access this panel.
            Please login with an Event Society or Admin account.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your current role: <span className="font-semibold text-gray-900 capitalize">{userRole || 'student'}</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Login options:
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="text-gray-600">• Event Society: events@nfsu.ac.in / EventSociety@2024</div>
              <div className="text-gray-600">• Admin: admin@nfsu.ac.in / admin123</div>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/events')}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 font-medium transition-colors"
            >
              Back to Events
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/events')}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UsersIcon className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Society Panel</h1>
            <p className="text-gray-600">
              {userRole === 'admin' ? 'Administrator View - Manage all events' : 'Manage your events, registrations, and winners'}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Show admin badge if user is admin */}
            {userRole === 'admin' && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl">
                <ShieldIcon size={18} className="text-yellow-600" />
                <span className="font-bold text-yellow-800">Admin Mode</span>
              </div>
            )}
            <button
              onClick={loadEvents}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 px-4 py-2 rounded-xl">
              <UserIcon size={18} className="text-purple-600" />
              <span className="font-medium text-gray-900">{userData.name || (userRole === 'admin' ? 'Administrator' : 'Event Society')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="text-blue-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <div className="text-sm text-blue-200">Total Events</div>
            </div>
          </div>
          <div className="text-sm text-blue-200">
            {userRole === 'admin' ? 'All campus events' : 'All your events'}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-green-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <div className="text-sm text-green-200">Total Registrations</div>
            </div>
          </div>
          <div className="text-sm text-green-200">Across all events</div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="text-yellow-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.pendingEvents}</div>
              <div className="text-sm text-yellow-200">Pending Approval</div>
            </div>
          </div>
          <div className="text-sm text-yellow-200">Awaiting admin approval</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="text-purple-200" size={24} />
            <div className="text-right">
              <div className="text-2xl font-bold">{stats.approvedEvents}</div>
              <div className="text-sm text-purple-200">Approved Events</div>
            </div>
          </div>
          <div className="text-sm text-purple-200">Live on events page</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {userRole === 'admin' ? 'All Campus Events' : 'Your Events'}
          </h2>
          <p className="text-gray-600">
            {userRole === 'admin' ? 'Manage all campus events as administrator' : 'Create, manage, and track your events'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateEvent(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Create Event
          </button>
          <button
            onClick={() => navigate('/events')}
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            View Public Events
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 font-medium transition-all relative ${activeTab === tab.id
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === tab.id ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
              <p className="text-gray-600">Loading your events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map(event => {
                const isUpcoming = new Date(event.date) > new Date();
                const isPast = new Date(event.date) <= new Date();
                const hasWinners = event.winners && event.winners.length > 0;

                return (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Event Image */}
                      <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                              <span className={`px-2 py-1 text-xs font-bold rounded-full ${event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                {event.status.toUpperCase()}
                              </span>
                              {isUpcoming && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">UPCOMING</span>}
                              {isPast && <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">PAST</span>}
                              {/* Show creator if admin */}
                              {userRole === 'admin' && event.creatorRole && (
                                <span className={`px-2 py-1 text-xs rounded-full ${event.creatorRole === 'admin' ? 'bg-yellow-100 text-yellow-800' :
                                  event.creatorRole === 'event_society' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {event.creatorRole.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar size={14} />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock size={14} />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin size={14} />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users size={14} />
                                <span>{event.registeredCount || 0} / {event.maxParticipants} registered</span>
                              </div>
                              {event.price > 0 && (
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <DollarSign size={14} />
                                  <span>₹{event.price}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-purple-600 mb-2">
                              {event.registeredCount || 0}
                            </div>
                            <div className="text-sm text-gray-600">Registrations</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewEvent(event.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          {event.status === 'approved' && isPast && (
                            <button
                              onClick={() => handleUpdateWinners(event.id)}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 font-medium flex items-center gap-2"
                            >
                              <Trophy size={16} />
                              {hasWinners ? 'Update Winners' : 'Add Winners'}
                            </button>
                          )}
                          {event.registeredCount > 0 && (
                            <button
                              onClick={() => handleExportRegistrations(event.id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium flex items-center gap-2"
                            >
                              <Download size={16} />
                              Export ({event.registeredCount})
                            </button>
                          )}
                          {event.status === 'pending' && (
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/events`)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            Public View
                          </button>
                        </div>

                        {/* Winners Preview */}
                        {hasWinners && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-yellow-600" />
                                <span className="font-bold text-gray-900">Event Winners</span>
                              </div>
                              <button
                                onClick={() => handleUpdateWinners(event.id)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {event.winners.slice(0, 3).map((winner, index) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium text-gray-700">
                                    {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉'} {winner.name}
                                  </span>
                                  <span className="text-xs text-gray-600 ml-2">- {winner.prize}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-gray-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {activeTab === 'all'
                  ? "You haven't created any events yet. Start by creating your first event!"
                  : `No ${activeTab} events found.`}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Create Your First Event
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal - ENHANCED VERSION */}
      {showEventDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{showEventDetail.title}</h2>
              <button
                onClick={() => setShowEventDetail(null)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Main Event Image with Gallery */}
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  {/* Main Image - Larger */}
                  <div className="lg:col-span-2">
                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                      <img
                        src={showEventDetail.image}
                        alt={showEventDetail.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${showEventDetail.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          showEventDetail.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {showEventDetail.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images Sidebar */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">Event Gallery</h3>

                    {/* Total Images Count */}
                    <div className="text-sm text-gray-600">
                      {showEventDetail.galleryImages &&
                        showEventDetail.galleryImages.filter(img => img && img.trim()).length > 0
                        ? `${showEventDetail.galleryImages.filter(img => img && img.trim()).length + 1} images`
                        : '1 image (main only)'}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Show main image as first gallery item */}
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-500">
                        <img
                          src={showEventDetail.image}
                          alt="Main event image"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 text-center">
                          Main Image
                        </div>
                      </div>

                      {/* Gallery Images */}
                      {showEventDetail.galleryImages &&
                        showEventDetail.galleryImages.filter(img => img && img.trim()).length > 0 ? (
                        showEventDetail.galleryImages
                          .filter(img => img && img.trim()) // Filter out empty/blank images
                          .slice(0, 3)
                          .map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                              <img
                                src={img}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop';
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
                                Gallery {index + 1}
                              </div>
                            </div>
                          ))
                      ) : (
                        // Show placeholders only if no gallery images exist
                        Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <CameraIcon className="text-gray-400 mx-auto mb-1" size={20} />
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* View All Gallery Button - Only show if there are actual gallery images */}
                    {showEventDetail.galleryImages &&
                      showEventDetail.galleryImages.filter(img => img && img.trim()).length > 0 && (
                        <button className="w-full mt-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium flex items-center justify-center gap-2">
                          <Camera size={16} />
                          View All {showEventDetail.galleryImages.filter(img => img && img.trim()).length + 1} Images
                        </button>
                      )}
                  </div>
                </div>

                {/* Event Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{showEventDetail.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Event Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Event Highlights */}
                  {showEventDetail.highlights && showEventDetail.highlights.length > 0 && (
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-blue-600" />
                        Event Highlights
                      </h3>
                      <ul className="space-y-3">
                        {showEventDetail.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                            </div>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Event Tags */}
                  {showEventDetail.tags && showEventDetail.tags.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                      <h3 className="font-bold text-gray-900 mb-3">Tags & Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {/* Event Type Badge */}
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {showEventDetail.type || 'Event'}
                        </span>

                        {/* Event Category Badge */}
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                          {showEventDetail.category || 'General'}
                        </span>

                        {/* Price Badge */}
                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${showEventDetail.price === 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                          }`}>
                          {showEventDetail.price === 0 ? 'FREE ENTRY' : `₹${showEventDetail.price}`}
                        </span>

                        {/* Additional Tags */}
                        {showEventDetail.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organizer Info */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-4">Organizer Information</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <UsersIcon className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{showEventDetail.organizer || 'Event Society'}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {showEventDetail.contact || 'Contact information not provided'}
                        </p>
                        {userRole === 'admin' && showEventDetail.creatorRole && (
                          <p className="text-sm text-blue-600 mt-1">
                            Created by: {showEventDetail.creatorRole}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Stats & Info */}
                <div className="space-y-6">
                  {/* Registration Stats */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Registration Statistics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Registrations Progress</span>
                          <span className="font-medium">{showEventDetail.registeredCount || 0} / {showEventDetail.maxParticipants}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                            style={{
                              width: `${Math.min(((showEventDetail.registeredCount || 0) / showEventDetail.maxParticipants) * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {Math.max(0, showEventDetail.maxParticipants - (showEventDetail.registeredCount || 0))} spots remaining
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-900">{showEventDetail.registeredCount || 0}</div>
                          <div className="text-xs text-blue-700 font-medium">Registered</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-xl">
                          <div className="text-2xl font-bold text-gray-900">
                            {Math.max(0, showEventDetail.maxParticipants - (showEventDetail.registeredCount || 0))}
                          </div>
                          <div className="text-xs text-gray-600">Available</div>
                        </div>
                      </div>

                      {/* Export Button */}
                      {(showEventDetail.registeredCount || 0) > 0 && (
                        <button
                          onClick={() => handleExportRegistrations(showEventDetail.id)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium flex items-center justify-center gap-2"
                        >
                          <Download size={16} />
                          Export Registration List
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Event Date & Time */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Date & Time</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Event Date</p>
                          <p className="text-sm text-gray-600">{formatDate(showEventDetail.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Timing</p>
                          <p className="text-sm text-gray-600">{showEventDetail.time} {showEventDetail.endTime ? `to ${showEventDetail.endTime}` : ''}</p>
                        </div>
                      </div>
                      {showEventDetail.endDate && showEventDetail.endDate !== showEventDetail.date && (
                        <div className="text-sm text-gray-600 pl-13">
                          Multi-day event until {formatDate(showEventDetail.endDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Location</h4>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{showEventDetail.location}</p>
                        <p className="text-sm text-gray-600 mt-1">Venue location</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 font-medium flex items-center justify-center gap-2">
                      <ExternalLink size={16} />
                      View on Map
                    </button>
                  </div>

                  {/* Winners Section if available */}
                  {showEventDetail.winners && showEventDetail.winners.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Trophy size={20} className="text-blue-600" />
                          Event Winners
                        </h4>
                        <button
                          onClick={() => {
                            setShowEventDetail(null);
                            handleUpdateWinners(showEventDetail.id);
                          }}
                          className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-3">
                        {showEventDetail.winners.slice(0, 3).map((winner, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${winner.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                                winner.position === 2 ? 'bg-gray-100 text-gray-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                <span className="font-bold">{winner.position}</span>
                              </div>
                              <span className="font-medium text-gray-900">{winner.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{winner.prize}</span>
                          </div>
                        ))}
                      </div>
                      {showEventDetail.winners.length > 3 && (
                        <button className="w-full mt-4 py-2 text-blue-700 hover:text-blue-800 font-medium">
                          View All {showEventDetail.winners.length} Winners →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons at Bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEventDetail(null)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Close
                  </button>
                  {showEventDetail.status === 'pending' && (
                    <button
                      onClick={() => handleDeleteEvent(showEventDetail.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 font-medium"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/events`)}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-medium"
                  >
                    View Public Page
                  </button>
                  {showEventDetail.status === 'approved' && new Date(showEventDetail.date) <= new Date() && (
                    <button
                      onClick={() => {
                        setShowEventDetail(null);
                        handleUpdateWinners(showEventDetail.id);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium"
                    >
                      Update Winners
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Winners Modal */}
      {showUpdateWinners && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Update Winners - {selectedEvent.title}</h2>
              <button
                onClick={() => setShowUpdateWinners(null)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Winners Form */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Winners</h3>
                    <button
                      onClick={handleAddWinner}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-xl hover:bg-blue-200"
                    >
                      + Add Winner
                    </button>
                  </div>

                  <div className="space-y-4">
                    {winnersForm.winners.map((winner, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border">
                          <span className="font-bold text-gray-700">
                            {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : '🥉'}
                          </span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Winner Name</label>
                            <input
                              type="text"
                              value={winner.name}
                              onChange={(e) => handleWinnerChange(index, 'name', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Enter winner name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Prize</label>
                            <input
                              type="text"
                              value={winner.prize}
                              onChange={(e) => handleWinnerChange(index, 'prize', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="e.g., ₹50,000 or Gold Medal"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveWinner(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={winnersForm.winners.length === 1}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize Money */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Prize Money</h3>
                  <input
                    type="number"
                    value={winnersForm.prizeMoney}
                    onChange={(e) => setWinnersForm(prev => ({ ...prev, prizeMoney: parseInt(e.target.value) || 0 }))}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                    placeholder="Total prize money in ₹"
                  />
                </div>

                {/* Gallery Images */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Gallery Images</h3>
                    <button
                      onClick={handleAddGalleryImage}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-xl hover:bg-blue-200"
                    >
                      + Add Image
                    </button>
                  </div>

                  <div className="space-y-3">
                    {winnersForm.galleryImages.map((img, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => handleGalleryImageChange(index, e.target.value)}
                          className="flex-1 p-3 border border-gray-300 rounded-xl"
                          placeholder="Image URL (unsplash.com recommended)"
                        />
                        <button
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={winnersForm.galleryImages.length === 1}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tip: Use high-quality images from unsplash.com for best results
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitWinners}
                  disabled={isUpdatingWinners}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isUpdatingWinners ? 'Updating Winners...' : 'Save Winners & Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <button
                onClick={() => setShowCreateEvent(false)}
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
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Image *</label>
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
                      placeholder="Or paste image URL here"
                    />
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
                  {/* Event Photos - Marketplace Style */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Photos (Up to 5 photos)
                      </label>

                      {/* Photos Grid */}
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                        {/* Main Image Slot */}
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-blue-500">
                          <img
                            src={createEventForm.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop'}
                            alt="Main event image"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 text-center">
                            Main Image
                          </div>
                        </div>

                        {/* Gallery Images */}
                        {createEventForm.galleryImages.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-300 group">
                            <img
                              src={img}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGalleryImages = createEventForm.galleryImages.filter((_, i) => i !== index);
                                setCreateEventForm({ ...createEventForm, galleryImages: newGalleryImages });
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Add More Button */}
                        {createEventForm.galleryImages.length < 4 && (
                          <button
                            type="button"
                            onClick={() => {
                              // Create a hidden file input
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.multiple = true; // Allow multiple selection
                              input.onchange = (e) => {
                                const files = Array.from(e.target.files || []);
                                const newImages = [...createEventForm.galleryImages];

                                files.slice(0, 4 - createEventForm.galleryImages.length).forEach((file) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    newImages.push(reader.result);
                                    if (newImages.length <= 4) {
                                      setCreateEventForm({ ...createEventForm, galleryImages: newImages });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                });
                              };
                              input.click();
                            }}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Plus size={24} className="text-gray-400 mb-1" />
                            <span className="text-xs text-gray-600">Add Photos</span>
                          </button>
                        )}
                      </div>

                      {/* Image Counter */}
                      <div className="text-sm text-gray-600 mb-2">
                        {createEventForm.galleryImages.length}/4 gallery images
                        {createEventForm.galleryImages.length === 0 && ' (Main image + 4 gallery images allowed)'}
                      </div>

                      {/* URL Input for Gallery Images (Alternative) */}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Or add image URLs (paste URLs separated by commas):
                        </p>
                        <textarea
                          value={createEventForm.galleryImages.join(', ')}
                          onChange={(e) => {
                            const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                            setCreateEventForm({
                              ...createEventForm,
                              galleryImages: urls.slice(0, 4) // Limit to 4
                            });
                          }}
                          className="w-full p-3 border border-gray-300 rounded-xl text-sm"
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          rows="2"
                        />
                      </div>

                      {/* Main Image Upload Section */}
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                        <label className="block text-sm font-medium text-blue-700 mb-2">
                          Change Main Event Image *
                        </label>
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
                            className="flex-1 p-3 border border-blue-300 rounded-xl"
                          />
                          <input
                            type="text"
                            value={createEventForm.image}
                            onChange={(e) => setCreateEventForm({ ...createEventForm, image: e.target.value })}
                            className="flex-1 p-3 border border-blue-300 rounded-xl"
                            placeholder="Or paste main image URL here"
                          />
                        </div>
                      </div>

                      {/* Tip Message */}
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-start gap-2">
                          <Zap size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-yellow-800 font-medium">💡 Pro Tip:</p>
                            <p className="text-xs text-yellow-700">
                              Clear, high-quality images get 3x more event registrations!
                              Show the venue, previous events, or what participants can expect.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Approval Notice */}
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

      {/* Quick Stats */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
        <h3 className="font-bold text-gray-900 mb-4">Quick Tips {userRole === 'admin' ? 'for Administrators' : 'for Event Societies'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="font-bold text-gray-900">Create Events</span>
            </div>
            <p className="text-sm text-gray-600">
              {userRole === 'admin'
                ? 'Admin events are published immediately without approval queue.'
                : 'Submit events for admin approval 48 hours before start date.'}
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-600" size={20} />
              <span className="font-bold text-gray-900">Update Winners</span>
            </div>
            <p className="text-sm text-gray-600">
              Add winners and photos after event completion to showcase success.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Download className="text-green-600" size={20} />
              <span className="font-bold text-gray-900">Export Data</span>
            </div>
            <p className="text-sm text-gray-600">
              Export registration lists for attendance and certificate generation.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <BarChart2 className="text-purple-600" size={20} />
              <span className="font-bold text-gray-900">Track Analytics</span>
            </div>
            <p className="text-sm text-gray-600">
              Monitor registration progress and event popularity in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSocietyPanel;
