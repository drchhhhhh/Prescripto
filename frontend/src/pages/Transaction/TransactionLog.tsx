"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, X, AlertCircle, CheckCircle } from "lucide-react"
import Header from "../../components/Header";

interface MedicineItem {
  id: string
  name: string
  price: number
  quantity: number
}

const TransactionForm = () => {
  const [items, setItems] = useState<MedicineItem[]>([{ id: "1", name: "", price: 0, quantity: 1 }])
  const [tax, setTax] = useState(0.12) // 12%
  const [discount, setDiscount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [isSuccess, setIsSuccess] = useState(true)
  const [receiptNo, setReceiptNo] = useState("001")

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        quantity: 1,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof MedicineItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const increaseQuantity = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (id: string) => {
    setItems(
      items.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)),
    )
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = subtotal * tax
  const total = subtotal + taxAmount - discount

  const handleSaveTransaction = () => {
    // Check if any items have empty names
    const hasEmptyNames = items.some((item) => !item.name.trim())

    // Simulate success or failure based on whether all items have names
    setIsSuccess(!hasEmptyNames)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)

    // If it was a successful transaction, reset the form
    if (isSuccess) {
      setItems([{ id: "1", name: "", price: 0, quantity: 1 }])
    }
  }

  // Get current date and time for receipt
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <>
        <Header />
        <div className="bg-cleanWhite rounded-lg shadow-sm relative font-poppins">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-darkGray">
                    Transaction <span className="text-gray-400">&gt;</span>{" "}
                    <span className="text-primaryGreen">Log Transaction</span>
                    </h2>
                    <p className="text-darkGray mt-1">*All fields are mandatory, except mentioned as (optional).</p>
                </div>
                <button
                    onClick={addItem}
                    className="flex items-center px-4 py-2 bg-cleanWhite border border-primaryGreen rounded-full text-primaryGreen hover:bg-lightGreen"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Add Field
                </button>
                </div>

                <div className="mt-6">
                <div className="grid grid-cols-12 gap-4 mb-2">
                    <div className="col-span-6">
                    <label className="block text-darkGray mb-1">Medicine Name</label>
                    </div>
                    <div className="col-span-3">
                    <label className="block text-darkGray mb-1">Unit Price</label>
                    </div>
                    <div className="col-span-3">
                    <label className="block text-darkGray mb-1">Quantity</label>
                    </div>
                </div>

                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                        <input
                        type="text"
                        placeholder="Medicine name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                    </div>
                    <div className="col-span-3">
                        <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="col-span-3 flex items-center">
                        <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-1 rounded-full bg-lightGreen text-primaryGreen"
                        >
                        <Minus className="w-5 h-5" />
                        </button>
                        <input
                        type="text"
                        className="w-16 mx-2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                        <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-1 rounded-full bg-lightGreen text-primaryGreen"
                        >
                        <Plus className="w-5 h-5" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-2 p-1 rounded-full bg-peach text-redBorder">
                        <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-lightGreen p-6 rounded-b-lg">
                <div className="max-w-md ml-auto">
                <div className="flex justify-between mb-2">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax (12%)</span>
                    <span>{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primaryGreen font-bold text-xl mt-4">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                    <button className="px-6 py-3 bg-gray-300 rounded-full text-darkGray hover:bg-gray-400">Cancel</button>
                    <button
                    onClick={handleSaveTransaction}
                    className="px-6 py-3 bg-primaryGreen rounded-full text-cleanWhite hover:bg-darkGreen"
                    >
                    Save Transaction
                    </button>
                </div>
                </div>
            </div>

            {/* Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 font-poppins">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {isSuccess ? (
                    <div className="bg-lightGreen rounded-lg p-6 w-full max-w-2xl z-10 relative">
                    <button onClick={closeModal} className="absolute top-4 right-4 text-darkGray hover:text-black">
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-semibold text-center mb-6">Transaction Details</h2>

                    <div className="flex justify-between mb-6">
                        <div>
                        <p className="font-medium">Date & Time</p>
                        <p>
                            {formattedDate} | {formattedTime}
                        </p>
                        </div>
                        <div className="text-right">
                        <p className="font-medium">Receipt No.</p>
                        <p>{receiptNo}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column - Transaction Details */}
                        <div>
                        <div className="mb-4">
                            <div className="grid grid-cols-12 gap-4 font-medium mb-2">
                            <div className="col-span-2">QTY.</div>
                            <div className="col-span-6">ITEM</div>
                            <div className="col-span-4 text-right">PRICE</div>
                            </div>

                            {items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 mb-2">
                                <div className="col-span-2">{item.quantity}</div>
                                <div className="col-span-6">{item.name}</div>
                                <div className="col-span-4 text-right">{item.price.toFixed(2)}</div>
                            </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <div className="flex justify-between mb-1">
                            <span className="font-medium">Subtotal</span>
                            <span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                            <span>Tax (12%)</span>
                            <span>{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                            <span>Discount</span>
                            <span>{discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-primaryGreen font-bold">
                            <span>Total</span>
                            <span>{total.toFixed(2)}</span>
                            </div>
                        </div>
                        </div>

                        {/* Right Column - Confirmation */}
                        <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primaryGreen flex items-center justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-cleanWhite" />
                        </div>
                        <p className="text-2xl font-bold text-center mb-8">Transaction Logged!</p>
                        <button
                            onClick={closeModal}
                            className="px-8 py-3 bg-primaryGreen rounded-full text-cleanWhite hover:bg-darkGreen"
                        >
                            Return
                        </button>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className="bg-cleanWhite rounded-lg p-8 w-full max-w-md z-10 flex flex-col items-center">
                    <button onClick={closeModal} className="absolute top-4 right-4 text-darkGray hover:text-black">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-24 h-24 rounded-full bg-redBorder flex items-center justify-center mb-6">
                        <AlertCircle className="w-16 h-16 text-cleanWhite" />
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-4">Error Logging Transaction</h2>
                    <p className="text-center text-darkGray mb-6">
                        Please make sure all required fields are filled correctly.
                    </p>

                    <button
                        onClick={closeModal}
                        className="px-8 py-3 bg-gray-200 rounded-full text-darkGray hover:bg-gray-300"
                    >
                        Close
                    </button>
                    </div>
                )}
                </div>
            )}
        </div>
    </>
  )
}

export default TransactionForm
