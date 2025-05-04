"use client"

import type React from "react"

import { CheckCircle, AlertCircle } from "lucide-react"
import type { MedicineItem } from "../pages/Transaction/TransactionLog"

interface TransactionModalProps {
  show: boolean
  valid: boolean
  items: MedicineItem[]
  subtotal: number
  taxAmount: number
  discount: number
  total: number
  receiptNumber: string
  onClose: () => void
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  valid,
  items,
  subtotal,
  taxAmount,
  discount,
  total,
  receiptNumber,
  onClose,
}) => {
  if (!show) return null

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <article
        className={`w-[900px] bg-lightGreen rounded-lg p-6 z-10 relative ${valid ? "bg-lightGreen" : "bg-white"}`}
      >
        {valid ? (
          <div className="flex w-full h-full bg-lightGreen">
            {/* Left side - Transaction Details */}
            <div className="w-1/2  flex flex-col justify-between ">
              <h2 className="text-2xl font-semibold mb-6 text-center text-primaryGreen">Transaction Details</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Date & Time</div>
                  <div>{formattedDate} | {formattedTime}</div>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b">
                  <div className="font-medium">Receipt No.</div>
                  <div>{receiptNumber}</div>
                </div>
              </div>
              
              <div className="mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="font-medium mb-2">
                      <th className="text-left w-1/6">QTY.</th>
                      <th className="text-left w-1/2">ITEM</th>
                      <th className="text-right w-1/3">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="mb-2">
                        <td className="text-left">{item.quantity}</td>
                        <td className="text-left">{item.name}</td>
                        <td className="text-right">{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <dl className="mt-8">
                <div className="flex justify-between mb-1">
                  <dt className="font-medium">Subtotal</dt>
                  <dd>{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between mb-1">
                  <dt>Tax (12%)</dt>
                  <dd>{taxAmount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between mb-1">
                  <dt>Discount</dt>
                  <dd>{discount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <dt>Total</dt>
                  <dd>{total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
            
            {/* Right side - Confirmation */}
            <div className="w-1/2 pl-8 flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <p className="text-2xl font-bold text-center mb-8">Transaction Logged!</p>
              <button onClick={onClose} className="px-8 py-3 bg-green-600 rounded-full text-white hover:bg-green-700">
                Return
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px]">
            <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center mb-6">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Error Logging Transaction</h2>
            <p className="text-center text-gray-700 mb-6">Please make sure all required fields are filled correctly.</p>
            <button onClick={onClose} className="px-8 py-3 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300">
              Close
            </button>
          </div>
        )}
      </article>
    </div>
  )
}

export default TransactionModal