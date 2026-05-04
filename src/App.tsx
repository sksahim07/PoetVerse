import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // গার্ডটি ইমপোর্ট করলাম
import routes from './routes';

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    /* যদি রাউটটি protected হয়, তবে ProtectedRoute দিয়ে মুড়িয়ে দাও */
                    route.protected ? (
                      <ProtectedRoute>
                        {route.element}
                      </ProtectedRoute>
                    ) : (
                      /* নাহলে সরাসরি পেজটি দেখাও */
                      route.element
                    )
                  }
                />
              ))}
              {/* কোনো রাউট না মিললে হোমপেজে রিডাইরেক্ট */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        {/* টোস্ট নোটিফিকেশন সিস্টেম */}
        <Toaster position="top-center" richColors />
      </Router>
    </ThemeProvider>
  );
};

export default App;