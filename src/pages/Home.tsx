import { useState, useEffect } from "react";
import CardProduct from "../components/CardProduct/CardProduct";
import { useProduct } from "../context/useProduct";
import { FiFilter } from "react-icons/fi";
import { useTranslation } from "../hook/useTranslation";
import { useSearch } from "../context/useSearch";
import Carousel from "../components/Carousel/Carousel";

const Home = () => {
  const { products, productsLoading, error } = useProduct();
  // const [searchTerm, setSearchTerm] = useState("");
  const { searchTerm } = useSearch();
  const [sortBy, setSortBy] = useState("default");
  const { t } = useTranslation();

  // Si la carga tarda más de 4s, probablemente el backend (Render free) está
  // despertando de un cold start: mostramos un mensaje aclaratorio.
  const [showWakingMessage, setShowWakingMessage] = useState(false);
  useEffect(() => {
    if (!productsLoading) {
      setShowWakingMessage(false);
      return;
    }
    const timer = setTimeout(() => setShowWakingMessage(true), 4000);
    return () => clearTimeout(timer);
  }, [productsLoading]);

  // Filter and sort products based on search
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price),
    );
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price),
    );
  } else if (sortBy === "discount") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative left-1/2 -translate-x-1/2 w-screen mb-8">
        <Carousel />
      </div>
      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-700">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? t.product : t.products}
            </h2>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-600">
              {t.sortBy}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-low">{t.sortPriceLow}</option>
              <option value="price-high">{t.sortPriceHigh}</option>
              <option value="discount">{t.sortDiscount}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="pb-8">
        {productsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
            <p className="mt-4 text-gray-600 font-medium">
              {t.loadingProducts}
            </p>
            {showWakingMessage && (
              <p className="mt-2 text-sm text-gray-500 max-w-md text-center px-4">
                {t.wakingServer}
              </p>
            )}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {t.errorLoading}
            </p>
            <p className="text-gray-600">{t.tryAgain}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-2">
              {t.noProductsFound}
            </p>
            <p className="text-gray-600">{t.adjustFilters}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <CardProduct product={product} key={product._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
