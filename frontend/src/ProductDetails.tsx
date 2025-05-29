import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "./constants/api";
import NavBar from "./components/NavBar";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.error || "Product not found");
          return;
        }

        const data = await res.json();
        setProduct(data[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Network error");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="p-6 max-w-4xl mx-auto">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-64 object-fit rounded-xl"
        />
        <h1 className="mt-6 text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{product.description}</p>
        <div className="mt-6 text-2xl font-semibold text-blue-700">
          ${product.price}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 me-5 rounded-lg hover:bg-blue-700 transition">
          Add to cart
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate(`/products`)}
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}
