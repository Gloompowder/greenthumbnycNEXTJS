import { useState, useEffect } from 'react';
import Layouts from '@/layout/Layouts';
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [gardens, setGardens] = useState(null);
  const [error, setError] = useState(null); // 👈 Added error state

  useEffect(() => {
    setHasMounted(true);
    
    if (typeof window !== 'undefined') {
      const fetchGardens = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/gardens`);
          
          // 👇 Check for HTTP errors
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          setGardens(data);
          setError(null); // Clear any previous errors
        } catch (error) {
          console.error("Error fetching gardens:", error);
          setError(error.message || 'Failed to load gardens'); // 👈 Set error message
          setGardens([]); // Fallback to empty array
        }
      };

      // 👇 Cleaned up the redundant guard
      fetchGardens();
    }
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <Layouts>
        {/* 👇 Pass error state to components */}
        <Component {...pageProps} gardens={gardens} gardensError={error} />
    </Layouts>
  );
}