'use client'
import React from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'

const Navbar = () => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav>
    <div className={styles.navbar}>
      <h1 className={styles.logo}>
        <Link href="/">GreenthumbNYC</Link>
      </h1>
      <div className={styles.navbarLinks}>
        <Link href="/gardens">garden</Link>
        <Link href="/contact">contact</Link>
        {isAuthenticated? 
          <Link href="/dashboard">dashboard</Link>:
          ''
        }
        <Link href="/about">About</Link>
        {isAuthenticated ? (
          <>
                            <Link href="account">Account</Link>
                  <button className={styles.navButton}onClick={logout}>Logout</button>
          </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
      </div>
    </div>
    </nav>
  )
}

export default Navbar