import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className="mx-auto flex flex-col min-h-screen">
    <Navbar />
    <div className="navbar md:container lg:w-3xl xl:w-6xl mx-auto">
      {children}
    </div>
  </div>
)

export default Layout
