"use client"

import { useState } from "react"
import { ArrowRight, ChevronDown, FileText, FileSpreadsheet } from "lucide-react"
import Header from "../components/Header"

const Dashboard = () => {
const [showReportDropdown, setShowReportDropdown] = useState(false)

const toggleReportDropdown = () => {
    setShowReportDropdown(!showReportDropdown)
}


return (
    <>
    <Header/>
    <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins">
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 py-6">
        <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-darkGray">Dashboard</h1>
            <p className="text-gray-600 mt-1">A quick data overview of the inventory.</p>
            </div>
           
            <div className="relative">
            <button
                onClick={toggleReportDropdown}
                className="flex items-center px-4 py-2 bg-cleanWhite border border-primaryGreen rounded-md text-primaryGreen hover:bg-lightGreen hover:text-darkGreen cursor-pointer"
            >
                Download Report
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
           
            {showReportDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 hover:text-primaryGreen cursor-pointer">
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    Excel
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-green-50 hover:text-primaryGreen cursor-pointer">
                    <FileText className="w-5 h-5 mr-2" />
                    PDF
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Inventory Status Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-green-100">
            <div className="p-6 flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-primaryGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">Good</h2>
                <p className="text-gray-600 mt-1">Inventory Status</p>
            </div>
            <div className="bg-green-50 py-2 px-4 hover:bg-lightGreen cursor-pointer">
                <button className="w-full flex items-center justify-center text-primaryGreen text-sm font-medium hover:text-darkGreen">
                View Detailed Report
                <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>
            </div>


            {/* Revenue Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-yellow-100">
            <div className="p-6 flex flex-col items-center">
                <div className="bg-yellow-50 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">Rs. 8,55,875</h2>
                <div className="flex items-center text-gray-600 mt-1">
                <span>Revenue:</span>
                <span className="mx-1">Jan 2022</span>
                <ChevronDown className="w-4 h-4" />
                </div>
            </div>
            <div className="bg-yellow-50 py-2 px-4 hover:bg-yellow-100 cursor-pointer">
                <button className="w-full flex items-center justify-center text-yellow-600 text-sm font-medium hover:text-yellow-700">
                View Detailed Report
                <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>
            </div>


            {/* Medicines Available Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-blue-100">
            <div className="p-6 flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">298</h2>
                <p className="text-gray-600 mt-1">Medicines Available</p>
            </div>
            <div className="bg-blue-50 py-2 px-4 hover:bg-blue-100 cursor-pointer">
                <button className="w-full flex items-center justify-center text-blue-500 text-sm font-medium hover:text-blue-600">
                Visit Inventory
                <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>
            </div>


            {/* Medicine Shortage Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-red-100">
            <div className="p-6 flex flex-col items-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">01</h2>
                <p className="text-gray-600 mt-1">Medicine Shortage</p>
            </div>
            <div className="bg-red-50 py-2 px-4 hover:bg-red-100 cursor-pointer">
                <button className="w-full flex items-center justify-center text-red-500 text-sm font-medium hover:text-red-600">
                Resolve Now
                <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Section */}
            <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div className="flex justify-between flex-col items-center mb-4">
                <h2 className="text-xl font-semibold text-darkGray">Inventory</h2>
            </div>
           
            <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                <h3 className="text-2xl font-bold text-darkGray">298</h3>
                <p className="text-gray-600 text-sm">Total no of Medicines</p>
                </div>
                <div>
                <h3 className="text-2xl font-bold text-darkGray">24</h3>
                <p className="text-gray-600 text-sm">Medicine Groups</p>
                </div>
            </div>
            </div>


            {/* Quick Report Section */}
            <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4 flex-col">
                <h2 className="text-xl font-semibold text-darkGray">Quick Report</h2>
            </div>
           
            <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                <h3 className="text-2xl font-bold text-darkGray">70,856</h3>
                <p className="text-gray-600 text-sm">Qty of Medicines Sold</p>
                </div>
                <div>
                <h3 className="text-2xl font-bold text-darkGray">5,288</h3>
                <p className="text-gray-600 text-sm">Invoices Generated</p>
                </div>
            </div>
            </div>


            {/* My Pharmacy Section */}
            <div className="bg-green-50 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-between flex-col items-center mb-4">
                <h2 className="text-xl font-semibold text-darkGray ">My Pharmacy</h2>
            </div>
           
            <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                <h3 className="text-2xl font-bold text-darkGray">04</h3>
                <p className="text-gray-600 text-sm">Total no of Suppliers</p>
                </div>
                <div>
                <h3 className="text-2xl font-bold text-darkGray">05</h3>
                <p className="text-gray-600 text-sm">Total no of Users</p>
                </div>
            </div>
            </div>


            {/* Customers Section */}
            <div className="bg-green-50 rounded-lg shadow-sm p-6 text-center">
            <div className="flex justify-between flex-col items-center mb-4 text-center">
                <h2 className="text-xl font-semibold text-darkGray">Customers</h2>    
            </div>
           
            <div className="grid grid-cols-2 gap-6">
                <div>
                <h3 className="text-2xl font-bold text-darkGray">845</h3>
                <p className="text-gray-600 text-sm">Total no of Customers</p>
                </div>
                <div>
                <h3 className="text-2xl font-bold text-darkGray">Adalimumab</h3>
                <p className="text-gray-600 text-sm">Frequently bought Item</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    </main>
    </>
)
}


export default Dashboard

