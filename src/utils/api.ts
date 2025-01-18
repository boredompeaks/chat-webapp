// In production, this should be your deployed API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login...', { email });
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        console.error('Login failed:', await response.text());
        return null;
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration...', { username, email });
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (!response.ok) {
        console.error('Registration failed:', await response.text());
        return null;
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },

  getMessages: async () => {
    try {
      console.log('Fetching messages...');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch messages:', await response.text());
        return [];
      }
      
      const data = await response.json();
      console.log('Messages fetched:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  sendMessage: async (content: string) => {
    try {
      console.log('Sending message:', content);
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
        return null;
      }
      
      const data = await response.json();
      console.log('Message sent:', data);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  updateMessageStatus: async (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    try {
      console.log('Updating message status:', { messageId, status });
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
      
      const data = await response.json();
      console.log('Status updated:', data);
      return data;
    } catch (error) {
      console.error('Error updating message status:', error);
      return false;
    }
  },

  addReaction: async (messageId: string, reaction: string) => {
    try {
      console.log('Adding reaction:', { messageId, reaction });
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
      
      const data = await response.json();
      console.log('Reaction added:', data);
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  },
};