// Centralized API configuration for CampusHub Frontend
// Reads VITE_API_URL from environment variables (e.g., set on Vercel)
// Fallback defaults to local backend API URL for local development.

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
