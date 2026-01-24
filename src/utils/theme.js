export const categoryColors = {
  marketplace: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-600',
    light: 'bg-blue-50',
    gradient: 'from-blue-500 to-indigo-600'
  },
  requests: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'bg-emerald-600',
    light: 'bg-emerald-50',
    gradient: 'from-emerald-500 to-green-600'
  },
  events: {
    bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    accent: 'bg-purple-600',
    light: 'bg-purple-50',
    gradient: 'from-purple-500 to-pink-600'
  },
  messages: {
    bg: 'bg-gradient-to-br from-cyan-50 to-teal-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
    accent: 'bg-cyan-600',
    light: 'bg-cyan-50',
    gradient: 'from-cyan-500 to-teal-600'
  },
  create: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    accent: 'bg-orange-600',
    light: 'bg-orange-50',
    gradient: 'from-orange-500 to-amber-600'
  },
  profile: {
    bg: 'bg-gradient-to-br from-violet-50 to-indigo-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    accent: 'bg-violet-600',
    light: 'bg-violet-50',
    gradient: 'from-violet-500 to-indigo-600'
  },
  admin: {
    bg: 'bg-gradient-to-br from-rose-50 to-red-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    accent: 'bg-rose-600',
    light: 'bg-rose-50',
    gradient: 'from-rose-500 to-red-600'
  }
};

export const getPageTheme = (page) => {
  return categoryColors[page] || categoryColors.marketplace;
};

// Color mapping for product conditions
export const conditionColors = {
  'New': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  'Like New': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Excellent': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
  'Good': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'Fair': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'Other': { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-300' }
};

// Price formatting with color based on value
export const getPriceColor = (price) => {
  if (price >= 1000) return 'text-red-600';
  if (price >= 500) return 'text-orange-600';
  if (price >= 100) return 'text-amber-600';
  if (price >= 50) return 'text-emerald-600';
  return 'text-blue-600';
};

// Status colors for notifications
export const statusColors = {
  success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' },
  error: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'text-rose-600' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' }
};
