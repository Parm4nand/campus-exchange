import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import localDatabase from '../../services/localDatabase';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const { userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      loadConversations();
      
      // Subscribe to real-time updates (polling simulation)
      const unsubscribe = localDatabase.subscribeToConversations(
        userData.id,
        (updatedConversations) => {
          setConversations(updatedConversations);
          setLoading(false);
        }
      );

      return unsubscribe;
    }
  }, [userData]);

  const loadConversations = async () => {
    if (userData) {
      try {
        const convs = await localDatabase.getConversations(userData.id);
        setConversations(convs);
        
        // If no conversations, show sample data
        if (convs.length === 0 && userData.id === '1') {
          setConversations(getSampleConversations());
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Sample conversations for demo
  const getSampleConversations = () => [
    {
      id: 'sample1',
      participants: ['1', '2'],
      lastMessage: 'Hi, is the textbook still available?',
      lastMessageAt: new Date().toISOString(),
      otherUser: {
        name: 'Jane Smith',
        email: 'admin@nfsu.ac.in',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      item: {
        title: 'Python Programming Textbook',
        price: 1200
      },
      unreadCount: 2
    },
    {
      id: 'sample2',
      participants: ['1', '3'],
      lastMessage: 'Thanks for the quick response!',
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      otherUser: {
        name: 'Robert Johnson',
        email: 'robert@nfsu.ac.in',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert'
      },
      item: {
        title: 'Wireless Headphones',
        price: 2500
      },
      unreadCount: 0
    }
  ];

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="text-gray-300 mx-auto mb-3" size={40} />
        <p className="text-gray-600 mb-2">No conversations yet</p>
        <p className="text-gray-500 text-sm">
          Start a conversation by messaging a seller or buyer
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelectConversation(conversation)}
          className={`w-full text-left p-4 rounded-lg transition-colors ${
            selectedConversationId === conversation.id
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                {conversation.otherUser?.avatar ? (
                  <img
                    src={conversation.otherUser.avatar}
                    alt={conversation.otherUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              {conversation.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {conversation.otherUser?.name || 'Unknown User'}
                </h4>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(conversation.lastMessageAt)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 truncate mb-1">
                {conversation.lastMessage || 'No messages yet'}
              </p>
              
              {conversation.item && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="truncate">{conversation.item.title}</span>
                  <span>•</span>
                  <span className="font-medium">₹{conversation.item.price}</span>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ConversationList;
