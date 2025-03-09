'use client';
import { useEffect, useState } from 'react';
import { FiMapPin, FiClock, FiUsers, FiArrowLeft, FiExternalLink, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../Garden.module.css';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from'../../../context/AuthProvider';
import VisitScheduler from '@/components/VisitScheduler';

const Map = dynamic(
  () => import('@/components/Map'),
  { 
    ssr: false,
    loading: () => <div className={styles.mapPlaceholder}>Loading map...</div>
  }
);

const Garden = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  

  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!id) return;

    const fetchGarden = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_RAILS_API_URL}/api/v1/gardens/${id}`);
        if (!response.ok) throw new Error('Garden not found');
        
        const data = await response.json();
        
        // Parse multipolygon data for coordinates
        if (data.multipolygon) {
          try {
            const polyData = JSON.parse(data.multipolygon);
            const firstCoord = polyData.coordinates[0][0][0];
            setCoordinates([firstCoord[1], firstCoord[0]]); // [lat, lng]
          } catch (e) {
            console.error('Error parsing coordinates:', e);
          }
        }

        setGarden(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGarden();
  }, [id]);

  const getHours = () => {
    if (!garden) return [];
    return [
      { day: 'Monday', hours: garden.openhrsm },
      { day: 'Tuesday', hours: garden.openhrstu },
      { day: 'Wednesday', hours: garden.openhrsw },
      { day: 'Thursday', hours: garden.openhrsth },
      { day: 'Friday', hours: garden.openhrsf },
      { day: 'Saturday', hours: garden.openhrssa },
      { day: 'Sunday', hours: garden.openhrssu }
    ].filter(d => d.hours);
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.loadingSpinner}>🌱</div>
      <p>Loading garden details...</p>
    </div>
  );

  if (error) return (
    <div className={styles.error}>
      <p>{error}</p>
      <Link href="/gardens" className={styles.backButton}>
        <FiArrowLeft /> Back to Gardens
      </Link>
    </div>
  );

  const isGardenOpen = (garden) => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().substring(0, 2);
    const hoursKey = `openhrs${day}`;
    const hours = garden[hoursKey];
    
    if (!hours) return false;
    
    const [openTime, closeTime] = hours.split(' - ').map(time => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || 0));
      return date;
    });
  
    return now >= openTime && now <= closeTime;
  };


  if (!garden) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <FiArrowLeft /> Back to Gardens
        </button>
        <h1 className={styles.title}>{garden.gardenname}</h1>
        
        <div className={styles.metaContainer}>
          <div className={styles.metaItem}>
            <FiMapPin />
            {boroughRender(garden.borough)} (Zip: {garden.zipcode})
          </div>
          <div className={styles.metaItem}>
            <FiUsers />
            Community Board {garden.communityboard}
          </div>
          <div className={styles.metaItem}>
            Status: {garden.status}
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.mainContent}>
        {isAuthenticated ? (
  <section className={styles.mainContent}>
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}><FiCalendar/>Visit Garden</h2>
      <div className={styles.card}>
        <VisitScheduler garden={garden} />
      </div>
    </div>
  </section>
):
<section className={styles.mainContent}>
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}><FiCalendar/>Login or Signup to Schedule Visits</h2>
      <div className={styles.buttonCard}>
        <Link href="/signup" target='_self' className={styles.signupButton}>Signup</Link>
        <Link href="/login" target='_self' className={styles.loginButton}>Login</Link>
      </div>
    </div>
  </section>
}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiMapPin /> Location
            </h2>
            <div className={styles.card}>
              <p className={styles.address}>{garden.address}</p>
              
              {coordinates ? (
                <div className={styles.mapContainer}>
                  <Map
                    coordinates={coordinates}
                    zoom={14}
                    markerText={garden.gardenname}
                  />
                </div>
              ) : (
                <div className={styles.mapPlaceholder}>
                  Map location not available
                </div>
              )}
            </div>
          </div>
        </section>
        

        <aside className={styles.sidebar}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiClock /> Opening Hours
            </h2>
            <div className={styles.card}>
              {getHours().length > 0 ? (
                <div className={styles.hoursList}>
                  {getHours().map((day, index) => (
                    <div key={index} className={styles.hourItem}>
                      <span>{day.day}:</span>
                      <span>{day.hours}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No opening hours available</p>
              )}
            </div>
          </div>
          

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiUsers /> District Information
            </h2>
            <div className={styles.card}>
              <div className={styles.infoItem}>
                <span>Assembly District:</span>
                <span>{garden.assemblydist || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span>Congressional District:</span>
                <span>{garden.congressionaldist || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span>Police Precinct:</span>
                <span>{garden.policeprecinct || 'N/A'}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const boroughRender = (borough) => {
  const boroughMap = {
    'X': 'Bronx',
    'B': 'Brooklyn',
    'M': 'Manhattan',
    'Q': 'Queens',
    'R': 'Staten Island'
  };
  return boroughMap[borough] || borough;
};

export default Garden;