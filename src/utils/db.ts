// Mock implementation for client-side
export const createPool = () => {
  console.log('Mock pool created');
  return {
    execute: async () => Promise.resolve([]),
    end: async () => Promise.resolve()
  };
};

export const initDatabase = async () => {
  console.log('Mock database initialized');
  return Promise.resolve();
};