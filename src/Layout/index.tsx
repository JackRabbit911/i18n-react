import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Modal from './reused/Modal';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className="mx-auto flex flex-col min-h-screen">
    <Navbar />
    <div className="flex justify-center mt-4">
      <div className="w-full md:w-lg">
        {children}
      </div>
    </div>
    <Modal />
  </div>
)

export default Layout
