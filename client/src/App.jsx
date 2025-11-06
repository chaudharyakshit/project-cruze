import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load all route components
const Hero = lazy(() => import('./components/Hero'));
const Models = lazy(() => import('./components/Models'));
const Features = lazy(() => import('./components/Features'));
const Gallery = lazy(() => import('./components/Gallery'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const CTA = lazy(() => import('./components/CTA'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Poster = lazy(() => import('./components/poster'));
const ScootyBanner = lazy(() => import('./components/Banner'));
const Calculator = lazy(() => import('./components/calculator'));
const Contact = lazy(() => import('./pages/Contact'));
const CruzeBladeDetails = lazy(() => import('./pages/CruzeBladeDetails'));
const EcoShine = lazy(() => import('./pages/EcoShine'));
const Ecoswift = lazy(() => import('./pages/ecoswift'));
const News = lazy(() => import('./pages/Newssection'));
const Dealership = lazy(() => import('./pages/Dealership'));
const EcoJoy = lazy(() => import('./pages/EcoJoy'));
const EcoGlider = lazy(() => import('./pages/ecoglider'));
const Cruzeon = lazy(() => import('./pages/cruzeon'));
const Rapidshine = lazy(() => import('./pages/Rapidshine'));
const EcoZeon = lazy(() => import('./pages/EcoZeon'));
const Invertors = lazy(() => import('./pages/Invertors'));

import './index.css';

// Create a Home component that contains all your main page sections
import LoadingSpinner from './components/LoadingSpinner';

const Home = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Hero />
      <Gallery />
      <Features />
      <Models />
      <ScootyBanner />
      <Poster/>
      <Calculator /> 
      <Testimonials />
      <CTA />
    </Suspense>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="App">
        <Header scrolled={scrolled} />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services/>} />
              <Route path="/contact" element={<Contact />} /> 
              <Route path="/dealership" element={<Dealership />} />
              <Route path="/News" element={<News/>}/>
              <Route path="/cruze-blade-details" element={<CruzeBladeDetails />} />
              <Route path="/EcoShine-details" element={<EcoShine/>}/>  
              <Route path="/ecoswift-details" element={<Ecoswift/>} />
              <Route path="/ecojoy-details" element={<EcoJoy />} />
              <Route path="/eco-glider-details" element={<EcoGlider />} />
              <Route path="/cruzeon-details" element={<Cruzeon />} />
              <Route path="/rapidshine-details" element={<Rapidshine />} />
              <Route path="/Ecozeon-details" element={<EcoZeon />} />
              <Route path="/invertors" element={<Invertors />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
