"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaMagnifyingGlass, FaChevronDown } from "react-icons/fa6"
import Header from "../../components/Header"

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

  useEffect(() => {
    const fetchTransactions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockData: Transaction[] = [
        { receiptNo: "001", date: "2025-04-23", medicineName: "Augmentin 625 Duo", quantity: 5, unitPrice: 8.0, totalAmount: 40.0 },
        { receiptNo: "002", date: "2025-04-23", medicineName: "Azithral 500 Tablet", quantity: 3, unitPrice: 9.0, totalAmount: 27.0 },
        { receiptNo: "003", date: "2025-04-22", medicineName: "Ascoril LS Syrup", quantity: 1, unitPrice: 12.5, totalAmount: 12.5 },
        { receiptNo: "004", date: "2025-04-21", medicineName: "Azee 500 Tablet", quantity: 2, unitPrice: 15.75, totalAmount: 31.5 },
        { receiptNo: "005", date: "2025-04-20", medicineName: "Allegra 120mg Tablet", quantity: 4, unitPrice: 7.25, totalAmount: 29.0 },
        { receiptNo: "006", date: "2025-04-19", medicineName: "Alex Syrup", quantity: 1, unitPrice: 18.0, totalAmount: 18.0 },
        { receiptNo: "007", date: "2025-04-18", medicineName: "Arnozyclov 625 Tablet", quantity: 3, unitPrice: 11.5, totalAmount: 34.5 },
        { receiptNo: "008", date: "2025-04-17", medicineName: "Avil 25 Tablet", quantity: 6, unitPrice: 3.5, totalAmount: 21.0 },
      ]
      setTransactions(mockData)
      setFilteredTransactions(mockData)
    }
    fetchTransactions()
  }, [])

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
              <Link className="text-darkGray text-2xl font-bold" to="/transactions">
                Transaction
              </Link>
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
