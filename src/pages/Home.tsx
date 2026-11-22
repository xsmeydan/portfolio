import { useEffect, useState } from 'react';
import { portfolioApi } from '../services/portfolioApi';
import { experienceApi } from '../services/experienceApi';
import ShaderAnimation from '../components/ShaderAnimation';
import AboutSection from '../components/AboutSection';
import ToolkitSection from '../components/ToolkitSection';
import ExperienceSection from '../components/ExperienceSection';
import WorksSection from '../components/WorksSection';
import type { Project, Experience, ToolkitItem } from '../types';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperiences] = useState<Experience[]>([]);
  const [toolkit, setToolkit] = useState<ToolkitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      portfolioApi.getProjects(),
      experienceApi.getExperiences(),
      experienceApi.getToolkit(),
    ])
      .then(([proj, experiences, toolkitItems]) => {
        setProjects(proj.slice(0, 4));
        setExperiences(experiences);
        setToolkit(toolkitItems);
      })
      .catch((err) => {
        console.error('Home data fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[100svh] min-h-[560px] w-full flex items-center justify-center overflow-hidden">
        <ShaderAnimation />

        <div className="relative z-10 text-center flex flex-col items-center pointer-events-none px-6 max-w-full">
          <h1
            className="font-display-2xl font-bold text-[52px] leading-[52px] sm:text-[80px] sm:leading-[80px] md:text-display-2xl text-primary tracking-tighter text-glow mix-blend-plus-lighter"
            id="hero-title"
          >
            Sudenur Meydan
          </h1>

          <p className="font-label-mono text-label-mono text-on-surface-variant mt-6 md:mt-8 tracking-widest uppercase reveal-on-scroll is-visible">
            Software Engineer | Backend & AI
          </p>

          <p className="mt-4 max-w-xl text-on-surface-variant text-sm md:text-base">
            Building backend systems, exploring AI, and turning ideas into
            working software.
          </p>
        </div>

        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-label-mono text-label-mono text-white uppercase tracking-widest text-[10px] opacity-75">
            Scroll to explore
          </span>

          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Technical Toolkit */}
      <ToolkitSection toolkit={toolkit} />

      {/* Experience Section */}
      <ExperienceSection experience={experience} />

      {/* Selected Works */}
      <WorksSection projects={projects} loading={loading} />

    </div>
  );
}