'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { srConfig } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';

const About = () => {
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    async function animate() {
      const sr = (await import('scrollreveal')).default();
      sr.reveal(revealContainer.current!, srConfig());
    }
    animate();
  }, [prefersReducedMotion]);

  const skills = ['JavaScript (ES6+)', 'TypeScript', 'React', 'Eleventy', 'Node.js', 'WordPress'];

  return (
    <section id="about" className="max-w-[900px]" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="grid grid-cols-[3fr_2fr] gap-[50px] max-[768px]:block">
        <div>
          <div>
            <p>
              Hello! My name is Brittany and I enjoy creating things that live on the internet. My
              interest in web development started back in 2012 when I decided to try editing custom
              Tumblr themes &mdash; turns out hacking together a custom reblog button taught me a lot
              about HTML &amp; CSS!
            </p>

            <p>
              Fast-forward to today, and I&apos;ve had the privilege of working at{' '}
              <a href="https://us.mullenlowe.com/">an advertising agency</a>,{' '}
              <a href="https://starry.com/">a start-up</a>,{' '}
              <a href="https://www.apple.com/">a huge corporation</a>, and{' '}
              <a href="https://scout.camd.northeastern.edu/">a student-led design studio</a>. My
              main focus these days is building accessible, inclusive products and digital experiences
              at <a href="https://upstatement.com/">Upstatement</a> for a variety of clients.
            </p>

            <p>
              I also recently{' '}
              <a href="https://www.newline.co/courses/build-a-spotify-connected-app">
                launched a course
              </a>{' '}
              that covers everything you need to build a web app with the Spotify API using Node
              &amp; React.
            </p>

            <p>Here are a few technologies I&apos;ve been working with recently:</p>
          </div>

          <ul className="skills-list grid grid-cols-[repeat(2,minmax(140px,200px))] gap-x-[10px] gap-y-0 p-0 mt-5 overflow-hidden list-none">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>

        <div className="about-pic relative max-w-[300px] max-[768px]:mx-auto max-[768px]:mt-[50px] max-[768px]:w-[70%]">
          <div className="about-pic-wrapper">
            <Image
              className="about-pic-img"
              src="/images/me.jpg"
              alt="Headshot"
              width={500}
              height={500}
              quality={95}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
