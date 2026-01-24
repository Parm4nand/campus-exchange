import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Ticket, Filter, Plus, Star, Share2, Heart, ChevronRight } from 'lucide-react';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');

  const mockEvents = [
    {
      id: '1',
      title: 'Campus Tech Fest 2024',
      description: 'Annual technology festival with workshops, hackathons, and tech talks.',
      date: 'Mar 15, 2024',
      time: '10:00 AM - 6:00 PM',
      location: 'Main Auditorium',
      organizer: 'Tech Club',
      attendees: 250,
      capacity: 300,
      price: 'Free',
      category: 'Technology',
      featured: true,
      image: 'https://picsum.photos/600/400?random=10'
    },
    {
      id: '2',
      title: 'Study Group: Calculus Review',
      description: 'Group study session for Calculus I final exam preparation.',
      date: 'Mar 12, 2024',
      time: '2:00 PM - 4:00 PM',
      location: 'Library Study Room 3',
      organizer: 'Math Department',
      attendees: 15,
      capacity: 20,
      price: 'Free',
      category: 'Academics',
      featured: false,
      image: 'https://picsum.photos/600/400?random=11'
    },
    {
      id: '3',
      title: 'Campus Yard Sale',
      description: 'Sell or buy used items from fellow students. Furniture, textbooks, electronics and more.',
      date: 'Mar 18, 2024',
      time: '9:00 AM - 3:00 PM',
      location: 'Student Center Lawn',
      organizer: 'Student Council',
      attendees: 120,
      capacity: 200,
      price: 'Free Entry',
      category: 'Marketplace',
      featured: true,
      image: 'https://picsum.photos/600/400?random=12'
    },
    {
      id: '4',
      title: 'Career Fair: Tech Companies',
      description: 'Connect with top tech companies for internships and full-time positions.',
      date: 'Mar 22, 2024',
      time: '11:00 AM - 4:00 PM',
      location: 'Career Center',
      organizer: 'Placement Cell',
      attendees: 180,
      capacity: 200,
      price: 'Free',
      category: 'Career',
      featured: true,
      image: 'https://picsum.photos/600/400?random=13'
    },
    {
      id: '5',
      title: 'Movie Night: Sci-Fi Marathon',
      description: 'Watch classic sci-fi movies with free popcorn and drinks.',
      date: 'Mar 14, 2024',
      time: '7:00 PM - 11:00 PM',
      location: 'Student Lounge',
      organizer: 'Film Club',
      attendees: 45,
      capacity: 60,
      price: '$5',
      category: 'Entertainment',
      featured: false,
      image: 'https://picsum.photos/600/400?random=14'
    },
    {
      id: '6',
      title: 'Fitness Bootcamp',
      description: 'High-intensity workout session for all fitness levels.',
      date: 'Mar 16, 2024',
      time: '8:00 AM - 9:30 AM',
      location: 'Gymnasium',
      organizer: 'Fitness Club',
      attendees: 30,
      capacity: 40,
      price: 'Free',
      category: 'Fitness',
      featured: false,
      image: 'https://picsum.photos/600/400?random=15'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'free', label: 'Free Events' },
    { id: 'featured', label: 'Featured' }
  ];

  const categories = ['All', 'Technology', 'Academics', 'Marketplace', 'Career', 'Entertainment', 'Fitness', 'Social'];

  const upcomingEvents = mockEvents.slice(0, 3);
  const featuredEvents = mockEvents.filter(event => event.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Campus Events</h1>
              <p className="text-white/90 text-xl">Discover and join events happening around campus</p>
            </div>
            <div className="hidden md:block">
              <Calendar className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-blue p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-white">{mockEvents.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-3xl font-bold text-dark">4</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Free Events</p>
                <p className="text-3xl font-bold text-dark">5</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Attendees</p>
                <p className="text-3xl font-bold text-dark">640+</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="title">Featured Events</h2>
              <button className="text-primary font-semibold flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <div key={event.id} className="card card-hover overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {event.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-primary-50 rounded">
                          <Heart className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-1 hover:bg-primary-50 rounded">
                          <Share2 className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-dark mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees}/{event.capacity} attending</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="font-bold text-primary">{event.price}</span>
                      <button className="btn-primary text-sm px-4 py-2">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`chip ${activeFilter === filter.id ? 'chip-active' : ''}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <select className="input-field w-40">
                <option>Sort by: Date</option>
                <option>Sort by: Popularity</option>
                <option>Sort by: Price</option>
              </select>
              
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
              
              <button className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* All Events Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title">All Events</h2>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`chip ${category === 'All' ? 'chip-active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map(event => (
              <div key={event.id} className="card card-hover">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {event.featured && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          <span className="text-xs text-amber-600 font-medium">Featured</span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-dark mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <span className="font-bold text-primary">{event.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      by {event.organizer}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-primary-50 rounded-lg">
                        <Heart className="w-4 h-4 text-primary" />
                      </button>
                      <button className="btn-primary text-sm px-4 py-2">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Calendar Preview */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="title mb-2">Upcoming This Week</h2>
              <p className="text-gray-600">Mark your calendar for these events</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              View Calendar
            </button>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 hover:bg-primary-50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-xl flex flex-col items-center justify-center text-white">
                    <span className="text-xs">MAR</span>
                    <span className="text-xl font-bold">15</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark">{event.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{event.attendees}/{event.capacity}</div>
                    <div className="text-primary font-bold">{event.price}</div>
                  </div>
                  <button className="btn-primary text-sm px-4 py-2">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
