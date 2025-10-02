import axios from "axios";
import { useState, Fragment } from "react";
import { formatMoney } from "../../utils/money";

export function CartItemDetails({cartItem, loadCart}) {
  const[isBeingUpdated, setIsBeingUpdated] = useState(false);
  const[quantity, setQuantity] = useState(cartItem.quantity);

  const deleteCartItem = async()=>{
    await axios.delete(`/api/cart-items/${cartItem.productId}`);
    await loadCart();
  }

  const updateQuantityInput = (event)=>{
    setQuantity(event.target.value);
  };
  const updateQuantity = async () => {
  if (!isBeingUpdated) {
    setIsBeingUpdated(true); // just switch to edit mode
  } else {
    await axios.put(`/api/cart-items/${cartItem.product.id}`, {
      quantity: Number(quantity),
    });
    await loadCart();
    setIsBeingUpdated(false); // switch back to label
  }
};

  const pressKeyDown = async (event)=>{
    if(event.key === 'Enter'){
      await axios.put(`/api/cart-items/${cartItem.product.id}`, {
      quantity: Number(quantity),
      });
      await loadCart();
      setIsBeingUpdated(false); // switch back to label
    }else if(event.key === 'Escape'){
      setQuantity(cartItem.quantity);
      setIsBeingUpdated(false);
    }
  };


  return (
    <Fragment>

        <img className="product-image" src={cartItem.product.image} />

        <div className="cart-item-details">
          <div className="product-name">{cartItem.product.name}</div>
          <div className="product-price">
            {formatMoney(cartItem.product.priceCents)}
          </div>
          <div className="product-quantity">
            <span>
              Quantity:{" "}
              {isBeingUpdated ? 
              (<input className="select-quantity" type="text" value={quantity} onChange={updateQuantityInput} onKeyDown={pressKeyDown} style={{width: "40px" }} />):
              (<span className="quantity-label">{cartItem.quantity}</span>)}
            </span>
            <span className="update-quantity-link link-primary" onClick={updateQuantity}>Update</span>
            <span className="delete-quantity-link link-primary" onClick={deleteCartItem}>Delete</span>
          </div>
          </div>
    </Fragment>
  );
}
