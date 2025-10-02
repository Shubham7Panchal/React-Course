import "./Header.css";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import LogoWhite from "/src/assets/images/logo-white.png";
import MobileLogoWhite from "/src/assets/images/mobile-logo-white.png";

export function Header({ cart }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search");
  const [searchInputText, setSearchInputText] = useState(searchText || "");

  const searchInput = (event) => {
    setSearchInputText(event.target.value);
  };

  const searchRequiredInput = ()=> {
    navigate(`/?search=${searchInputText}`);
    setSearchInputText("");
  }


  const pressKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/?search=${searchInputText}`);
      setSearchInputText("");
    } else if (event.key === "Escape") {
      setSearchInputText("");
    }
  };

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });
  return (
    <>
      <div className="header">
        <div className="left-section">
          <NavLink to="/" className="header-link">
            <img className="logo" src={LogoWhite} />
            <img className="mobile-logo" src={MobileLogoWhite} />
          </NavLink>
        </div>

        <div className="middle-section">
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchInputText}
            onChange={searchInput}
            onKeyDown={pressKeyDown}
          />

          <button className="search-button" onClick={searchRequiredInput}>
            <img
              className="search-icon"
              src="/src/assets/images/icons/search-icon.png"
            />
          </button>
        </div>

        <div className="right-section">
          <NavLink className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </NavLink>

          <NavLink className="cart-link header-link" to="checkout">
            <img
              className="cart-icon"
              src="/src/assets/images/icons/cart-icon.png"
            />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </NavLink>
        </div>
      </div>
    </>
  );
}
