module.exports = {
  siteTitle: 'William Prigol Lopes | Software Engineer',
  siteDescription:
    'William Prigol Lopes is a software engineer based in Brazil, who specializes in developing websites, applications to companies.',
  siteKeywords:
    'William Prigol Lopes, william-prigol-lopes, software engineer, back-end engineer, web developer, javascript, william-lopes, software developer, software consultant',
  siteUrl: 'https://williamprigollopes.com',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-166907555-1',
  googleVerification: '',
  name: 'William Prigol Lopes',
  location: 'Brazil',
  email: 'william.prigol.lopes@gmail.com',
  github: 'https://github.com/wprigollopes',
  twitterHandle: '@wplopes',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/wprigollopes',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/william-prigol-lopes',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/wpprigol',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/wplopes',
    },
    {
      name: 'Medium',
      url: 'https://medium.com/@william.prigol.lopes',
    },
    {
      name: 'Youtube',
      url: 'https://www.youtube.com/channel/UCYo0nz47SoqXwSQLxcxJ1fQ',
    },
    {
      name: 'StackOverflow',
      url: 'https://stackoverflow.com/users/12121627/william-prigol-lopes',
    },
  ],

  navLinks: [
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
      name: 'Blog',
      url: '/blog',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 120,

  colors: {
    green: '#1F1A2B',
    navy: '#1F1A2B',
    darkNavy: '#1F1A2B',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
