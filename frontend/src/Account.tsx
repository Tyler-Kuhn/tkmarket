import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "./constants/api";
import { User, Address } from "./constants/interfaces";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
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
          headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (addressRes.ok) {
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

  const handleDeleteAddress = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Unauthorized");

    try {
      const res = await fetch(`${API_ENDPOINTS.ADDRESSES}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return setError("Failed to delete address");

      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch {
      setError("Network error. Try again later.");
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
  };

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in.");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const street = formData.get("street");
    const city = formData.get("city");
    const state = formData.get("state");
    const zip = formData.get("zip");
    const country = formData.get("country");
    const type = formData.get("type");

    const body = {
      street,
      city,
      state,
      zip,
      country,
      type,
    };

    try {
      let res;
      if (editingAddress) {
        // Update existing address
        res = await fetch(`${API_ENDPOINTS.ADDRESSES}/${editingAddress.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        // Add new address
        res = await fetch(API_ENDPOINTS.ADDRESSES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save address");
        return;
      }

      const savedAddress = await res.json();
      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === savedAddress.id ? savedAddress : addr
          )
        );
      } else {
        setAddresses((prev) => [...prev, savedAddress]);
      }

      setEditingAddress(null);
      form.reset();
      setError(null);
    } catch {
      setError("Failed to save address. Try again later.");
    }
  };

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
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4 mt-6">
              <h3 className="font-semibold">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <input
                name="street"
                required
                defaultValue={editingAddress?.street || ""}
                placeholder="Street"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                name="city"
                required
                defaultValue={editingAddress?.city || ""}
                placeholder="City"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                name="state"
                required
                defaultValue={editingAddress?.state || ""}
                placeholder="State"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                name="zip"
                required
                defaultValue={editingAddress?.zip || ""}
                placeholder="Zip Code"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <input
                name="country"
                required
                defaultValue={editingAddress?.country || ""}
                placeholder="Country"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <select
                name="type"
                required
                defaultValue={editingAddress?.type || ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Type</option>
                <option value="billing">Billing</option>
                <option value="shipping">Shipping</option>
                <option value="billing/shipping">Billing/Shipping</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-md bg-green-600 py-2 px-4 text-white hover:bg-green-500"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </button>
            </form>
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
