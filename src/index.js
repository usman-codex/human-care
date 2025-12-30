// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <--- YEH IMPORT ZAROORI HAI

const root = ReactDOM.createRoot(document.getElementById('root'));

// Screenshot wali Client ID yahan paste karni hai
const GOOGLE_CLIENT_ID = "53025212598-hkvaddqcu7iivinl1b34aj8sdpemp392.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
      {/* App ko GoogleOAuthProvider mein lapet (wrap) diya */}
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
  </React.StrictMode>
);