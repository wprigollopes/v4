'use client';

import React, { useEffect, useRef } from 'react';
import { srConfig, email } from '@/lib/constants';
import { usePrefersReducedMotion } from '@/hooks';

const Contact: React.FC = () => {
  const revealContainer = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    async function animate() {
      const sr = (await import('scrollreveal')).default();
      if (revealContainer.current) {
        sr.reveal(revealContainer.current, srConfig());
      }
    }
    animate();
  }, [prefersReducedMotion]);

  return (
    <section id="contact" className="contact-section" ref={revealContainer}>
      <h2 className="numbered-heading overline">What&apos;s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        Although I&apos;m not currently looking for any new opportunities, my inbox is always open.
        Whether you have a question or just want to say hi, I&apos;ll try my best to get back to
        you!
      </p>

      <a className="email-link" href={`mailto:${email}`}>
        Say Hello
      </a>
    </section>
  );
};

export default Contact;
