import axios from "axios";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import "./HomePage.css";
import { Header } from "../../components/Header";
import { ProductsGrid } from "./ProductsGrid";

export function HomePage({ cart , loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const searchInputText = searchParams.get("search");

  useEffect(() => {
    const getHomeData = async()=>{
    const urlPath = searchInputText ? `/api/products?search=${searchInputText}` : '/api/products';
    const response = await axios.get(urlPath);
      setProducts(response.data);
    };
    getHomeData();
  }, [searchInputText]);

  return (
    <>
      <link
        rel="icon"
        type="image/svg+xml"
        href="src/assets/images/icons/home-favicon.png"
      />
      <title>Ecommerce Project</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />

      </div>
    </>
  );
}
