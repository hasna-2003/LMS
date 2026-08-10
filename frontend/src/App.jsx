import React from 'react'
import { Navigate, Route, Routes, userlocation} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import { ArrowUp } from "./pages/CourseDetailPageHome";
import CourseDetailPageHome from "./pages/CourseDetailPageHome";
import CourseDetailPage from "./pages/CourseDetailPage";

//to protect the routes
const ProtectedRoute = ({ children }) => {
  const location = userlocation();
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return Boolean(token); // Check if the token exists in localStorage
  };
  if (!isAuthenticated()) {
    return <Navigate to="/l" state={{ from: location }} replace />;
  }
  return childeren;
};

const ScrollToTopRouteChange = () => {
  const location = userlocation();

  useeffect(() => {
    window.scrollTo({ top: 0 , left: 0 , behavior: 'auto' });
  }, [location]);
};

const ScrollTopButton = () => ({threshold = 200, showOnMount = false}) => { 
  const [visible, setVisible] = useState(!!showOnMount);

  useeffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  if(!visible) return null;

  return (
    <div>
      <button onClick={scrollToTop} className={"fixed right-6 bottom-6 z-50 p-2 rounded-full focus:outline-none focus:ring-sky-3oo" + "background-blur-sm border border-white/20 shadow-lg cursor-pointer transition-transform"}>
        <ArrowUp className= "w-6 h-6 text-sky-600 drop-shadow-sm"/>
      </button>
    </div>
  );
};

const App = () => {
  return (
    <>
    <ScrollToTopRouteChange />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/mycourses" element={<MyCoursePage />} />
        <Route path="/course/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />

        
      </Routes>
      <ScrollTopButton threshold={200} showOnMount={false} />
    </>
  )
}

export default App