import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { useLangPrefix } from 'i18n/hooks';

const trimSlash = (str: string) => str.replace(/^\/+|\/+$/g, '')

interface Props {
  to: string;
  children: ReactNode;
}

const LangLink = ({ to, children }: Props) => {
  const prefix = useLangPrefix()
  const link = trimSlash(to)
  // leading '/' makes react-router resolve from root;
  // relative links resolve against the current URL and break on nested pages
  const path = '/' + [prefix, link].filter(Boolean).join('/')

  return (
    <Link to={path}>
      {children}
    </Link>
  )
}

export default LangLink
