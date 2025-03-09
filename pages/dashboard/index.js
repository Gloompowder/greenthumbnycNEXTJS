import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const Dashboard = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        console.log("jwtToken:", localStorage.getItem('jwtToken'));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/visits`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
            'Content-Type': 'application/json'
          }
        });        
        
        if (!response.ok) throw new Error('Failed to fetch visits');
        
        const data = await response.json();
        setVisits(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVisits();
  }, []);

  const hasVisits = visits.length > 0;
  const upcomingVisits = visits.filter(visit => 
    new Date(visit.scheduled_at) > new Date()
  );
  const pastVisits = visits.filter(visit => 
    new Date(visit.scheduled_at) <= new Date()
  );

  const renderEmptyState = () => (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateContent}>
        <FiMapPin className={styles.emptyStateIcon} />
        <h3>No Visits Planned Yet</h3>
        <p>Start exploring community gardens by scheduling your first visit!</p>
        <Link href="/gardens" className={styles.ctaButton}>
          Browse Gardens
          <FiArrowRight className={styles.ctaIcon} />
        </Link>
      </div>
    </div>
  );

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.visitsCard}>
        {!hasVisits ? renderEmptyState() : (
          <>
            <div className={styles.visitsSection}>
              <h2 className={styles.cardTitle}>
                <FiClock className={styles.cardIcon} />
                Upcoming Visits
              </h2>
              {upcomingVisits.length > 0 ? (
                upcomingVisits.map(visit => (
                  <div key={`upcoming-${visit.id}`} className={styles.visitItem}>
                    <div className={styles.visitInfo}>
                      <h3>{visit.garden?.gardenname || 'Unknown Garden'}</h3>
                      <p>{formatDate(visit.scheduled_at)}</p>
                      <span className={styles.durationBadge}>
                        {visit.duration} minutes
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptySection}>
                  <p>No upcoming visits scheduled</p>
                  <Link href="/gardens" className={styles.inlineCta}>
                    Schedule a visit
                  </Link>
                </div>
              )}
            </div>

            <div className={styles.visitsSection}>
              <h2 className={styles.cardTitle}>
                <FiClock className={styles.cardIcon} />
                Past Visits
              </h2>
              {pastVisits.length > 0 ? (
                pastVisits.map(visit => (
                  <div key={`past-${visit.id}`} className={styles.visitItem}>
                    <div className={styles.visitInfo}>
                      <h3>{visit.garden?.gardenname || 'Unknown Garden'}</h3>
                      <p>{formatDate(visit.scheduled_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptySection}>
                  <p>No past visits recorded</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;