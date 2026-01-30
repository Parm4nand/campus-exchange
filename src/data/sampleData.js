export const itemsData = [
  { 
    id: 1, 
    title: 'Physics Textbook', 
    price: 500, 
    seller: 'John Doe', 
    image: '📚', 
    status: 'approved',
    category: 'books',
    description: 'Physics textbook for first year students. Excellent condition with minimal highlights.',
    campus: 'main'
  },
  { 
    id: 2, 
    title: 'Laptop Stand', 
    price: 1200, 
    seller: 'Sarah Smith', 
    image: '💻', 
    status: 'approved',
    category: 'electronics',
    description: 'Adjustable laptop stand with cooling fan. Perfect for long study sessions.',
    campus: 'main'
  },
  { 
    id: 3, 
    title: 'Study Notes - DSA', 
    price: 300, 
    seller: 'Mike Johnson', 
    image: '📓', 
    status: 'approved',
    category: 'books',
    description: 'Comprehensive Data Structures and Algorithms notes with solved problems.',
    campus: 'north'
  },
  { 
    id: 4, 
    title: 'Study Desk', 
    price: 2500, 
    seller: 'Alex Brown', 
    image: '🪑', 
    status: 'approved',
    category: 'furniture',
    description: 'Wooden study desk with storage. Good condition, needs minor assembly.',
    campus: 'south'
  },
  { 
    id: 5, 
    title: 'Java Programming Book', 
    price: 400, 
    seller: 'Emma Wilson', 
    image: '📘', 
    status: 'approved',
    category: 'books',
    description: 'Complete guide to Java programming with examples and exercises.',
    campus: 'main'
  },
  { 
    id: 6, 
    title: 'Scientific Calculator', 
    price: 800, 
    seller: 'David Lee', 
    image: '🧮', 
    status: 'approved',
    category: 'electronics',
    description: 'Casio scientific calculator with all functions. Like new condition.',
    campus: 'north'
  },
];

export const requestsData = [
  { id: 1, itemTitle: 'Physics Textbook', requesterName: 'Jane Doe', status: 'pending', itemId: 1 },
  { id: 2, itemTitle: 'Laptop Stand', requesterName: 'Alex Brown', status: 'approved', itemId: 2 },
];

export const chatsData = [
  { 
    id: 1, 
    buyerName: 'Jane Doe', 
    sellerName: 'John Doe', 
    itemTitle: 'Physics Textbook', 
    messages: [
      { sender: 'Jane', text: 'Is this still available?' },
      { sender: 'John', text: 'Yes, it is. Interested?' },
    ]
  },
];

export const eventsData = [
  { id: 1, title: 'Campus Book Fair', date: '2025-02-15', location: 'Main Hall', registered: 45 },
  { id: 2, title: 'Study Materials Exchange', date: '2025-02-20', location: 'Library', registered: 32 },
];
