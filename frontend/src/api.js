import axios from 'axios';

// Configure API client with enhanced error handling
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 8000, // Increased timeout
  headers: {
    'X-API-KEY': import.meta.env.VITE_BACKEND_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Enhanced request interceptor
api.interceptors.request.use(config => {
  console.log(`Sending ${config.method} request to ${config.url}`); // Debug
  return config;
}, error => {
  console.error('Request error:', error); // Debug
  return Promise.reject(error);
});

// Enhanced response interceptor
api.interceptors.response.use(
  response => {
    console.log('Received response:', response.config.url, response.status); // Debug
    return response.data;
  },
  error => {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      backendError: error.response?.data?.detail
    };
    console.error('API Error Details:', errorDetails); // Debug
    
    if (error.response?.status === 403) {
      throw new Error('Authentication failed. Check your API key.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Is the backend running?');
    } else {
      throw new Error(error.response?.data?.detail || 'Backend connection failed');
    }
  }
);

// LLM Service (unchanged from your working version)
export const generateTasksWithAI = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'huggingfaceh4/zephyr-7b-beta:free',
        messages: [{ 
          role: 'user', 
          content: `Generate task list for: ${prompt}. Return as numbered list.` 
        }],
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_LLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('LLM Error:', error);
    throw new Error('Failed to generate tasks');
  }
};

export default api;