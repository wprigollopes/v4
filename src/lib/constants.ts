export const siteConfig = {
  title: 'Your Name',
  description:
    'Your Name is a software engineer who specializes in building exceptional digital experiences.',
  siteUrl: 'https://yourname.com',
  image: '/og.png',
  twitterUsername: '@yourname',
};

export const email = 'your.email@example.com';

export const socialMedia = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourname',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/yourname',
  },
];

export const navLinks = [
  {
    name: 'About',
    url: '/#about',
  },
  {
    name: 'Experience',
    url: '/#jobs',
  },
  {
    name: 'Work',
    url: '/#projects',
  },
  {
    name: 'Contact',
    url: '/#contact',
  },
];

export const colors = {
  green: '#64ffda',
  navy: '#0a192f',
  darkNavy: '#020c1b',
};

export const srConfig = (delay = 200, viewFactor = 0.25) => ({
  origin: 'bottom' as const,
  distance: '20px',
  duration: 500,
  delay,
  rotate: { x: 0, y: 0, z: 0 },
  opacity: 0,
  scale: 1,
  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  mobile: true,
  reset: false,
  useDelay: 'always' as const,
  viewFactor,
  viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
});

export const navDelay = 1000;
export const loaderDelay = 2000;

export const KEY_CODES = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_LEFT_IE11: 'Left',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_RIGHT_IE11: 'Right',
  ARROW_UP: 'ArrowUp',
  ARROW_UP_IE11: 'Up',
  ARROW_DOWN: 'ArrowDown',
  ARROW_DOWN_IE11: 'Down',
  ESCAPE: 'Escape',
  ESCAPE_IE11: 'Esc',
  TAB: 'Tab',
  SPACE: ' ',
  SPACE_IE11: 'Spacebar',
  ENTER: 'Enter',
};
