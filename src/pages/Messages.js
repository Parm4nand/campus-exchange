import React, { useState } from 'react';
import { Search, Filter, Send, Paperclip, Smile, MoreVertical, Check, CheckCheck, Clock, Phone, Video, UserPlus, Archive, Trash2 } from 'lucide-react';

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState('1');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const mockChats = [
    {
      id: '1',
      user: {
        name: 'Alice Johnson',
        avatar: 'AJ',
        status: 'online',
        lastSeen: '2 min ago'
      },
      lastMessage: 'The textbook is still available. When would you like to meet?',
      timestamp: '10:30 AM',
      unread: 3,
      item: 'Calculus Textbook'
    },
    {
      id: '2',
      user: {
        name: 'Bob Smith',
        avatar: 'BS',
        status: 'offline',
        lastSeen: '2 hours ago'
      },
      lastMessage: 'Can you send more photos of the laptop?',
      timestamp: 'Yesterday',
      unread: 0,
      item: 'Gaming Laptop'
    },
    {
      id: '3',
      user: {
        name: 'Carol White',
        avatar: 'CW',
        status: 'online',
        lastSeen: 'now'
      },
      lastMessage: 'Thanks for the quick response!',
      timestamp: '9:45 AM',
      unread: 1,
      item: 'Winter Jacket'
    },
    {
      id: '4',
      user: {
        name: 'David Lee',
        avatar: 'DL',
        status: 'offline',
        lastSeen: '5 hours ago'
      },
      lastMessage: 'Is the price negotiable?',
      timestamp: 'Mar 10',
      unread: 0,
      item: 'Study Desk'
    },
    {
      id: '5',
      user: {
        name: 'Emma Wilson',
        avatar: 'EW',
        status: 'online',
        lastSeen: '30 min ago'
      },
      lastMessage: 'I can meet tomorrow at 3 PM',
      timestamp: 'Mar 9',
      unread: 0,
      item: 'Bicycle'
    }
  ];

  const mockMessages = [
    {
      id: '1',
      text: 'Hi, I\'m interested in your Calculus textbook. Is it still available?',
      sender: 'me',
      timestamp: '10:15 AM',
      read: true
    },
    {
      id: '2',
      text: 'Yes, it\'s still available! It\'s in excellent condition.',
      sender: 'alice',
      timestamp: '10:20 AM',
      read: true
    },
    {
      id: '3',
      text: 'Great! Can I see some more pictures?',
      sender: 'me',
      timestamp: '10:22 AM',
      read: true
    },
    {
      id: '4',
      text: 'Sure, I\'ll send them right away.',
      sender: 'alice',
      timestamp: '10:25 AM',
      read: true
    },
    {
      id: '5',
      text: 'The textbook is still available. When would you like to meet?',
      sender: 'alice',
      timestamp: '10:30 AM',
      read: false
    }
  ];

  const activeChatData = mockChats.find(chat => chat.id === activeChat);
  const filteredChats = mockChats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Messages</h1>
              <p className="text-white/90 text-xl">Connect with buyers and sellers on campus</p>
            </div>
            <div className="hidden md:block">
              <Send className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Chat List */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6 blue-glow">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="input-field pl-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-dark">Recent Chats</h2>
                <button className="btn-secondary text-sm px-3 py-1.5">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-primary-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {chat.user.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          chat.user.status === 'online' ? 'bg-success' : 'bg-gray-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-dark truncate">{chat.user.name}</h3>
                          <span className="text-xs text-gray-500">{chat.timestamp}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            <span className="font-medium text-primary">{chat.item}: </span>
                            {chat.lastMessage}
                          </p>
                          
                          {chat.unread > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${
                            chat.user.status === 'online' ? 'text-success' : 'text-gray-500'
                          }`}>
                            {chat.user.status === 'online' ? 'Online' : `Last seen ${chat.user.lastSeen}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Unread</p>
                  <p className="text-2xl font-bold text-dark">4</p>
                </div>
              </div>
              <div className="card p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">Active Chats</p>
                  <p className="text-2xl font-bold text-dark">{mockChats.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Window */}
          <div className="lg:col-span-2">
            <div className="card h-full flex flex-col">
              {/* Chat Header */}
              {activeChatData && (
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {activeChatData.user.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          activeChatData.user.status === 'online' ? 'bg-success' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark">{activeChatData.user.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`${activeChatData.user.status === 'online' ? 'text-success' : 'text-gray-500'}`}>
                            {activeChatData.user.status === 'online' ? 'Online' : `Last seen ${activeChatData.user.lastSeen}`}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-primary font-medium">{activeChatData.item}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeChatData ? (
                  <div className="space-y-4">
                    {mockMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-lg ${msg.sender === 'me' ? 'text-right' : ''}`}>
                          <div
                            className={`inline-block px-4 py-3 rounded-2xl ${
                              msg.sender === 'me'
                                ? 'bg-primary text-white rounded-br-sm'
                                : 'bg-primary-50 text-dark rounded-bl-sm'
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${
                            msg.sender === 'me' ? 'justify-end text-gray-500' : 'text-gray-500'
                          }`}>
                            <span>{msg.timestamp}</span>
                            {msg.sender === 'me' && (
                              <span>
                                {msg.read ? (
                                  <CheckCheck className="w-3 h-3 text-primary inline ml-1" />
                                ) : (
                                  <Check className="w-3 h-3 text-gray-400 inline ml-1" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    <div className="flex justify-start">
                      <div className="bg-primary-50 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6">
                      <Send className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-dark mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              {activeChatData && (
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        rows={2}
                        className="input-field resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button type="button" className="p-2 hover:bg-primary-50 rounded-lg">
                            <Paperclip className="w-4 h-4 text-primary" />
                          </button>
                          <button type="button" className="p-2 hover:bg-primary-50 rounded-lg">
                            <Smile className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Press Enter to send, Shift+Enter for new line
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn-primary px-6 py-3"
                      disabled={!message.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Start New Chat</h3>
                <p className="text-sm text-gray-600">Connect with other users</p>
              </div>
            </div>
            <button className="btn-secondary w-full">New Message</button>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Archive className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Archived Chats</h3>
                <p className="text-sm text-gray-600">12 archived conversations</p>
              </div>
            </div>
            <button className="btn-secondary w-full">View Archive</button>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Clear Old Messages</h3>
                <p className="text-sm text-gray-600">Free up storage space</p>
              </div>
            </div>
            <button className="btn-secondary w-full">Clean Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
