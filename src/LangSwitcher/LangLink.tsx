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
  const path = trimSlash([prefix, link].join('/'))

  return (
    <Link to={path}>
      {children}
    </Link>
  )
}

export default LangLink
