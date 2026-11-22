import type { Experience } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useEffect, useRef, useState } from 'react';
import AboutThreeJS from './AboutThreeJS';

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [robotOffset, setRobotOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the section
      const scrollProgress = Math.max(
        0,
        Math.min(1, -sectionTop / (sectionHeight - windowHeight))
      );

      // Move robot up/down based on scroll (only on desktop, where the column is tall)
      const travel = window.innerWidth >= 768 ? 500 : 0;
      setRobotOffset(scrollProgress * travel - travel / 2);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={(el) => {
        ref.current = el;
        sectionRef.current = el;
      }}
      className={`py-20 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto relative z-10 transition-all duration-1000 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-20'
        }`}
      id="experience"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">

        {/* Robot / 3D Section */}
        <div className="md:col-span-5 md:col-start-2 relative h-[360px] md:h-auto md:min-h-[1100px] order-2 md:order-1">
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <AboutThreeJS />
          </div>

          <img
            src="/robot.webp"
            alt=""
            aria-hidden="true"
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none transition-transform duration-100 ease-out"
            style={{ transform: `translateY(${robotOffset}px)` }}
          />
        </div>

        {/* Experience Timeline */}
        <div className="md:col-span-5 flex flex-col order-1 md:order-2">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Experience
          </h2>

          <p className="font-body-sm text-body-sm text-on-surface-variant mb-12">
            A collection of my professional experience and technical
            journey.
          </p>

          <div className="relative pl-8 md:pl-12">
            <div className="timeline-line" />

            <div className="space-y-12 md:space-y-16">
              {experience.map((item) => (
                <div
                  key={item.id}
                  className="timeline-node group"
                >
                  {/* Position */}
                  <h3 className="font-headline-md text-[22px] md:text-[24px] text-primary mb-3">
                    {item.position}
                  </h3>

                  {/* Company + Logo */}
                  <div className="flex items-start sm:items-center gap-4 mb-3">
                    <img
                      src={item.imageUrl}
                      alt={`${item.company} logo`}
                      width={80}
                      height={80}
                      loading="lazy"
                      decoding="async"
                      className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-md shrink-0"
                    />
                    <div>
                      <span className="font-label-mono text-label-mono text-secondary-container">
                        {item.company}
                      </span>

                      {/* Description */}
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                        {item.description}
                      </p>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
