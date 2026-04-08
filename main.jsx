import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill window.storage for standalone deployment (localStorage-based)
if (!window.storage) {
  window.storage = {
    async get(key) {
      const val = localStorage.getItem(`luma3d_${key}`);
      return val !== null ? { key, value: val, shared: false } : null;
    },
    async set(key, value) {
      localStorage.setItem(`luma3d_${key}`, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(`luma3d_${key}`);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = '') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(`luma3d_${prefix}`)) {
          keys.push(k.replace('luma3d_', ''));
        }
      }
      return { keys, prefix, shared: false };
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
