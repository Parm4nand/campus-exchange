import React, { useState } from 'react';
import { Shield, Users, ShoppingBag, AlertTriangle, BarChart3, Settings, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: 'primary' },
    { label: 'Active Listings', value: '342', change: '+8%', icon: ShoppingBag, color: 'success' },
    { label: 'Pending Reports', value: '18', change: '-3%', icon: AlertTriangle, color: 'warning' },
    { label: 'Revenue Today', value: '$2,450', change: '+24%', icon: BarChart3, color: 'primary' }
  ];

  const recentReports = [
    { id: '1', user: 'John Doe', type: 'Inappropriate Content', status: 'pending', date: '2 hours ago' },
    { id: '2', user: 'Sarah Chen', type: 'Fake Item', status: 'resolved', date: '5 hours ago' },
    { id: '3', user: 'Mike Ross', type: 'Spam', status: 'pending', date: '1 day ago' },
    { id: '4', user: 'Emma Wilson', type: 'Payment Issue', status: 'investigating', date: '2 days ago' }
  ];

  const recentUsers = [
    { id: '1', name: 'Alex Johnson', email: 'alex@nfsu.edu', joinDate: 'Today', status: 'active', verified: true },
    { id: '2', name: 'Priya Sharma', email: 'priya@nfsu.edu', joinDate: 'Yesterday', status: 'active', verified: true },
    { id: '3', name: 'David Lee', email: 'david@nfsu.edu', joinDate: '2 days ago', status: 'pending', verified: false },
    { id: '4', name: 'Carol White', email: 'carol@nfsu.edu', joinDate: '3 days ago', status: 'active', verified: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50 pb-24 blue-theme">
      {/* Hero Header */}
      <div className="bg-gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Admin Dashboard</h1>
              <p className="text-white/90 text-xl">Manage campus marketplace operations</p>
            </div>
            <div className="hidden md:block">
              <Shield className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {['overview', 'users', 'listings', 'reports', 'analytics', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-dark">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${
                  stat.color === 'primary' ? 'bg-primary-50' :
                  stat.color === 'success' ? 'bg-emerald-50' :
                  'bg-amber-50'
                } flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'primary' ? 'text-primary' :
                    stat.color === 'success' ? 'text-emerald-600' :
                    'text-amber-600'
                  }`} />
                </div>
              </div>
              <div className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-success' : 'text-error'
              }`}>
                {stat.change} from last week
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark">Recent Reports</h2>
                <button className="btn-secondary text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-3 hover:bg-primary-50 rounded-xl transition-colors">
                    <div>
                      <p className="font-medium text-dark">{report.user}</p>
                      <p className="text-sm text-gray-600">{report.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-sm text-gray-500">{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 btn-secondary">View All Reports</button>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark">Recent Users</h2>
                <button className="btn-secondary text-sm">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-primary-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-dark">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        {user.verified ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={user.verified ? 'text-success' : 'text-amber-600'}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{user.joinDate}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 btn-primary">Approve Users</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">System Settings</h3>
                <p className="text-sm text-gray-600">Configure platform settings</p>
              </div>
            </div>
            <button className="btn-secondary w-full">Configure</button>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-dark">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed analytics</p>
              </div>
            </div>
            <button className="btn-secondary w-full">View Analytics</button>
          </div>
          
          <div className="card-blue p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Admin Tools</h3>
                <p className="text-white/80 text-sm">Advanced administration tools</p>
              </div>
            </div>
            <button className="btn-white w-full">Access Tools</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
