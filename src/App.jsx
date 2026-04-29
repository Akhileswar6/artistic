import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

// Layouts
import Layout from "./Layout/Layout";
import PolicyNavbar from "./Components/PolicyNavbar";
import AdminLayout from "./Layout/AdminLayout";
import AdminRoute from "./Components/AdminRoute";

// Lazy Loaded Admin Pages
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const AdminLogin = lazy(() => import("./Pages/Admin/AdminLogin"));
const Users = lazy(() => import("./Pages/Admin/Users"));
const UserOrders = lazy(() => import("./Pages/Admin/UserOrders"));
const Messages = lazy(() => import("./Pages/Admin/Messages"));
const Settings = lazy(() => import("./Pages/Admin/Settings"));
const ActivityLog = lazy(() => import("./Pages/Admin/ActivityLog"));

// Lazy Loaded Main Pages
const Home = lazy(() => import("./Pages/Home"));
const Gallery = lazy(() => import("./Pages/Gallery"));
const Process = lazy(() => import("./Pages/Process"));
const Order = lazy(() => import("./Pages/Order"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));

// Lazy Loaded Policy Pages
const Terms = lazy(() => import("./Pages/Policies/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./Pages/Policies/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./Pages/Policies/RefundPolicy"));
const CancellationPolicy = lazy(() => import("./Pages/Policies/CancellationPolicy"));

// Lazy Loaded User Pages
const Account = lazy(() => import("./Pages/User/Account"));
const Orders = lazy(() => import("./Pages/User/Orders"));
const Notifications = lazy(() => import("./Pages/User/Notifications"));

// Loading Component
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[100]">
    <div className="w-10 h-10 border-4 border-neutral-200 border-t-orange-500 rounded-full animate-spin"></div>
  </div>
);

// Transition Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);



export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("user");
      const loginTimestamp = localStorage.getItem("loginTimestamp");

      if (storedUser && loginTimestamp) {
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;

        if (now - parseInt(loginTimestamp) > twoHours) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("loginTimestamp");
          setUser(null);
          toast.error("Session expired, please login again");
        } else {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10000);
    return () => clearInterval(interval);
  }, []);


  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "13px",
            padding: "10px 12px",
            borderRadius: "8px",
            fontFamily: "Inter, serif",
            background: isDark ? "#1c1c1c" : "#ffffff",
            color: isDark ? "#ffffff" : "#000000",
            border: isDark ? "1px solid #333" : "1px solid #e5e5e5",
          },
        }}
      />

      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-black text-white" : "bg-white text-black"
          }`}
      >
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<AdminLogin isDark={isDark} setIsDark={setIsDark} />}
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <Users />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <Messages />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <Settings />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/activities"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <ActivityLog />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userOrders"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <PageTransition>
                        <UserOrders />
                      </PageTransition>
                    </AdminLayout>
                  </AdminRoute>
                }
              />

              {/* Main Website Routes */}
              <Route
                element={
                  <Layout
                    isDark={isDark}
                    setIsDark={setIsDark}
                    user={user}
                    setUser={setUser}
                  />
                }
              >
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <Home isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <PageTransition>
                      <Gallery isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/process"
                  element={
                    <PageTransition>
                      <Process isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/order"
                  element={
                    <PageTransition>
                      <Order isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PageTransition>
                      <About isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PageTransition>
                      <Contact isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <PageTransition>
                      <Account isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PageTransition>
                      <Orders isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PageTransition>
                      <Notifications isDark={isDark} />
                    </PageTransition>
                  }
                />
              </Route>

              {/* Policy Routes */}
              <Route
                element={
                  <PolicyNavbar isDark={isDark} setIsDark={setIsDark} />
                }
              >
                <Route
                  path="/terms"
                  element={
                    <PageTransition>
                      <Terms isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <PageTransition>
                      <PrivacyPolicy isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/refund-policy"
                  element={
                    <PageTransition>
                      <RefundPolicy isDark={isDark} />
                    </PageTransition>
                  }
                />
                <Route
                  path="/cancellation-policy"
                  element={
                    <PageTransition>
                      <CancellationPolicy isDark={isDark} />
                    </PageTransition>
                  }
                />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </>
  );
}