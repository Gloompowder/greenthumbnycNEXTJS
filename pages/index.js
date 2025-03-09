import styles from '../styles/Landing.module.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Discover Urban Gardens in
              <span className={styles.highlight}> Your City</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with local green spaces, join community gardening projects, and grow together
            </p>
            <div className={styles.ctaContainer}>
              <a href="/gardens">
                <button className={styles.primaryCta}>
                  Explore Gardens
                </button>
              </a>
              <a href= "/about">
                <button className={styles.secondaryCta}>
                  Learn More
                </button>
              </a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.gradientCircle}></div>
            <div className={styles.leafPattern}></div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Welcome to GreenthumbNYC</h2>
        <div className={styles.featuresGrid}>
        <Link href='/gardens'>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌍</div>
            <h3>Local Garden Map</h3>
            <p>Interactive map showing all community gardens in your area</p>
          </div>
          </Link>
          <Link href="https://www.nycgovparks.org/events/greenthumb" target="_blank" rel="noopener noreferrer">
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📆</div>
            <h3>Event Calendar</h3>
            <p>Never miss a gardening workshop or volunteer opportunity</p>
          </div>
          </Link>
          <Link href="https://plants.usda.gov/" target="_blank" rel="noopener noreferrer">
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌿</div>
            <h3>Plant Library</h3>
            <p>Comprehensive database for all-things plants in the US</p>
          </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>500+</div>
          <div className={styles.statLabel}>Community Gardens</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>10K+</div>
          <div className={styles.statLabel}>Active Gardeners</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>Monthly Events</div>
        </div>
      </section>
    </div>
  );
}