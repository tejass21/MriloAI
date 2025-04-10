import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = '413872410004-ut242b478t68vnmj7cqcb9ni4e0e84s1.apps.googleusercontent.com';

interface GoogleAuthProps {
  onSuccess?: () => void;
}

export const GoogleAuth = ({ onSuccess }: GoogleAuthProps) => {
  const { setUser } = useUser();
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        popup_parent_id: 'google-auth-container'
      });

      // Render Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );

      // Add custom styles to the Google button
      const style = document.createElement('style');
      style.textContent = `
        #googleSignInButton > div {
          background-color: #1A1A1A !important;
          border: 1px solid #2A2A2A !important;
          border-radius: 0.5rem !important;
          transition: all 0.3s ease !important;
        }
        #googleSignInButton > div:hover {
          background-color: #8B5CF6 !important;
          border-color: #8B5CF6 !important;
        }
        #googleSignInButton > div > div {
          padding: 0.5rem !important;
        }
      `;
      document.head.appendChild(style);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    try {
      // Decode the JWT token
      const payload = decodeJwtResponse(response.credential);
      
      // Generate initials from name
      const userName = payload.name || '';
      const initials = userName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      // Set user data in context with proper profile picture URL
      setUser({
        name: userName,
        email: payload.email,
        picture: payload.picture || `https://ui-avatars.com/api/?name=${initials || 'U'}&background=8B5CF6&color=fff&bold=true&length=2&rounded=true`
      });

      // Call onSuccess callback to close modal
      onSuccess?.();
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  // Function to decode JWT token
  const decodeJwtResponse = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  return (
    <div id="google-auth-container" className="relative">
      <div id="googleSignInButton" className="w-full flex justify-center"></div>
    </div>
  );
}; 