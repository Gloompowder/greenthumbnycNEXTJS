import React from 'react';
import Link from 'next/link';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleHighlight}>Discover</span> New York's 
            <br />Community Gardens
          </h1>
          <div className={styles.heroIllustration} aria-hidden="true"></div>
        </div>
      </header>

      <main className={styles.contentWrapper}>
      <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Our Mission</h2>
            <p className={styles.ctaText}>
              Connecting New Yorkers with urban green spaces through community and collaboration
            </p>
            <div className={styles.ctaFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureBadge}>🌱</span>
                Promote Sustainability
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureBadge}>🤝</span>
                Build Community
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureBadge}>🏙️</span>
                Support Urban Ecosystems
              </div>
            </div>
          </div>
        </section>
        <section className={styles.cardSection}>
          <div className={styles.infoCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
              <span className={styles.titleIcon}>⚠️</span>Important Notice
              </h2>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.cardText}>
                This independent platform is not affiliated with GreenThumbNYC. 
                We provide resources but don't you track these visits for your own reference.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.gridSection}>
          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>🗺️</div>
            <h3 className={styles.featureTitle}>Garden Programs</h3>
            <div className={styles.linkGroup}>
              <Link href="https://greenthumb.nycgovparks.org/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                GreenThumb Map
                <span className={styles.linkArrow}>→</span>
              </Link>
              <Link href="https://596acres.org/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                596 Acres Land Finder
                <span className={styles.linkArrow}>→</span>
              </Link>
              <Link href="http://nyccgc.org/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Garden Coalition
                <span className={styles.linkArrow}>→</span>
              </Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>🌿</div>
            <h3 className={styles.featureTitle}>Local Support</h3>
            <div className={styles.linkGroup}>
              <Link href="https://www.brooklyngrangefarm.com/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Brooklyn Grange
                <span className={styles.linkArrow}>→</span>
              </Link>
              <Link href="https://queensfarm.org/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Queens Farm Museum
                <span className={styles.linkArrow}>→</span>
              </Link>
              <Link href="https://www.nybg.org/gardens/bronx-green-up/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Bronx Green-Up
                <span className={styles.linkArrow}>→</span>
              </Link>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.cardIcon}>💰</div>
            <h3 className={styles.featureTitle}>Funding & Tools</h3>
              <div className={styles.featureBadge}>
              <Link href="https://www.tpl.org/our-work/new-york" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Trust for Public Land
                <span className={styles.linkArrow}>→</span>
              </Link>
              </div>
              <div className={styles.featureBadge}>
              <Link href="https://www.greenrelieffund.org/" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                Green Relief Fund
                <span className={styles.linkArrow}>→</span>
              </Link>
              </div>
              <div className={styles.featureBadge}>
              <Link href="https://www.ioby.org/newyorkcity" target='_blank' referrerPolicy='no-referrer' className={styles.featureLink}>
                ioby Crowdfunding
                <span className={styles.linkArrow}>→</span>
              </Link>
              </div>
            </div>
        </section>
        <section className={styles.featureCard}>
  <h3 className={styles.featureTitle}>Developer Credits</h3>
  <div className={styles.developerInfo}>
    <p className={styles.developerBio}>
      Developed by <strong>William Lin</strong>, a dedicated Full-Stack Developer based in New York City. With a passion for urban sustainability and community innovation, John created this platform to connect New Yorkers with local green spaces.
    </p>
    <div className={styles.ctaFeatures}>
      <a href="https://willportfolio.vercel.app/" target="_blank" referrerPolicy='noreferrer noopener'>
      <div className={styles.featureItem}>
                <span className={styles.featureBadge}></span>
                Portfolio
              </div>
      </a>
      <a href="https://linkedin.com/in/wl96" target="_blank" referrerPolicy='noreferrer noopener'>
      <div className={styles.featureItem}>
                <span className={styles.featureBadge}></span>
                LinkedIn
              </div>
      </a>
      <a href="mailto:itswilllin@gmail.com" target="_blank" referrerPolicy='=noreferrer noopener"'>
      <div className={styles.featureItem}>
                <span className={styles.featureBadge}></span>
                Email
              </div>
      </a>
    </div>
    </div>
</section>
      </main>
    </div>
  );
};

export default About;