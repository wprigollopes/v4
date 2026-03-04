'use client';

import { socialMedia } from '@/lib/constants';
import { Icon } from '@/components/icons';
import Side from '@/components/Side';

interface SocialProps {
  isHome: boolean;
}

const Social = ({ isHome }: SocialProps) => (
  <Side isHome={isHome} orientation="left">
    <ul className="side-social-list flex flex-col items-center m-0 p-0 list-none">
      {socialMedia &&
        socialMedia.map(({ url, name }, i) => (
          <li key={i}>
            <a href={url} aria-label={name} target="_blank" rel="noreferrer">
              <Icon name={name as Parameters<typeof Icon>[0]['name']} />
            </a>
          </li>
        ))}
    </ul>
  </Side>
);

export default Social;
