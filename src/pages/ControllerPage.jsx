import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { itemsByCategory } from "../data/itemsData";
// Mock data for demonstration

export default function ControllerPage() {
  const location = useLocation();
  const store = new URLSearchParams(location.search).get("store") || "Unknown";
  const [selectedItems, setSelectedItems] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleQuantityChange = (item, change) => {
    setSelectedItems((prev) => {
      const currentQty = prev[item] || 0;
      const newQty = Math.min(20, Math.max(0, currentQty + change));
      return { ...prev, [item]: newQty };
    });
  };

  const submitOrder = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const order = { store, items: selectedItems };
    try {
      const response = await fetch('http://localhost:5000/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order }),
      });
      if (!response.ok) throw new Error('Failed to send order');
      setSuccess(true);
      setSelectedItems({});
      setShowCart(false);
    } catch (err) {
      setError('Failed to send order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 rounded-full shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Order from <span className="text-blue-600 dark:text-blue-400">{store}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Select items and quantities for your order
          </p>
          {getTotalItems() > 0 && (
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full mt-4 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {getTotalItems()} items selected
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-8">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                className="w-full text-left p-6 font-semibold text-lg flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 group"
                onClick={() =>
                  setOpenCategory((prev) =>
                    prev === category ? null : category
                  )
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800 dark:group-hover:to-purple-800 transition-colors duration-300">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100">{category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {items.filter((item) => selectedItems[item] > 0).length >
                    0 && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                      {items.filter((item) => selectedItems[item] > 0).length}{" "}
                      selected
                    </span>
                  )}
                  <svg
                    className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                      openCategory === category ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {openCategory === category && (
                <div className="px-6 pb-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                  <div className="space-y-3 pt-4">
                    {items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-600 dark:text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-800 dark:text-gray-100 font-medium">
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={!selectedItems[item]}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <div className="w-12 h-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
                              {selectedItems[item] || 0}
                            </span>
                          </div>
                          <button
                            className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={selectedItems[item] >= 20}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Cart Button */}
        {!showCart && !success && getTotalItems() > 0 && (
          <button
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 dark:bg-blue-800 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            onClick={() => setShowCart(true)}
            aria-label="View Cart"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 border-2 border-white dark:border-gray-900">
              {getTotalItems()}
            </span>
          </button>
        )}

        {/* Cart Button and Modal */}
        {showCart && !success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full relative max-h-[80vh] flex flex-col">
              <button
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Cart</h2>
              <div className="flex-1 overflow-y-auto mb-4">
                {getTotalItems() === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-gray-700 dark:text-gray-200">Item</th>
                        <th className="text-right text-gray-700 dark:text-gray-200">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedItems).filter(([_, qty]) => qty > 0).map(([item, qty]) => (
                        <tr key={item}>
                          <td className="text-gray-800 dark:text-gray-100 py-1">{item}</td>
                          <td className="text-right text-gray-800 dark:text-gray-100 py-1">{qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <button
                className="w-full px-4 py-2 rounded-lg bg-green-600 dark:bg-green-800 text-white font-semibold shadow hover:bg-green-700 dark:hover:bg-green-900 transition-colors mt-2"
                onClick={() => {
                  setShowCart(false);
                }}
              >
                Continue Ordering
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={submitOrder}
            disabled={getTotalItems() === 0}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>
              {getTotalItems() === 0
                ? "Select Items to Order"
                : `Submit Order (${getTotalItems()} items)`}
            </span>
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-blue-600 font-medium flex items-center space-x-2 mx-auto transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Store Selection</span>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center relative">
              <svg className="w-20 h-20 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Order Placed!</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-4 text-center">Your order has been successfully placed and will be processed soon.</p>
              <button
                className="mt-2 px-6 py-2 rounded-lg bg-blue-600 dark:bg-blue-800 text-white font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
                onClick={() => setSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner Modal */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-xs w-full">
              <svg className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Placing your order...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
