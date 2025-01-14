// Mock implementation for client-side
interface QueryResult {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'image' | 'file' | 'voice';
  created_at: string;
}

export const query = async (sql: string, params?: any[]): Promise<QueryResult[]> => {
  // For development, return mock data
  console.log('Mock query executed:', sql, params);
  
  // Mock messages data
  return [
    {
      id: '1',
      conversation_id: 'default',
      sender_id: localStorage.getItem('userId') || '',
      content: 'Hello! This is a mock message.',
      content_type: 'text',
      created_at: new Date().toISOString()
    }
  ];
};