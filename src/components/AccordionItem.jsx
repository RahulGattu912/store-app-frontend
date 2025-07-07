import { useState } from "react";

export default function AccordionItem({ title, items, onQuantityChange }) {
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState({});

  const handleQty = (item, delta) => {
    setQuantities((prev) => {
      const newQty = Math.min(20, Math.max(0, (prev[item] || 0) + delta));
      onQuantityChange(item, newQty);
      return { ...prev, [item]: newQty };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-4 border">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center p-4 bg-indigo-100 cursor-pointer hover:bg-indigo-200"
      >
        <h3 className="font-bold text-lg text-indigo-800">{title}</h3>
        <span className="text-indigo-600 text-2xl">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item} className="flex justify-between items-center gap-3">
              <span className="w-1/3 text-gray-800 text-sm">→ {item}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQty(item, -1)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantities[item] || 0}
                  className="w-12 text-center border border-gray-300 rounded"
                />
                <button
                  onClick={() => handleQty(item, 1)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
