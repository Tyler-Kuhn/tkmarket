import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./constants/api";
import { User, Address } from "./constants/interfaces";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
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

        const addressRes = await fetch(API_ENDPOINTS.ADDRESSES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!addressRes.ok) {
          console.error("Failed to fetch addresses");
        } else {
          const addressData = await addressRes.json();
          setAddresses(addressData);
        }
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

            <div className="p-4 rounded-md bg-gray-100">
              <strong>Addresses:</strong>
              <ul className="mt-2 space-y-2">
                {addresses.length === 0 ? (
                  <li className="text-gray-500 text-sm">No addresses found</li>
                ) : (
                  addresses.map((addr) => (
                    <li
                      key={addr.id}
                      className="p-3 rounded bg-white shadow-sm border text-sm text-gray-700"
                    >
                      <div>
                        <strong>Type:</strong> {addr.type}
                      </div>
                      <div>{addr.street}</div>
                      <div>
                        {addr.city}, {addr.state} {addr.zip}
                      </div>
                      <div>{addr.country}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <button
                onClick={() => navigate("/orders")}
                className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                View Orders
              </button>
            </div>

            {/* Update Email/Password Form */}
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

            {/* Add New Address Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");
                if (!token) return setError("You must be logged in.");

                const formData = new FormData(e.currentTarget);
                const street = formData.get("street");
                const city = formData.get("city");
                const state = formData.get("state");
                const zip = formData.get("zip");
                const country = formData.get("country");
                const type = formData.get("type");

                try {
                  const res = await fetch(API_ENDPOINTS.ADDRESSES, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      street,
                      city,
                      state,
                      zip,
                      country,
                      type,
                    }),
                  });

                  if (!res.ok) {
                    const data = await res.json();
                    setError(data.error || "Failed to add address");
                    return;
                  }

                  const newAddress = await res.json();
                  setAddresses((prev) => [...prev, newAddress]);
                  setError(null);
                  e.currentTarget.reset();
                } catch {
                  setError("Failed to add address. Try again later.");
                }
              }}
              className="space-y-4 mt-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street
                </label>
                <input
                  name="street"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  name="city"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  name="state"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  name="zip"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  name="country"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">Select Type</option>
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                  <option value="billing/shipping">Billing/Shipping</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-500"
              >
                Add Address
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
