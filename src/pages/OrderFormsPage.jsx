import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const orderForms = [
  { id: 1, name: "Sensational Foods" },
  { id: 2, name: "Baristha Foods" },
];

export default function OrderFormsPage() {
  const [search, setSearch] = useState("");
  const [filteredForms, setFilteredForms] = useState(orderForms);

  const navigate = useNavigate();
  const location = useLocation();
  const store = new URLSearchParams(location.search).get("store") || "Unknown";

  useEffect(() => {
    const filtered = orderForms.filter((form) =>
      form.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredForms(filtered);
  }, [search]);

  const handleFormSelect = (formId) => {
    navigate(`/controller?formId=${formId}&store=${store}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-950 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Select Order Form for <span className="text-blue-600">{store}</span>
        </h2>

        <input
          type="text"
          placeholder="Search order forms..."
          className="w-full mb-6 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-4">
          {filteredForms.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No order forms found.
            </p>
          ) : (
            filteredForms.map((form) => (
              <button
                key={form.id}
                onClick={() => handleFormSelect(form.id)}
                className="w-full p-5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg transition transform hover:scale-[1.02] text-left"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {form.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Tap to open this order form
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
