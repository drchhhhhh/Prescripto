import React, { useState } from 'react';
import { Link } from 'react-router';
import { FaMagnifyingGlass } from "react-icons/fa6";
import Header from "../../components/Header";

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('- Select Group -');

  // Sample transaction data (can be replaced with actual data fetching logic)
  const transactionData = [
    {
      date: '2025-04-23',
      medicineName: 'Augmentin 625 Duo',
      receiptNo: '001',
      qty: 5,
      expirationDate: '2025-06-21',
      unitPrice: 8.00,
      total: 40.00
    },
    {
      date: '2025-04-23',
      medicineName: 'Azithral 500 Tablet',
      receiptNo: '002',
      qty: 3,
      expirationDate: '2026-10-21',
      unitPrice: 9.00,
      total: 27.00
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    // Implement filtering logic here
  }; 

  return (
    <>
      <Header />
      <main className="bg-primaryBG w-full min-h-screen p-5 font-poppins">
        {/* Top Section */}
        <section className='w-full flex flex-row justify-between items-center'>
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center">
              <Link className='text-darkGray text-2xl font-bold' to="/transaction">Transaction</Link>
              <h1 className='text-darkGray text-xl font-bold'>{'>'}</h1>
              <h1 className='text-darkGreen text-2xl font-bold'>History</h1>
            </div>
            <h3>View transaction history of the pharmacy.</h3>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className='flex flex-row justify-between items-center mt-5 gap-4'>
          <form 
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm" 
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Medicine History..."
              className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search">
              <FaMagnifyingGlass />
            </button>
          </form>

          <div className="relative">
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-primaryGreen text-gray-700 cursor-pointer w-64"
            >
              <option>- Select Group -</option>
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
              <option>Price (High to Low)</option>
              <option>Price (Low to High)</option>
              <option>Medicine Name (A-Z)</option>
              <option>Medicine Name (Z-A)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Transaction Table Section */}
        <section className='flex flex-col shadow bg-cleanWhite rounded-sm border-2 border-gray-400 w-full mt-5'>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Receipt No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Qty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionData.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.receiptNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.medicineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.expirationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {transaction.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Pagination Section */}
        <section>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <div className="text-sm text-gray-700">
              Showing 1 - 8 results of 298
            </div>
            <div className="flex items-center gap-2">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                &lt;
              </button>
              <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white">
                Page 01
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                &gt;
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default TransactionHistory;