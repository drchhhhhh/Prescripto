"use client"


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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


  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);


  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <header className="p-4 flex items-center border-b border-gray-100">
        <figure className="bg-primaryGreen p-1 rounded">
          <svg className="w-6 h-6 text-cleanWhite" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.5 5.5L18 2H9.5L8 5.5M19.5 5.5H8M19.5 5.5L21 16M8 5.5L6.5 16M21 16H6.5M21 16L22 22H5L6.5 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 10L15 12L20 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </figure>
        <span className="ml-2 text-xl font-medium text-primaryGreen">Prescripto</span>
      </header>


      {/* Profile Section */}
      <section className="p-4 flex items-center justify-between border-b border-gray-100 relative">
        <figure className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primaryGreen">
            <span className="text-sm font-medium">A</span>
          </div>
          <figcaption className="ml-3">
            <h3 className="font-medium text-darkGray">Arshie</h3>
            <p className="text-xs text-primaryGreen">Pharmacist</p>
          </figcaption>
        </figure>
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-green-50"
            aria-label="Profile menu"
          >
            <User className="h-5 w-5 text-primaryGreen" />
          </button>
          {isProfileMenuOpen && (
            <nav className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-50">
              <ul>
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/settings')}
                    className="block w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700"
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>


      {/* Navigation */}
      <nav className="p-2 flex-1 overflow-y-auto">
        <ul>
          <li>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 w-full text-left rounded-md"
            >
              <Layout className="h-5 w-5 mr-3 text-primaryGreen" />
              <span>Dashboard</span>
            </button>
          </li>


          {/* Inventory */}
          <li className="mb-1">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-green-50 rounded-md"
              onClick={() => setIsInventoryOpen((prev) => !prev)}
              aria-expanded={isInventoryOpen}
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-3 text-primaryGreen" />
                <span>Inventory</span>
              </div>
              {isInventoryOpen ?
                <ChevronUp className="h-4 w-4 text-primaryGreen" /> :
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              }
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
                    onClick={() => navigate('/Inventory/groups')}
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
              className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-green-50 rounded-md"
              onClick={() => setIsTransactionOpen((prev) => !prev)}
              aria-expanded={isTransactionOpen}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3 text-primaryGreen" />
                <span>Transaction</span>
              </div>
              {isTransactionOpen ?
                <ChevronUp className="h-4 w-4 text-primaryGreen" /> :
                <ChevronDown className="h-4 w-4 text-primaryGreen" />
              }
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

