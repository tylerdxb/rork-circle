export const interests = [
  { id: '1', name: 'Business' },
  { id: '2', name: 'Fitness' },
  { id: '3', name: 'Coffee' },
  { id: '4', name: 'Travel' },
  { id: '5', name: 'Tech' },
  { id: '6', name: 'Art' },
  { id: '7', name: 'Finance' },
  { id: '8', name: 'Startups' },
  { id: '9', name: 'Investing' },
  { id: '10', name: 'Design' },
  { id: '11', name: 'Marketing' },
  { id: '12', name: 'Music' },
  { id: '13', name: 'Food' },
  { id: '14', name: 'Books' },
  { id: '15', name: 'Photography' },
];

export const intents = [
  { id: '1', name: 'Friendship' },
  { id: '2', name: 'Business Collaboration' },
  { id: '3', name: 'Accountability' },
  { id: '4', name: 'Social Circle' },
  { id: '5', name: 'Mentorship' },
  { id: '6', name: 'Investment' },
  { id: '7', name: 'Co-founding' },
];

export const prompts = [
  { id: '1', text: "My perfect Saturday is..." },
  { id: '2', text: "People say I'm..." },
  { id: '3', text: "I get excited about..." },
  { id: '4', text: "A life-changing book for me was..." },
  { id: '5', text: "My superpower is..." },
  { id: '6', text: "I'm currently learning..." },
  { id: '7', text: "A controversial opinion I have is..." },
  { id: '8', text: "My next big goal is..." },
];

export const cities = [
  { id: '1', name: 'Dubai' },
  { id: '2', name: 'London' },
  { id: '3', name: 'New York' },
  { id: '4', name: 'San Francisco' },
  { id: '5', name: 'Singapore' },
  { id: '6', name: 'Berlin' },
  { id: '7', name: 'Tokyo' },
  { id: '8', name: 'Los Angeles' },
  { id: '9', name: 'Miami' },
  { id: '10', name: 'Austin' },
];

export const mockUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    headline: 'Founder & CEO at TechVenture',
    location: 'San Francisco',
    bio: 'Building the future of fintech. Previously at Google and Y Combinator. Love hiking and specialty coffee.',
    interests: ['5', '8', '9', '3'],
    intents: ['2', '6', '7'],
    prompts: [
      { promptId: '1', answer: 'A morning hike followed by brunch with friends and an evening of reading or working on side projects.' },
      { promptId: '5', answer: 'Connecting people and ideas that should meet each other.' }
    ],
    verified: true,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    headline: 'Product Designer & Angel Investor',
    location: 'New York',
    bio: 'Designing products people love. Angel investor in 15+ startups. Always looking to connect with fellow creators.',
    interests: ['10', '5', '8', '12'],
    intents: ['1', '2', '6'],
    prompts: [
      { promptId: '3', answer: 'Beautiful design, emerging technologies, and finding ways to make the world more creative.' },
      { promptId: '6', answer: 'Arabic and the fundamentals of quantum computing.' }
    ],
    verified: true,
  },
  {
    id: '3',
    name: 'Maya Johnson',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    headline: 'VC Partner at Horizon Capital',
    location: 'London',
    bio: 'Investing in climate tech and future of work startups. Former operator turned investor. Marathon runner.',
    interests: ['9', '5', '2', '14'],
    intents: ['2', '5', '6'],
    prompts: [
      { promptId: '4', answer: '"Thinking in Systems" by Donella Meadows - changed how I view problems and solutions.' },
      { promptId: '8', answer: 'To run an ultra-marathon and invest in 50 female-founded startups.' }
    ],
    verified: true,
  },
  {
    id: '4',
    name: 'Omar Patel',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    headline: 'Serial Entrepreneur & Web3 Builder',
    location: 'Dubai',
    bio: 'Built and sold 3 companies. Currently exploring the intersection of AI and blockchain. Avid traveler.',
    interests: ['5', '8', '4', '7'],
    intents: ['2', '7', '3'],
    prompts: [
      { promptId: '2', answer: 'Intensely curious, occasionally impulsive, and always ready to take calculated risks.' },
      { promptId: '7', answer: 'Most business meetings could be emails, and most emails could be avoided altogether.' }
    ],
    verified: true,
  },
  {
    id: '5',
    name: 'Leila Wong',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    headline: 'Creative Director & Brand Strategist',
    location: 'Singapore',
    bio: 'Helping brands tell authentic stories. Worked with Nike, Airbnb, and local startups. Passionate about sustainable fashion.',
    interests: ['10', '6', '15', '13'],
    intents: ['1', '2', '4'],
    prompts: [
      { promptId: '3', answer: 'The intersection of art, technology, and sustainability. And really good dumplings.' },
      { promptId: '5', answer: 'Seeing patterns and connections that others miss, especially in visual storytelling.' }
    ],
    verified: true,
  },
];

export const mockChats = [
  {
    id: '1',
    participants: ['1', '2'],
    messages: [
      {
        id: '1',
        senderId: '2',
        text: "Hi Sarah, I really enjoyed your thoughts on the future of fintech. Would you be open to grabbing coffee next week to discuss potential collaborations?",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        senderId: '1',
        text: "Hey Alex! Absolutely, I'd love to connect. How about Wednesday at Blue Bottle on Market St?",
        timestamp: new Date(Date.now() - 82800000).toISOString(),
      },
      {
        id: '3',
        senderId: '2',
        text: "Wednesday works perfectly. 10am at Blue Bottle it is! Looking forward to it.",
        timestamp: new Date(Date.now() - 79200000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    participants: ['1', '3'],
    messages: [
      {
        id: '1',
        senderId: '3',
        text: "Sarah, I've been following your company's progress. Very impressive growth! I'd love to discuss potential investment opportunities.",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '2',
        senderId: '1',
        text: "Thanks Maya! We're actually planning our Series B right now. Would love to chat more about this. Are you free for a call this Friday?",
        timestamp: new Date(Date.now() - 169200000).toISOString(),
      },
    ],
  },
];

export const mockConnections = [
  {
    userId: '1',
    connections: ['2', '3'],
    pending: ['4'],
    received: ['5'],
  }
];