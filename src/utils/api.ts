const API_URL = 'http://localhost:3000/api';

export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  getMessages: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch messages:', await response.text());
      return []; // Return empty array instead of throwing
    }
    
    return response.json();
  },

  sendMessage: async (content: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      console.error('Failed to send message:', await response.text());
      return null; // Return null instead of throwing
    }
    
    return response.json();
  },

  updateMessageStatus: async (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/${messageId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      console.error('Failed to update message status:', await response.text());
      return false;
    }
    
    return response.json();
  },

  addReaction: async (messageId: string, reaction: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/${messageId}/react`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reaction }),
    });
    
    if (!response.ok) {
      console.error('Failed to add reaction:', await response.text());
      return false;
    }
    
    return response.json();
  },
};