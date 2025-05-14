"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Store } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../config/config";

type DashSummary = {
  invStat: any;
  rev: any;
  medAv: any;
  medShort: any;
  totalMed: any;
  groups: any;
  medSold: any;
  invGen: any;
  customers: any;
  freqBought: any;
};

const Dashboard = () => {
  const [branchFilter, setBranchFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const token = localStorage.getItem("token")
  const [dashSummary, setDashSummary] = useState<DashSummary | null>(null);
  const navigate = useNavigate();

  const handleFilterSelect = (branch: string) => {
    setBranchFilter(branch);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(endpoints.me, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();

        setUserRole(data.role === "Admin");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchAll = async () => {
      try {
        const branchQuery = branchFilter ? `?branch=${branchFilter}` : ''; // Add branch filter if it exists

        // Fetch all data in parallel using Promise.all
        const [invStatRes, revRes, medAvRes, medShortRes, totalMedRes, groupsRes, medSoldRes, invGenRes, customersRes, freqBoughtRes] = await Promise.all([
          fetch(`${endpoints.dashInvStat}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashRev}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashMedAv}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashMedShort}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashTotalMed}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashGroups}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashMedSold}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashInvGen}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashTotalCust}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${endpoints.dashFreqBought}${branchQuery}`, { method: "GET", headers: { "Authorization": `Bearer ${token}` } }),
        ]);

        // Check if all fetch requests were successful
        const allResponses = [invStatRes, revRes, medAvRes, medShortRes, totalMedRes, groupsRes, medSoldRes, invGenRes, customersRes, freqBoughtRes];
        if (allResponses.some((res) => !res.ok)) {
          throw new Error("FAILED TO FETCH ITEMS");
        }

        // Parse all responses into JSON
        const [
          invStatData,
          revData,
          medAvData,
          medShortData,
          totalMedData,
          groupsData,
          medSoldData,
          invGenData,
          customersData,
          freqBoughtData,
        ] = await Promise.all([
          invStatRes.json(),
          revRes.json(),
          medAvRes.json(),
          medShortRes.json(),
          totalMedRes.json(),
          groupsRes.json(),
          medSoldRes.json(),
          invGenRes.json(),
          customersRes.json(),
          freqBoughtRes.json(),
        ]);

        // Set the state with all fetched data
        setDashSummary({
          invStat: invStatData,
          rev: revData,
          medAv: medAvData,
          medShort: medShortData,
          totalMed: totalMedData,
          groups: groupsData,
          medSold: medSoldData,
          invGen: invGenData,
          customers: customersData,
          freqBought: freqBoughtData,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchAll();
    checkAdmin();
  }, [token, branchFilter]);

  return (
    <>
      <Header />
      <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins pl-64">
        <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-darkGray">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                A quick data overview of the inventory.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Inventory Status Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-green-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-primaryGreen"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">{dashSummary?.invStat.status}</h2>
                <p className="text-gray-600 mt-1">Inventory Status</p>
              </div>
              <div className="bg-green-50 py-5 px-4"></div>
            </div>

            {/* Revenue Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-yellow-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-yellow-100 p-3 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">
                  P {dashSummary?.rev.revenue.toFixed(2)}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <span>Revenue</span>
                </div>
              </div>
              <div className="bg-yellow-50 py-5 px-4"></div>
            </div>

            {/* Medicines Available Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-blue-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">{dashSummary?.medAv.count}</h2>
                <p className="text-gray-600 mt-1">Medicines Available</p>
              </div>
              <div className="bg-blue-50 py-5 px-4"></div>
            </div>

            {/* Medicine Shortage Card */}
            <div className="bg-cleanWhite rounded-lg overflow-hidden shadow-sm border border-red-100">
              <div className="p-6 flex flex-col items-center">
                <div className="bg-red-50 p-3 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-darkGray">{dashSummary?.medShort.count}</h2>
                <p className="text-gray-600 mt-1">Medicine Shortage</p>
              </div>
              <div className="bg-red-50 py-2.5 px-4 hover:bg-red-100 cursor-pointer">
                <div
                  className="w-full h-5 flex items-center justify-center text-red-500 text-sm font-medium hover:text-red-600 cursor-pointer"
                >
                  <button
                  onClick={() => navigate("/inventory/stockstatus")}
                  className="w-full flex items-center justify-center text-red-500 text-sm font-medium hover:text-red-600 cursor-pointer"
                  >
                    Resolve Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory Section */}
            <div className="bg-cleanWhite rounded-lg shadow-sm p-6">
              <div className="flex justify-between flex-col items-center mb-4">
                <h2 className="text-xl font-semibold text-darkGray">
                  Inventory
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-darkGray">{dashSummary?.totalMed.count}</h3>
                  <p className="text-gray-600 text-sm">Total no of Medicines</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-darkGray">{dashSummary?.groups.count}</h3>
                  <p className="text-gray-600 text-sm">Medicine Groups</p>
                </div>
              </div>
            </div>

            {/* Quick Report Section */}
            <div className="bg-cleanWhite rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4 flex-col">
                <h2 className="text-xl font-semibold text-darkGray">
                  Quick Report
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-darkGray">{dashSummary?.medSold.count}</h3>
                  <p className="text-gray-600 text-sm">Qty of Medicines Sold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-darkGray">{dashSummary?.invGen.count}</h3>
                  <p className="text-gray-600 text-sm">Invoices Generated</p>
                </div>
              </div>
            </div>

            {/* My Pharmacy Section */}
            <div className="bg-cleanWhite rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-between flex-col items-center mb-4">
                <h2 className="text-xl font-semibold text-darkGray ">
                  My Pharmacy
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="col-span-2">
                  <h3 className="text-2xl font-bold text-darkGray">{dashSummary?.customers.count}</h3>
                  <p className="text-gray-600 text-sm">Total no of Users</p>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-cleanWhite rounded-lg shadow-sm p-6 text-center">
              <div className="flex justify-between flex-col items-center mb-4 text-center">
                <h2 className="text-xl font-semibold text-darkGray">
                  Transactions
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-2xl font-bold text-darkGray">
                    {dashSummary?.freqBought.item}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Frequently bought Item
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
