import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./constants/api";
import { User } from "./constants/interfaces";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access.");
          navigate("/login");
          return;
        }

        const res = await fetch(API_ENDPOINTS.ACCOUNT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          let errorMessage = "Failed to fetch user data.";

          try {
            const errorData = await res.json();
            if (typeof errorData.error === "string") {
              errorMessage = errorData.error;
            }
          } catch {
            errorMessage = "Server error. Please try again later.";
          }

          setError(errorMessage);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Network error. Please check your connection.");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      <NavBar />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Your Account
          </h2>
        </div>

        {user ? (
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-4 text-sm text-gray-900">
            <div className="p-4 rounded-md bg-gray-100">
              <strong>Name:</strong> {user.name}
            </div>
            <div className="p-4 rounded-md bg-gray-100">
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <button
                onClick={() => navigate("/orders")}
                className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Orders
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");
                if (!token) return setError("You must be logged in.");

                const formData = new FormData(e.currentTarget);
                const email = formData.get("email");
                const password = formData.get("password");

                try {
                  const res = await fetch(API_ENDPOINTS.ACCOUNT, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, password }),
                  });

                  if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Update failed");
                    return;
                  }

                  const updated = await res.json();
                  setUser(updated);
                  setError(null);
                } catch (err) {
                  setError("Failed to update. Try again later.");
                }
              }}
              className="space-y-4 mt-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-500"
              >
                Update Info
              </button>
            </form>
          </div>
        ) : error ? (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        ) : (
          <div className="mt-4 text-center text-sm text-gray-500">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}
