import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import PartnersPage from './pages/PartnersPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailsPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
