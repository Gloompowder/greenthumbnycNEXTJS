import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (typeof window !== 'undefined' && !loading) {
    if (!user) {
      router.push('/login');
    }
  }

  return user ? children : null;
}