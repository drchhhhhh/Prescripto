"use client"

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router';
import Logo from '../assets/logo.svg';
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  Layout,
  Package,
  BarChart2,
  User
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isDashboardOpen = currentPath === '/dashboard';
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm font-poppins z-50">
      {/* Logo */}
      <header className="p-4 flex items-center border-b border-gray-100">
        <img src={Logo} alt="Prescripto Logo" className="h-8 w-auto" />
        <span className="ml-2 text-xl font-semibold text-primaryGreen">Prescripto</span>
      </header>

      {/* Profile Section */}
      <section className="p-4 flex items-center justify-between border-b border-gray-100 relative">
        <figure className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primaryGreen">
            <span className="text-sm font-medium">A</span>
          </div>
          <figcaption className="ml-3">
            <h3 className="font-semibold text-darkGray">Arshie</h3>
            <p className="text-xs text-primaryGreen">Pharmacist</p>
          </figcaption>
        </figure>
      </section>

      {/* Navigation */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul>
          <li>
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center px-4 py-3 w-full text-left rounded-md ${
                isDashboardOpen
                  ? 'bg-green-100 text-primaryGreen font-semibold'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              <Layout className="h-5 w-5 mr-3 text-primaryGreen" />
              <span>Dashboard</span>
            </button>
          </li>

          {/* Inventory */}
          <li className="mb-1">
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md ${
                isInventoryOpen ? 'bg-green-100 text-primaryGreen font-semibold' : 'text-gray-700 hover:bg-green-50'
              }`}
              onClick={() => setIsInventoryOpen((prev) => !prev)}
              aria-expanded={isInventoryOpen}
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-3 text-primaryGreen" />
                <Link className='text-darkGray' to="/inventory">Inventory</Link>
              </div>
              {isInventoryOpen ? (
                <ChevronUp className="h-4 w-4 text-primaryGreen" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              )}
            </button>
            {isInventoryOpen && (
              <ul className="bg-primaryGreen text-cleanWhite rounded-md mt-1">
                <li>
                  <button
                    onClick={() => navigate('/inventory/item-list')}
                    className="block py-3 pl-10 hover:bg-darkGreen w-full text-left rounded-md"
                  >
                    List of Medicines
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/inventory/groups')}
                    className="block py-3 pl-10 hover:bg-darkGreen w-full text-left rounded-md"
                  >
                    Medicine Groups
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Transaction */}
          <li>
            <button
              className={`w-full flex items-center justify-between px-4 py-3 rounded-md ${
                isTransactionOpen ? 'bg-green-100 text-primaryGreen font-semibold' : 'text-gray-700 hover:bg-green-50'
              }`}
              onClick={() => setIsTransactionOpen((prev) => !prev)}
              aria-expanded={isTransactionOpen}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3 text-primaryGreen" />
                <span>Transaction</span>
              </div>
              {isTransactionOpen ? (
                <ChevronUp className="h-4 w-4 text-primaryGreen" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              )}
            </button>
            {isTransactionOpen && (
              <ul className="bg-primaryGreen text-cleanWhite rounded-md mt-1">
                <li>
                  <button
                    onClick={() => navigate('/transaction/log')}
                    className="block py-3 pl-10 hover:bg-darkGreen w-full text-left rounded-md"
                  >
                    Log Transaction
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/transaction/history')}
                    className="block py-3 pl-10 hover:bg-darkGreen w-full text-left rounded-md"
                  >
                    History
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <footer className="p-4 border-t border-gray-100">
        <button
          onClick={() => console.log('Logout')} // Replace with actual logout logic
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 w-full rounded-md border border-primaryGreen text-primaryGreen"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </footer>
    </aside>
  );
}
