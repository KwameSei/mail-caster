import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GmailAuth = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      axios.post('/api/v1/gmail/code-exchange', { code }, {
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.data.success) {
            console.log('Code exchange successful:', response.data);
          } else {
            console.error('Code exchange failed:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [location]);

  return (
    <div>
      <h1>Gmail Authorization</h1>
      <p>Please wait while we process your authorization...</p>
    </div>
  );
};

export default GmailAuth;
