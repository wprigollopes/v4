'use client';

import { email } from '@/lib/constants';
import Side from '@/components/Side';

interface EmailProps {
  isHome: boolean;
}

const Email = ({ isHome }: EmailProps) => (
  <Side isHome={isHome} orientation="right">
    <div className="side-email-wrapper flex flex-col items-center relative">
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  </Side>
);

export default Email;
