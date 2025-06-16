import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import PlatformsSection from '../components/PlatformsSection';

interface HomePageProps {
  onPlatformSelect: (platform: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPlatformSelect }) => {
  return (
    <div className="page-transition">
      <HeroSection />
      <FeaturesSection />
      <PlatformsSection onPlatformSelect={onPlatformSelect} />
    </div>
  );
};

export default HomePage;
