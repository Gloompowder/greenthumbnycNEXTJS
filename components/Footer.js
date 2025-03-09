import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/gardens" className={styles.link}>Gardens</Link>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
        </nav>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Garden App. Made with ♥ in NYC
        </p>
      </div>
    </footer>
  );
}
