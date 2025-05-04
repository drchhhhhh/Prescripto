import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';


export default function Layout() {
  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

