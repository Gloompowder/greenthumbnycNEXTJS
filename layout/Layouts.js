// /layout/Layouts.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/context/AuthProvider'


export default function Layouts({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
      <Navbar />
      <main className="flex-grow">
          {children}
      </main>
      <Footer />
      </AuthProvider>
    </div>
  );
}