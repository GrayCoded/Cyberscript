import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    define: {
      'process.env.REACT_APP_AUTH0_DOMAIN': JSON.stringify(
        process.env.REACT_APP_AUTH0_DOMAIN
      ),
      'process.env.REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(
        process.env.REACT_APP_AUTH0_CLIENT_ID
      ),
    },
    plugins: [react()],
  };
});
