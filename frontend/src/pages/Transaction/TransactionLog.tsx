"use client"

import { useState } from "react"
import { Plus, Minus, Trash2, X, AlertCircle, CheckCircle } from "lucide-react"
import Header from "../../components/Header"

type MedicineProduct = {
  id: string
  name: string
  price: number
  quantity: number
}

export default function TransactionForm() {
  const [products, setProducts] = useState<MedicineProduct[]>([{ id: "1", name: "", price: 0, quantity: 1 }])
  const [taxRate, setTaxRate] = useState(0.12) // 12%
  const [discountAmount, setDiscountAmount] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [transactionSuccessful, setTransactionSuccessful] = useState(true)
  const [invoiceNumber, setInvoiceNumber] = useState("001")

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        quantity: 1,
      },
    ])
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const handleProductChange = (id: string, field: keyof MedicineProduct, value: string | number) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, [field]: value } : product)))
  }

  const handleIncrementQuantity = (id: string) => {
    setProducts(
      products.map((product) => (product.id === id ? { ...product, quantity: product.quantity + 1 } : product)),
    )
  }

  const handleDecrementQuantity = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product,
      ),
    )
  }

  // Calculate financial values
  const subtotalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const taxAmount = subtotalAmount * taxRate
  const finalTotal = subtotalAmount + taxAmount - discountAmount

  const handleProcessTransaction = () => {
    // Validate that all products have names
    const hasInvalidProducts = products.some((product) => !product.name.trim())

    // Set transaction result based on validation
    setTransactionSuccessful(!hasInvalidProducts)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)

    // Reset form if transaction was successful
    if (transactionSuccessful) {
      setProducts([{ id: "1", name: "", price: 0, quantity: 1 }])
    }
  }

  // Format date and time for receipt
  const currentDateTime = new Date()
  const dateString = currentDateTime.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  const timeString = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <>
      <Header />
      <main className="bg-cleanWhite rounded-lg shadow-sm relative font-poppins">
        <section className="p-6">
            <header className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-darkGray">
                        Transaction <span className="text-gray-400">&gt;</span>{" "}
                        <span className="text-primaryGreen">Log Transaction</span>
                    </h1>
                    <p className="text-darkGray mt-1">*All fields are mandatory, except mentioned as (optional).</p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="flex items-center px-4 py-2 bg-cleanWhite border border-primaryGreen rounded-full text-primaryGreen hover:bg-lightGreen"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Add Field
                </button>
            </header>

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

                <ul>
                    {products.map((product) => (
                        <li key={product.id} className="grid grid-cols-12 gap-4 mb-4">
                        <div className="col-span-6">
                            <input
                            type="text"
                            placeholder="Medicine name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={product.name}
                            onChange={(e) => handleProductChange(product.id, "name", e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={product.price}
                            onChange={(e) => handleProductChange(product.id, "price", Number.parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="col-span-3 flex items-center">
                            <button
                            onClick={() => handleDecrementQuantity(product.id)}
                            className="p-1 rounded-full bg-lightGreen text-primaryGreen"
                            aria-label="Decrease quantity"
                            >
                            <Minus className="w-5 h-5" />
                            </button>
                            <input
                            type="text"
                            className="w-16 mx-2 p-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryGreen"
                            value={product.quantity}
                            onChange={(e) =>
                                handleProductChange(product.id, "quantity", Number.parseInt(e.target.value) || 1)
                            }
                            aria-label="Quantity"
                            />
                            <button
                            onClick={() => handleIncrementQuantity(product.id)}
                            className="p-1 rounded-full bg-lightGreen text-primaryGreen"
                            aria-label="Increase quantity"
                            >
                            <Plus className="w-5 h-5" />
                            </button>
                            <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="ml-2 p-1 rounded-full bg-peach text-redBorder"
                            aria-label="Remove item"
                            >
                            <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>

        <footer className="bg-lightGreen p-6 rounded-b-lg">
            <div className="max-w-md ml-auto">
                <dl>
                    <div className="flex justify-between mb-2">
                        <dt className="font-medium">Subtotal</dt>
                        <dd className="font-medium">{subtotalAmount.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between mb-2">
                        <dt>Tax (12%)</dt>
                        <dd>{taxAmount.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between mb-2">
                        <dt>Discount</dt>
                        <dd>{discountAmount.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between text-primaryGreen font-bold text-xl mt-4">
                        <dt>Total</dt>
                        <dd>{finalTotal.toFixed(2)}</dd>
                    </div>
                </dl>

                <div className="flex justify-end mt-6 space-x-4">
                    <button className="px-6 py-3 bg-gray-300 rounded-full text-darkGray hover:bg-gray-400">Cancel</button>
                    <button
                        onClick={handleProcessTransaction}
                        className="px-6 py-3 bg-primaryGreen rounded-full text-cleanWhite hover:bg-darkGreen"
                    >
                        Save Transaction
                    </button>
                </div>
            </div>
        </footer>

        {/* Transaction Modal */}
        {modalVisible && (
            <div className="fixed inset-0 flex items-center justify-center z-50 font-poppins">
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {transactionSuccessful ? (
                <article className="bg-lightGreen rounded-lg p-6 w-full max-w-2xl z-10 relative">
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-darkGray hover:text-black"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-semibold text-center mb-6">Transaction Details</h2>

                    <div className="flex justify-between mb-6">
                        <div>
                            <p className="font-medium">Date & Time</p>
                            <p>
                            {dateString} | {timeString}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">Receipt No.</p>
                            <p>{invoiceNumber}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column - Transaction Details */}
                        <section>
                            <div className="mb-4">
                                <div className="grid grid-cols-12 gap-4 font-medium mb-2">
                                    <div className="col-span-2">QTY.</div>
                                    <div className="col-span-6">ITEM</div>
                                    <div className="col-span-4 text-right">PRICE</div>
                                </div>

                                <ul>
                                    {products.map((product) => (
                                    <li key={product.id} className="grid grid-cols-12 gap-4 mb-2">
                                        <div className="col-span-2">{product.quantity}</div>
                                        <div className="col-span-6">{product.name}</div>
                                        <div className="col-span-4 text-right">{product.price.toFixed(2)}</div>
                                    </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8">
                                <dl>
                                    <div className="flex justify-between mb-1">
                                        <dt className="font-medium">Subtotal</dt>
                                        <dd>{subtotalAmount.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <dt>Tax (12%)</dt>
                                        <dd>{taxAmount.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <dt>Discount</dt>
                                        <dd>{discountAmount.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between text-primaryGreen font-bold">
                                        <dt>Total</dt>
                                        <dd>{finalTotal.toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </div>
                        </section>

                        {/* Right Column - Confirmation */}
                        <section className="flex flex-col items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-primaryGreen flex items-center justify-center mb-4">
                                <CheckCircle className="w-16 h-16 text-cleanWhite" />
                            </div>
                            <p className="text-2xl font-bold text-center mb-8">Transaction Logged!</p>
                            <button
                                onClick={handleCloseModal}
                                className="px-8 py-3 bg-primaryGreen rounded-full text-cleanWhite hover:bg-darkGreen"
                            >
                                Return
                            </button>
                        </section>
                    </div>
                </article>
                ) : (
                <div className="bg-cleanWhite rounded-lg p-8 w-full max-w-md z-10 flex flex-col items-center">
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 text-darkGray hover:text-black"
                        aria-label="Close"
                    >
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
                        onClick={handleCloseModal}
                        className="px-8 py-3 bg-gray-200 rounded-full text-darkGray hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
                )}
            </div>
        )}
      </main>
    </>
  )
}
