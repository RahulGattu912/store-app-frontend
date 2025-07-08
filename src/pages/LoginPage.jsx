import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/supabase"; // make sure this path is correct

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const store = new URLSearchParams(location.search).get("store") || "Unknown";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      // Check user store
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("store_name")
        .eq("id", signInData.user.id)
        .single();
      if (profileError) throw profileError;
      if (userProfile.store_name !== store) {
        setError("Unauthorized: You don't belong to this store.");
        setLoading(false);
        return;
      }
      navigate(`/order-forms?store=${store}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log(signUpData);
      // if (signUpError) throw signUpError;
      // Insert user into custom users table with assigned store
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: signUpData.user.id,
          email,
          store_name: store,
        },
      ]);
      if (insertError) throw insertError;
      navigate(`/order-forms?store=${store}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {showRegister ? "Register" : "Login"} to Order from <span className="text-blue-600">{store}</span>
        </h2>
        <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            {loading ? (showRegister ? "Registering..." : "Logging in...") : (showRegister ? "Register" : "Login")}
          </button>
        </form>
        {!showRegister && (
          <div className="mt-4 text-center">
            <span className="text-gray-600 dark:text-gray-300">New user? </span>
            <button
              className="text-blue-600 hover:underline font-semibold"
              onClick={() => setShowRegister(true)}
              type="button"
            >
              Register here.
            </button>
          </div>
        )}
        {showRegister && (
          <div className="mt-4 text-center">
            <button
              className="text-blue-600 hover:underline font-semibold"
              onClick={() => setShowRegister(false)}
              type="button"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
