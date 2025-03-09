import React from 'react';
import Link from 'next/link';
import styles from './404.module.css'

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.subtitle}>Oops! It seems you've wandered off the garden path...</p>
        
        <Link href="/" className={styles.homeButton}>
          Return to Home
          <svg className={styles.arrowIcon} viewBox="0 0 24 24">
            <path d="M13.5 2.25L21 12l-7.5 9.75M3 12h18" stroke="currentColor" fill="none"/>
          </svg>
        </Link>

        <div className={styles.suggestions}>
          <p>Maybe you were looking for:</p>
          <div className={styles.links}>
            <Link href="/gardens">Explore Gardens</Link>
            <Link href="/login">Login</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;