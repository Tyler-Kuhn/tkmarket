import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "./constants/api";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized access.");
          navigate("/login");
          return;
        }

        const res = await fetch(API_ENDPOINTS.ORDERS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch orders.");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900">Your Orders</h1>

        {loading && <p className="text-gray-500">Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="text-sm text-gray-700">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
                <p><strong>Total:</strong> ${Number(order.totalPrice).toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status || "Processing"}</p>
                <p><strong>Shipping Address:</strong> {order.address?.street}, {order.address?.city}, {order.address?.zipCode}</p>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Items:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      Product Name:  {item.product?.name || "Unknown Product"} — Quantity: {item.quantity} — Price: ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
