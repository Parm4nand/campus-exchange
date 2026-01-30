import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MessageSquare, Search, Send, Image as ImageIcon,
  Smile, Paperclip, MoreVertical, Phone, Video,
  Check, CheckCheck, Clock, User, Shield, X,
  Ban, Trash2, Flag, Archive, BellOff, LogOut,
  Mic, Camera, Volume2, Settings, ShoppingBag, Calendar,
  ChevronDown // ADD THIS
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import localDatabase from '../services/localDatabase';
// Add this import at the top
import toast from 'react-hot-toast';

const Chat = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'event_society', 'student'
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [shouldScrollOnNextUpdate, setShouldScrollOnNextUpdate] = useState(false);
  const previousMessagesCount = useRef(0);
  const initialLoad = useRef(true);
  // Check if coming from Marketplace with item/seller info
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sellerId = params.get('sellerId');
    const userId = params.get('userId');
    const itemId = params.get('itemId');
    const requestId = params.get('requestId');
    const contextId = params.get('contextId');
    const context = params.get('context'); // 'item' or 'request'
    const purpose = params.get('purpose');

    // Determine target user ID and context ID
    const targetUserId = sellerId || userId;

    // Determine context ID based on what's available
    let finalContextId = null;
    if (context === 'request') {
      finalContextId = requestId || contextId;
    } else {
      finalContextId = itemId || contextId;
    }

    if (targetUserId && currentUser?.uid) {
      handleStartConversation(targetUserId, finalContextId, purpose);
    }
  }, [location, currentUser]);

  // Load conversations
  useEffect(() => {
    if (currentUser?.uid) {
      loadConversations();

      // Subscribe to conversation updates
      const unsubscribe = localDatabase.subscribeToConversations(
        currentUser.uid,
        (updatedConversations) => {
          setConversations(updatedConversations);
          setLoading(false);
        }
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [currentUser]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id && currentUser?.uid) {
      loadMessages(selectedConversation.id);

      // Mark messages as read
      markMessagesAsRead(selectedConversation.id);
    }
  }, [selectedConversation, currentUser]);

  // Replace the above useEffect with:
  // Fix scroll behavior - only scroll when user sends a message
  useEffect(() => {
    // Don't scroll on initial load or conversation selection
    if (!selectedConversation || messages.length === 0) return;

    // Check if the last message was just sent by current user
    const lastMessage = messages[messages.length - 1];

    // Only scroll if:
    // 1. New message was added (messages count increased)
    // 2. Last message is from current user
    if (messages.length > previousMessagesCount.current &&
      lastMessage &&
      lastMessage.isCurrentUser) {

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest' // Don't force to bottom
        });
      }, 50);
    }

    // Update the message count reference
    previousMessagesCount.current = messages.length;
  }, [messages, selectedConversation]);
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showEmojiPicker]);

  const loadConversations = async () => {
    if (!currentUser?.uid) return;

    try {
      const convs = await localDatabase.getConversations(currentUser.uid);
      setConversations(convs);

      // If no conversations, create some sample ones
      if (convs.length === 0 && currentUser.uid === '1') {
        createSampleConversations();
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleConversations = async () => {
    // Create sample conversations
    await Promise.all([
      localDatabase.createConversation('1', '2', '1'),
      localDatabase.createConversation('1', '3', '2')
    ]);

    // Add sample messages
    await Promise.all([
      localDatabase.sendMessage(await getConversationId('1', '2'), '2', 'Hi! Is the MacBook still available?'),
      localDatabase.sendMessage(await getConversationId('1', '2'), '1', 'Yes, it is. Are you interested?'),
      localDatabase.sendMessage(await getConversationId('1', '2'), '2', 'Can you do ₹1100?'),
      localDatabase.sendMessage(await getConversationId('1', '3'), '3', 'I can meet at Library cafe'),
      localDatabase.sendMessage(await getConversationId('1', '3'), '1', 'Sounds good! What time works for you?')
    ]);

    loadConversations();
  };

  const getConversationId = async (user1Id, user2Id) => {
    const result = await localDatabase.createConversation(user1Id, user2Id);
    return result.conversationId;
  };

  const loadMessages = async (conversationId) => {
    try {
      const msgs = await localDatabase.getMessages(conversationId);

      // Enrich messages with sender info
      const enrichedMessages = await Promise.all(
        msgs.map(async (msg) => {
          const sender = await localDatabase.getUser(msg.senderId);
          return {
            ...msg,
            senderName: sender?.name || 'Unknown',
            senderRole: sender?.role || 'student', // ADD THIS LINE
            isCurrentUser: msg.senderId === currentUser.uid
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  const markMessagesAsRead = async (conversationId) => {
    if (!selectedConversation?.id || !currentUser?.uid) return;

    try {
      const msgs = await localDatabase.getMessages(conversationId);
      const unreadMessages = msgs.filter(msg =>
        msg.senderId !== currentUser.uid && !msg.read
      );

      // Update unread count in conversation
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleStartConversation = async (targetUserId, contextId, purpose = null) => {
    if (!currentUser?.uid || !targetUserId) return;

    try {
      // Get target user info to check role permissions
      const targetUser = await localDatabase.getUser(targetUserId);

      // Check if current user can message this user
      if (!(await canMessageUser(targetUser))) {
        const currentUserRole = userData?.role || 'student';
        const targetUserRole = targetUser?.role || 'student';

        toast.error(`As a ${currentUserRole}, you cannot message ${targetUserRole}s directly.`, {
          duration: 4000,
        });
        return;
      }

      const result = await localDatabase.createConversation(
        currentUser.uid,
        targetUserId,
        contextId
      );

      if (!result.existing) {
        // Customize initial message based on purpose
        let initialMessage = 'Hi! I\'m interested in your item.';
        const currentUserRole = userData?.role || 'student';

        // Set message based on purpose
        if (purpose === 'negotiate') {
          initialMessage = 'Hi! I\'m interested in your item. Can we discuss the price?';
        } else if (purpose === 'questions') {
          initialMessage = 'Hi! I have some questions about your item. Can you provide more details?';
        } else if (purpose === 'meet') {
          initialMessage = 'Hi! I\'d like to arrange a meetup to see the item. When are you available?';
        } else if (purpose === 'purchase') {
          initialMessage = `Hi! I want to purchase your item. Let's arrange payment and pickup.`;
        } else if (purpose === 'offer') {
          initialMessage = `Hi! I have an item that might match your request.`;
        } else if (currentUserRole === 'admin') {
          initialMessage = 'Hello, this is an admin message. How can I assist you?';
        } else if (currentUserRole === 'event_society') {
          initialMessage = 'Hello from Event Society! We have an event-related inquiry.';
        }

        await localDatabase.sendMessage(
          result.conversationId,
          currentUser.uid,
          initialMessage
        );

        // Send role-based notification to recipient
        if (targetUser) {
          await localDatabase.createNotification({
            type: 'new_message',
            title: 'New Message',
            message: `You have a new message from ${userData?.name || 'a user'} (${currentUserRole})`,
            userId: targetUserId,
            senderId: currentUser.uid,
            senderRole: currentUserRole,
            conversationId: result.conversationId,
            read: false,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Load the conversation
      const convs = await localDatabase.getConversations(currentUser.uid);
      const newConv = convs.find(c => c.id === result.conversationId);

      if (newConv) {
        setSelectedConversation(newConv);
        setShowOptionsMenu(false);

        // Show success message with role context
        const currentUserRole = userData?.role || 'student';
        if (currentUserRole !== 'student') {
          toast.success(`Conversation started as ${currentUserRole}.`, {
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation?.id || !currentUser?.uid) return;

    try {
      const senderRole = userData?.role || 'student';

      // Check if this is an official announcement
      const isAnnouncement = (
        (senderRole === 'admin' || senderRole === 'event_society') &&
        (newMessage.toLowerCase().includes('[announcement]') ||
          newMessage.toLowerCase().includes('[important]') ||
          newMessage.toLowerCase().includes('[notice]'))
      );

      // Send message
      const result = await localDatabase.sendMessage(
        selectedConversation.id,
        currentUser.uid,
        newMessage
      );

      if (result.success) {
        // Track analytics
        await trackMessageAnalytics({
          senderRole,
          text: newMessage,
          conversationId: selectedConversation.id,
          timestamp: new Date().toISOString()
        });

        // Show announcement confirmation
        if (isAnnouncement) {
          toast.success(`Official ${senderRole} announcement sent!`, {
            duration: 3000,
            icon: '📢',
          });
        }

        // Show role-based confirmation for non-students
        if (senderRole !== 'student') {
          toast.success(`Message sent as ${senderRole}.`, {
            duration: 2000,
          });
        }

        // Set flag to scroll on next update
        setShouldScrollOnNextUpdate(true);

        // Refresh messages
        loadMessages(selectedConversation.id);
        setNewMessage('');

        // Update conversations list
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Role-based error messages
      const senderRole = userData?.role || 'student';
      if (senderRole === 'admin') {
        toast.error('Admin message failed to send. Please try again.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  const handleBlockUser = async () => {
    if (!selectedConversation?.otherUser?.id || !currentUser?.uid) return;

    try {
      // Actually block the user in database
      const result = await localDatabase.blockUser(currentUser.uid, selectedConversation.otherUser.id);

      if (result.success) {
        setShowBlockModal(false);

        // Show confirmation
        toast.success(`You have blocked ${selectedConversation.otherUser.name}. They can no longer message you.`, {
          duration: 3000,
        });

        // Remove conversation from list
        setConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
        setSelectedConversation(null);
      } else {
        toast.error(result.error || 'Failed to block user.');
      }

    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user. Please try again.');
    }
  };

  const handleCall = () => {
    setIsCalling(true);
    alert(`Calling ${selectedConversation?.otherUser?.name || 'user'}...\n\nNote: This is a demo. In a real app, this would initiate a voice call.`);
    setTimeout(() => setIsCalling(false), 2000);
  };

  const handleVideoCall = () => {
    setIsVideoCalling(true);
    alert(`Starting video call with ${selectedConversation?.otherUser?.name || 'user'}...\n\nNote: This is a demo. In a real app, this would initiate a video call.`);
    setTimeout(() => setIsVideoCalling(false), 2000);
  };

  const handleDeleteChat = async () => {
    if (!selectedConversation?.id || !currentUser?.uid) return;

    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      try {
        // Delete from database
        const result = await localDatabase.deleteConversation(selectedConversation.id, currentUser.uid);

        if (result.success) {
          // Remove from state
          setConversations(prev => prev.filter(conv => conv.id !== selectedConversation.id));
          setSelectedConversation(null);
          setShowOptionsMenu(false);

          toast.success('Conversation deleted successfully.', {
            duration: 3000,
          });
        } else {
          toast.error(result.error || 'Failed to delete conversation.');
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
        toast.error('Failed to delete conversation. Please try again.');
      }
    }
  };
  const handleReportUser = async () => {
    if (!selectedConversation?.otherUser) return;

    // Check if user is trying to report an admin
    if (selectedConversation.otherUser.role === 'admin') {
      toast.error('You cannot report an administrator. Please contact support if there is an issue.');
      setShowOptionsMenu(false);
      return;
    }

    try {
      // Get reporter's role for context
      const reporterRole = userData?.role || 'student';

      // Report to admin
      await localDatabase.createNotification({
        type: 'user_reported',
        title: 'User Reported',
        message: `${userData?.name || 'A user'} (${reporterRole}) reported ${selectedConversation.otherUser.name} (${selectedConversation.otherUser.role || 'student'}) in chat`,
        userId: 'admin', // Send to admin
        reportedUserId: selectedConversation.otherUser.id,
        reporterId: currentUser?.uid,
        reporterRole: reporterRole,
        conversationId: selectedConversation.id,
        severity: reporterRole === 'admin' ? 'high' : 'medium', // Admin reports get higher priority
        read: false,
        timestamp: new Date().toISOString()
      });

      setShowOptionsMenu(false);

      toast.success(`${selectedConversation.otherUser.name} has been reported to admin. The admin team will review this report.`, {
        duration: 4000,
      });
    } catch (error) {
      console.error('Error reporting user:', error);
      toast.error('Failed to report user. Please try again.');
    }
  };
  // Add emoji to message
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser?.uid || !selectedConversation?.id) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    setUploadingImage(true);

    try {
      // Upload image (mock implementation)
      const uploadResult = await localDatabase.uploadImage(file, `chat/${selectedConversation.id}`);

      if (uploadResult.success) {
        // Send image as message
        await localDatabase.sendMessage(
          selectedConversation.id,
          currentUser.uid,
          `[IMAGE] ${uploadResult.url}`
        );

        // Refresh messages
        loadMessages(selectedConversation.id);
        loadConversations();

        toast.success('Image sent successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Clear file input
      e.target.value = '';
    }
  };
  // Check if message is an official announcement
  const isOfficialAnnouncement = (message) => {
    return (
      message.senderRole === 'admin' ||
      message.senderRole === 'event_society'
    ) && (
        message.text.toLowerCase().includes('[announcement]') ||
        message.text.toLowerCase().includes('[important]') ||
        message.text.toLowerCase().includes('[notice]')
      );
  };
  // Check if current user can message the target user based on roles and blocking
  const canMessageUser = async (targetUser) => {
    if (!currentUser?.uid || !targetUser) return true;

    // Check if current user has blocked this user
    const currentUserData = await localDatabase.getUser(currentUser.uid);
    if (currentUserData?.blockedUsers?.includes(targetUser.id)) {
      toast.error('You have blocked this user. Unblock them to send messages.');
      return false;
    }

    // Check if target user has blocked current user
    const targetUserData = await localDatabase.getUser(targetUser.id);
    if (targetUserData?.blockedUsers?.includes(currentUser.uid)) {
      toast.error('This user has blocked you. You cannot send messages to them.');
      return false;
    }

    const currentUserRole = userData?.role || 'student';
    const targetUserRole = targetUser.role || 'student';

    // Special rules for different roles
    switch (currentUserRole) {
      case 'student':
        // Students can message anyone (including admins for support)
        return true;

      case 'event_society':
        // Event societies can message anyone
        return true;

      case 'admin':
        // Admins can message anyone
        return true;

      default:
        return true;
    }
  };
  // Track message analytics by role
  const trackMessageAnalytics = async (messageData) => {
    try {
      const senderRole = messageData.senderRole || 'student';
      const conversationId = messageData.conversationId;

      // Get conversation to find recipient role
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation?.otherUser) return;

      const recipientRole = conversation.otherUser.role || 'student';

      // Store analytics (in a real app, this would go to a database)
      const analyticsEntry = {
        timestamp: new Date().toISOString(),
        senderRole,
        recipientRole,
        messageLength: messageData.text?.length || 0,
        hasMedia: messageData.text?.includes('[IMAGE]') || messageData.text?.includes('[FILE]'),
        isOfficialAnnouncement: isOfficialAnnouncement(messageData),
        conversationType: conversation.itemId ? 'marketplace' : 'direct'
      };

      // In a real app, you would save this to analytics database
      // For demo, just log it
      if (process.env.NODE_ENV === 'development') {
        console.log('Message Analytics:', analyticsEntry);
      }

      // Update role-based stats in local storage
      const statsKey = `chat_stats_${currentUser?.uid}`;
      const existingStats = JSON.parse(localStorage.getItem(statsKey) || '{}');

      // Update role interaction counts
      const interactionKey = `${senderRole}_to_${recipientRole}`;
      existingStats[interactionKey] = (existingStats[interactionKey] || 0) + 1;

      // Update message counts by role
      existingStats[`${senderRole}_messages_sent`] = (existingStats[`${senderRole}_messages_sent`] || 0) + 1;
      existingStats[`${recipientRole}_messages_received`] = (existingStats[`${recipientRole}_messages_received`] || 0) + 1;

      localStorage.setItem(statsKey, JSON.stringify(existingStats));

    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser?.uid || !selectedConversation?.id) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB.');
      return;
    }

    setUploadingImage(true);

    try {
      // Upload file (mock implementation)
      const uploadResult = await localDatabase.uploadImage(file, `chat/files/${selectedConversation.id}`);

      if (uploadResult.success) {
        // Send file as message
        await localDatabase.sendMessage(
          selectedConversation.id,
          currentUser.uid,
          `[FILE] ${file.name} - ${uploadResult.url}`
        );

        // Refresh messages
        loadMessages(selectedConversation.id);
        loadConversations();

        toast.success('File sent successfully!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const scrollToBottom = (force = false) => {
    // Only scroll if forced (like when user clicks a button)
    if (force) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }
  };
  // Add this new function for searching users
  const handleSearchUsers = async (term) => {
    if (term.length < 2) {
      setUserSearchResults([]);
      return;
    }

    try {
      const results = await localDatabase.searchUsers(term, 10);
      console.log('Search results for "' + term + '":', results); // DEBUG

      // Only filter out current user
      let filteredResults = results.filter(user => user.id !== currentUser?.uid);

      // Apply role filter
      if (roleFilter !== 'all') {
        filteredResults = filteredResults.filter(user =>
          user.role === roleFilter
        );
      }

      setUserSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    conv.item?.title?.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(messageSearchQuery.toLowerCase())
  );

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
  // Get role badge styling
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          text: 'Admin',
          class: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
          icon: <Shield size={12} />
        };
      case 'event_society':
        return {
          text: 'Event Society',
          class: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
          icon: <Calendar size={12} />  // <-- This icon needs to be imported
        };
      default:
        return {
          text: 'Student',
          class: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          icon: <User size={12} />
        };
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Chats List */}
      <div className="w-96 bg-white rounded-2xl shadow-card border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Search for Users */}
          <div className="mb-4 relative">  {/* ADD 'relative' class here */}
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-3">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by ID, name, or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearchUsers(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchUsers(searchQuery);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Role Filter Dropdown */}
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    if (searchQuery.length >= 2) {
                      handleSearchUsers(searchQuery); // Re-search with new filter
                    }
                  }}
                  className="appearance-none pl-3 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="event_society">Event Societies</option>
                  <option value="student">Students</option>
                </select>
                <div className="absolute right-2 top-3 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Search Results Dropdown - FIXED POSITIONING */}
            {searchQuery.length >= 2 && userSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {userSearchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={async () => {
                      // Check permissions before starting conversation
                      if (await canMessageUser(user)) {
                        handleStartConversation(user.id);
                      } else {
                        toast.error(`You cannot message ${user.role}s directly.`, {
                          duration: 3000,
                        });
                      }
                    }}
                  >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent starting chat
                        if (user.id) {
                          navigate(`/profile/${user.id}`);
                        }
                      }}
                      className="font-medium text-gray-900 truncate hover:text-blue-600 hover:underline transition-colors text-left"
                    >
                      {user.name}
                    </button>
                    {user.role && user.role !== 'student' && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${getRoleBadge(user.role).class}`}>
                        {getRoleBadge(user.role).text.charAt(0)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">@{user.publicId}</p>
                </div>
                <MessageSquare size={16} className="text-blue-500" />
              </div>
            ))}
          </div>
            )}
        </div>

        {/* Original message search (keep it but rename placeholder) */}
        <div className="relative">
          <div className="absolute left-3 top-3">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search in your messages..."
            value={messageSearchQuery}
            onChange={(e) => setMessageSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all ${selectedConversation?.id === conversation.id
                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                : ''
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    {conversation.otherUser?.avatar ? (
                      <img
                        src={conversation.otherUser.avatar}
                        alt={conversation.otherUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {conversation.otherUser?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting the conversation
                          if (conversation.otherUser?.id) {
                            navigate(`/profile/${conversation.otherUser.id}`);
                          }
                        }}
                        className="font-semibold text-gray-900 truncate hover:text-blue-600 hover:underline transition-colors text-left"
                      >
                        {conversation.otherUser?.name || 'Unknown User'}
                      </button>
                      {conversation.otherUser?.role && conversation.otherUser.role !== 'student' && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-0.5 ${getRoleBadge(conversation.otherUser.role).class}`}>
                          {getRoleBadge(conversation.otherUser.role).icon}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                  <div className="flex items-center justify-between">
                    {conversation.item && (
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {conversation.item.title}
                      </span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-blue-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Start a conversation by searching users above or messaging sellers from marketplace
            </p>
            <div className="space-y-3 max-w-xs mx-auto">
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg font-medium border border-blue-200 transition"
              >
                Browse Marketplace
              </button>
              <button
                onClick={() => navigate('/requests')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-medium border border-gray-200 transition"
              >
                View Requests
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Chat Window */ }
  {
    selectedConversation ? (
      <div className="flex-1 bg-white rounded-2xl shadow-card border border-gray-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  {selectedConversation.otherUser?.avatar ? (
                    <img
                      src={selectedConversation.otherUser.avatar}
                      alt={selectedConversation.otherUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {selectedConversation.otherUser?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${selectedConversation.otherUser?.id}`)}
                    className="font-bold text-gray-900 hover:text-blue-600 hover:underline transition-colors text-left"
                  >
                    {selectedConversation.otherUser?.name || 'Unknown User'}
                  </button>
                  {selectedConversation.otherUser?.role && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 ${getRoleBadge(selectedConversation.otherUser.role).class}`}>
                      {getRoleBadge(selectedConversation.otherUser.role).icon}
                      {getRoleBadge(selectedConversation.otherUser.role).text}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedConversation.item?.title || 'NFSU Student'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
                {(selectedConversation?.mutedBy || []).includes(currentUser?.uid) && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 ml-2">
                    <BellOff size={14} />
                    <span>Muted</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                disabled={isCalling}
                className={`p-2 hover:bg-gray-100 rounded-lg ${isCalling ? 'bg-green-100' : ''}`}
              >
                <Phone size={20} className={`${isCalling ? 'text-green-600' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleVideoCall}
                disabled={isVideoCalling}
                className={`p-2 hover:bg-gray-100 rounded-lg ${isVideoCalling ? 'bg-blue-100' : ''}`}
              >
                <Video size={20} className={`${isVideoCalling ? 'text-blue-600' : 'text-gray-600'}`} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    <button
                      onClick={() => {
                        setShowBlockModal(true);
                        setShowOptionsMenu(false);
                      }}
                      className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50 text-red-600"
                    >
                      <Ban size={16} />
                      <span>Block User</span>
                    </button>
                    <button
                      onClick={handleDeleteChat}
                      className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50 text-red-600"
                    >
                      <Trash2 size={16} />
                      <span>Delete Chat</span>
                    </button>

                    {/* Report button - hidden for admins, shows different text for event societies */}
                    {selectedConversation.otherUser?.role !== 'admin' && (
                      <button
                        onClick={handleReportUser}
                        className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50 text-yellow-600"
                      >
                        <Flag size={16} />
                        <span>
                          {userData?.role === 'event_society' ? 'Report User to Admin' : 'Report to Admin'}
                          {userData?.role === 'admin' && ' (High Priority)'}
                        </span>
                      </button>
                    )}
                    {/* Explanation for why admin can't be reported */}
                    {selectedConversation.otherUser?.role === 'admin' && (
                      <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100">
                        <Shield size={12} className="inline mr-1" />
                        Administrators cannot be reported through this system.
                        {userData?.role === 'admin' && ' Use admin panel for internal issues.'}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        toast.success('Chat archived successfully.');
                        setShowOptionsMenu(false);
                      }}
                      className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50"
                    >
                      <Archive size={16} />
                      <span>Archive</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const result = await localDatabase.toggleConversationMute(
                            selectedConversation.id,
                            currentUser.uid
                          );

                          if (result.success) {
                            toast.success(
                              result.muted
                                ? 'Notifications muted for this conversation.'
                                : 'Notifications unmuted for this conversation.'
                            );

                            // Update local conversation state
                            // Update local conversation state
                            const updatedConversations = await localDatabase.getConversations(currentUser.uid);
                            const updatedConv = updatedConversations.find(c => c.id === selectedConversation.id);
                            if (updatedConv) {
                              setSelectedConversation(updatedConv);
                            }
                          }
                        } catch (error) {
                          console.error('Error toggling mute:', error);
                          toast.error('Failed to update notification settings.');
                        }
                        setShowOptionsMenu(false);
                      }}
                      className="flex items-center gap-2 w-full p-3 text-left hover:bg-gray-50"
                    >
                      <BellOff size={16} />
                      <span>
                        {(selectedConversation?.mutedBy || []).includes(currentUser?.uid)
                          ? 'Unmute Notifications'
                          : 'Mute Notifications'
                        }
                      </span>
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xl ${message.isCurrentUser
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-none'
                  : isOfficialAnnouncement(message)
                    ? message.senderRole === 'admin'
                      ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 text-gray-900 rounded-xl rounded-tl-none shadow-md'
                      : 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 text-gray-900 rounded-xl rounded-tl-none shadow-md'
                    : message.senderRole === 'admin'
                      ? 'bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-l-purple-500 text-gray-900 rounded-xl rounded-tl-none shadow-sm'
                      : message.senderRole === 'event_society'
                        ? 'bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-l-green-500 text-gray-900 rounded-xl rounded-tl-none shadow-sm'
                        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none'
                  } p-4 shadow-sm relative`}
                >
                  {!message.isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => {
                          // Get the other user ID from the conversation participants
                          const otherUserId = selectedConversation?.participants?.find(id => id !== currentUser?.uid);
                          if (otherUserId) {
                            navigate(`/profile/${otherUserId}`);
                          }
                        }}
                        className="font-semibold hover:text-blue-600 hover:underline transition-colors"
                      >
                        {message.senderName}
                      </button>
                      {message.senderRole && message.senderRole !== 'student' && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full flex items-center gap-0.5 ${getRoleBadge(message.senderRole).class}`}>
                          {getRoleBadge(message.senderRole).icon}
                          {getRoleBadge(message.senderRole).text}
                        </span>
                      )}
                    </div>
                  )}
                  {/* OFFICIAL ANNOUNCEMENT BADGE */}
                  {isOfficialAnnouncement(message) && (
                    <div className="absolute -top-2 -left-2">
                      <div className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${message.senderRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                        📢 OFFICIAL
                      </div>
                    </div>
                  )}
                  {message.text.startsWith('[IMAGE] ') ? (
                    <div className="mb-2">
                      <img
                        src={message.text.replace('[IMAGE] ', '')}
                        alt="Shared image"
                        className="max-w-full max-h-64 rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">📷 Image</p>
                    </div>
                  ) : message.text.startsWith('[FILE] ') ? (
                    <div className="mb-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Paperclip size={16} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">
                            {message.text.split(' - ')[0].replace('[FILE] ', '')}
                          </p>
                          <p className="text-xs text-blue-600">File attachment</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mb-2 break-words whitespace-pre-wrap">{message.text}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span className={message.isCurrentUser ? 'text-blue-200' : 'text-gray-500'}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.isCurrentUser && (
                      message.read ? (
                        <CheckCheck size={12} className="text-blue-200" />
                      ) : (
                        <Check size={12} className="text-blue-200" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 relative">
              {/* File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer block"
                  title="Attach file"
                >
                  <Paperclip size={20} className="text-gray-600" />
                </label>
              </div>

              {/* Image Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <label
                  htmlFor="image-upload"
                  className={`p-3 hover:bg-gray-100 rounded-xl cursor-pointer block ${uploadingImage ? 'opacity-50' : ''}`}
                  title="Send image"
                  disabled={uploadingImage}
                >
                  <ImageIcon size={20} className="text-gray-600" />
                  {uploadingImage && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </label>
              </div>

              {/* Message Input */}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />

              {/* Emoji Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 hover:bg-gray-100 rounded-xl emoji-container"
                  title="Add emoji"
                >
                  <Smile size={20} className="text-gray-600" />
                </button>

                {/* Simple Emoji Picker (would need emoji-mart library for full feature) */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-10 w-48 h-48 overflow-y-auto emoji-container">
                    <div className="grid grid-cols-6 gap-1">
                      {['😀', '😊', '😂', '❤️', '👍', '🔥', '🎉', '🤔', '😎', '🙏', '💯', '👋'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleEmojiSelect({ native: emoji })}
                          className="text-2xl hover:bg-gray-100 rounded p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-xs text-gray-500 mt-2 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={20} />
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={12} />
              <span>End-to-end encrypted</span>
            </div>
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex-1 bg-white rounded-2xl shadow-card border border-gray-200 flex flex-col items-center justify-center p-8">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-8">
          <MessageSquare className="text-blue-500" size={56} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to CampusXchange Chat</h3>
        <p className="text-gray-600 text-center max-w-md mb-8">
          Your secure messaging hub for campus buying, selling, and connections.
          Start chatting with sellers, buyers, or search for users.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search size={20} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900">Search Users</h4>
            </div>
            <p className="text-sm text-blue-700">
              Find users by name, email, or public ID to start a conversation
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="text-green-600 font-bold">M</div>
              </div>
              <h4 className="font-semibold text-green-900">Marketplace Chats</h4>
            </div>
            <p className="text-sm text-green-700">
              Message sellers directly from item listings in marketplace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield size={16} />
          <span>End-to-end encrypted • Campus-only network</span>
        </div>
      </div>
    )
  }

  {/* Block User Modal */ }
  {
    showBlockModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Block User</h2>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                {selectedConversation?.otherUser?.avatar ? (
                  <img
                    src={selectedConversation.otherUser.avatar}
                    alt={selectedConversation.otherUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {selectedConversation?.otherUser?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {selectedConversation?.otherUser?.name || 'Unknown User'}
                </h3>
                <p className="text-sm text-gray-600">NFSU Student</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Ban size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">What happens when you block someone?</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• They can no longer send you messages</li>
                      <li>• You won't receive notifications from them</li>
                      <li>• They won't be notified that you blocked them</li>
                      <li>• You can unblock them anytime from settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUser}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700"
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  {/* Call/Voice Demo Overlay */ }
  {
    (isCalling || isVideoCalling) && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
            {isCalling ? (
              <Phone size={32} className="text-white" />
            ) : (
              <Video size={32} className="text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {isCalling ? 'Voice Call' : 'Video Call'}
          </h3>
          <p className="text-gray-600 mb-6">
            Calling {selectedConversation?.otherUser?.name || 'user'}...
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setIsCalling(false);
                setIsVideoCalling(false);
              }}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700"
            >
              End Call
            </button>
            <button
              onClick={() => {
                setIsCalling(false);
                setIsVideoCalling(false);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  {/* Role System Info Panel (Visible to Admins and Event Societies) */ }
  {
    (userData?.role === 'admin' || userData?.role === 'event_society') && (
      <div className="fixed bottom-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className={userData?.role === 'admin' ? 'text-purple-600' : 'text-green-600'} />
            <span className="text-sm font-semibold text-gray-900">
              {userData?.role === 'admin' ? 'Admin' : 'Event Society'} System Active
            </span>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Role badges displayed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Official announcement tags</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Role-based messaging</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Analytics tracking</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
    </div >

  );
};

export default Chat;