import { About } from './components/About';
import { FeaturedWork } from './components/FeaturedWork';
import { FinalCTA } from './components/FinalCTA';
import { Hero } from './components/Hero';

export default function App() {
  return (
    <div className="relative bg-background text-cream overflow-x-hidden">
      <Hero />
      <About />
      <FeaturedWork />
      <FinalCTA />

      {/* Global texture overlay — above content, below nothing */}
      <div className="texture-overlay" aria-hidden />
    </div>
  );
}
