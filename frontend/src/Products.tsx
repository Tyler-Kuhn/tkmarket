import NavBar from "./components/NavBar";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "./constants/api";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.PRODUCTS);

        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Failed to fetch products");
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Network error while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {error && (
          <div className="text-red-600 bg-red-100 p-4 rounded-xl col-span-full">
            {error}
          </div>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
