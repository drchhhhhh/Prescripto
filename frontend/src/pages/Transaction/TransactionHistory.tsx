"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6"
import Header from "../../components/Header"
import { endpoints } from "../../config/config"

type Transaction = {
  receiptNo: string
  date: string
  medicineName: string
  quantity: number
  unitPrice: number
  totalAmount: number
}

type SortDirection = "asc" | "desc" | "none"
type SortableField = "receiptNo" | "date" | "medicineName" | "quantity" | "unitPrice" | "totalAmount"

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    field: SortableField
    direction: SortDirection
  }>({ field: "date", direction: "desc" })
  const [filterOption, setFilterOption] = useState<string>("")
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllTransac = async () => {
      try {
        const response = await fetch(endpoints.getTransacAll, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }

        const data = await response.json()

        // Flatten the transactions for table display
        const transformed = data.flatMap((transaction: any) =>
          transaction.items.map((item: any) => ({
            receiptNo: transaction.receiptNumber,
            date: new Date(transaction.createdAt).toLocaleDateString(),
            medicineName: item?.medicine?.name || "Unknown",
            quantity: item.quantity,
            unitPrice: item.price,
            totalAmount: item.price * item.quantity,
          }))
        )

        setTransactions(transformed)
      } catch (error) {
        console.error("Failed to fetch all transactions: ", error)
      }
    }

    if (token) {
      fetchAllTransac()
    }
  }, [token])

  useEffect(() => {
    const filtered = transactions.filter(
      (transaction) =>
        transaction.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.date.includes(searchTerm) ||
        transaction.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.quantity.toString().includes(searchTerm) ||
        transaction.unitPrice.toString().includes(searchTerm) ||
        transaction.totalAmount.toString().includes(searchTerm),
    )
    setFilteredTransactions(filtered)
  }, [searchTerm, transactions])

  useEffect(() => {
    if (sortConfig.direction === "none") {
      setFilteredTransactions([...transactions])
      return
    }
    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      let aValue: any = a[sortConfig.field]
      let bValue: any = b[sortConfig.field]
      if (sortConfig.field === "date") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
    setFilteredTransactions(sortedTransactions)
  }, [sortConfig])

  const handleFilterSelect = (option: string) => {
    setFilterOption(option)
    setIsFilterOpen(false)

    const sorted = [...transactions]

    switch (option) {
      case "newest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "name-asc":
        sorted.sort((a, b) => a.medicineName.localeCompare(b.medicineName))
        break
      case "name-desc":
        sorted.sort((a, b) => b.medicineName.localeCompare(a.medicineName))
        break
      default:
        break
    }

    setFilteredTransactions(sorted)
  }

  return (
    <main className="flex flex-col bg-primaryBG w-full min-h-screen font-poppins pl-64">
      <Header />
      <div className="w-full max-w-7xl mx-auto px-5 flex flex-col flex-1">
        {/* Top Section */}
        <section className="flex flex-row justify-between items-center py-5">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-darkGray text-2xl font-bold">
                Transaction
              </h1>
              <h1 className="text-darkGray text-xl font-bold">{">"}</h1>
              <h1 className="text-darkGreen text-2xl font-bold">Transaction History</h1>
            </div>
            <h3 className="text-gray-600">Record of all transactions in the system.</h3>
          </div>
          <Link
            className="bg-primaryGreen rounded-md p-2 text-cleanWhite cursor-pointer hover:bg-darkGreen ease-in duration-100"
            to="/transaction/log"
          >
            + New Transaction
          </Link>
        </section>

        {/* Search and Filter */}
        <section className="flex flex-row justify-between items-center mt-2">
          <form
            className="flex items-center w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 shadow-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search transactions..."
              className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-gray-700 transition" aria-label="Search">
              <FaMagnifyingGlass />
            </button>
          </form>

          <div className="relative">
            <button
              className="flex items-center justify-between bg-primaryBG border border-primaryGreen rounded-md px-4 py-2 min-w-[200px] text-primaryGreen hover:bg-lightGreen hover:text-darkGreen cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span>
                {filterOption === "newest"
                  ? "Newest to Oldest"
                  : filterOption === "oldest"
                    ? "Oldest to Newest"
                    : filterOption === "name-asc"
                      ? "Medicine Name (A-Z)"
                      : filterOption === "name-desc"
                        ? "Medicine Name (Z-A)"
                        : "- Select Group -"}
              </span>
              <FaChevronDown className="ml-2 text-gray-500" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <ul>
                  <li
                    className="px-4 py-2 hover:bg-lightGreen cursor-pointer text-gray-700"
                    onClick={() => handleFilterSelect("newest")}
                  >
                    Newest to Oldest
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-lightGreen cursor-pointer text-gray-700"
                    onClick={() => handleFilterSelect("oldest")}
                  >
                    Oldest to Newest
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-light-Green cursor-pointer text-gray-700"
                    onClick={() => handleFilterSelect("name-asc")}
                  >
                    Medicine Name (A-Z)
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-lightGreen cursor-pointer text-gray-700"
                    onClick={() => handleFilterSelect("name-desc")}
                  >
                    Medicine Name (Z-A)
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Transaction Table */}
        <section className="flex flex-col shadow bg-cleanWhite rounded-sm border-2 border-gray-400 mt-5 flex-1 max-h-[400px]">
          <div className="overflow-auto h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.receiptNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{transaction.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{transaction.medicineName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{transaction.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Php {transaction.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Php {transaction.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TransactionHistory
