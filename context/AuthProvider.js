'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  const handleAuthResponse = useCallback(async (response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP Error: ${response.status}`
      }));
      return { 
        success: false, 
        error: errorData.error || errorData.message || 'Request failed'
      };
    }
    const data = await response.json();
    // Attach success:true to the data if response is OK.
    return { success: true, ...data };
  }, []);
  

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        setLoading(false)
        router.push('/login')
        return
      }

      const response = await fetch(`${API_BASE}/api/v1/current_user`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const { user: userData } = await response.json()
        setUser(userData)
      } else if (response.status === 401) {
        localStorage.removeItem('jwtToken')
        setUser(null)
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }, [API_BASE, router])

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/logout`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        console.error("Logout request failed:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("jwtToken");
      setUser(null);
      router.push("/login");
    }
  };
  
  // const refreshToken = useCallback(async () => {
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     if (!token) return false;
  
  //     const response = await fetch(`${API_BASE}/api/v1/refresh_token`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     if (response.ok) {
  //       const { token: newToken } = await response.json();
  //       localStorage.setItem("jwtToken", newToken);
  //       return true;
  //     } else if (response.status === 401 || response.status === 403) {
  //       console.warn("Session expired, logging out.");
  //       logout(); // Force user logout on token failure
  //       return false;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error("Token refresh failed:", error);
  //     return false;
  //   }
  // }, [API_BASE, logout]);
  

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus()
      
      const interval = setInterval(async () => {
        if (localStorage.getItem('jwtToken')) {
          await refreshToken()
        }
      }, 300000) // 5 minutes

      return () => clearInterval(interval)
    }

    initializeAuth()

    const handleStorageChange = (e) => {
      if (e.key === 'jwtToken') {
        checkAuthStatus()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAuthStatus])

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: userData // Match the backend expectation
        })
      });
  
  
      const result = await handleAuthResponse(response);
      if (!result.success) return result;
  
      localStorage.setItem('jwtToken', result.token || result.jwt_token); // Ensure correct token key
      setUser(result.user);
      router.push('/gardens');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Network error - please check your connection'
      };
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user: { email, password } // Proper nesting
        })
      });
  
      const result = await handleAuthResponse(response);
      if (!result.success) return result;
  
      localStorage.setItem('jwtToken', result.token || result.jwt_token);
      setUser(result.user);
      router.push('/gardens');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed - please try again'
      };
    }
  };
  

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}