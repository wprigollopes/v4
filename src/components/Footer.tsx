'use client';

import React, { useState, useEffect } from 'react';
import { socialMedia } from '@/lib/constants';
import { Icon } from '@/components/icons';

const Footer: React.FC = () => {
  const [githubInfo, setGitHubInfo] = useState<{
    stars: number | null;
    forks: number | null;
  }>({
    stars: null,
    forks: null,
  });

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    fetch('https://api.github.com/repos/bchiang7/v4')
      .then(response => response.json())
      .then(json => {
        const { stargazers_count, forks_count } = json;
        setGitHubInfo({
          stars: stargazers_count,
          forks: forks_count,
        });
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-social-links">
        <ul>
          {socialMedia.map(({ name, url }, i) => (
            <li key={i}>
              <a href={url} aria-label={name}>
                <Icon name={name as Parameters<typeof Icon>[0]['name']} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-credit" tabIndex={-1}>
        <a href="https://github.com/bchiang7/v4">
          <div>Designed &amp; Built by Brittany Chiang</div>

          {githubInfo.stars && githubInfo.forks && (
            <div className="github-stats">
              <span>
                <Icon name="Star" />
                <span>{githubInfo.stars.toLocaleString()}</span>
              </span>
              <span>
                <Icon name="Fork" />
                <span>{githubInfo.forks.toLocaleString()}</span>
              </span>
            </div>
          )}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
