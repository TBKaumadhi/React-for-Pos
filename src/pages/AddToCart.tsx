import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemType from '../types/ItemType';
import CartType from '../types/CartType';
import StockType from '../types/StockType';

function AddToCart() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [cart, setCart] = useState<{ id: number, quantity: number }[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [discount,setDiscount] = useState<number>(0);

  
    async function loadItems() {
      try {
        const response = await axios.get("http://localhost:8080/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    }
   

  async function loadStock() {
    try {
      const response = await axios.get("http://localhost:8080/stock");
      setStocks(response.data);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  }
  useEffect(( )=>{
    loadItems();
    loadStock();
  }),([]);

   
  useEffect(() => {
    let newTotal = 0;
  
    // Calculate the sum of all items
    cart.forEach(cartItem => {
      const item = items.find(i => i.id === cartItem.id);
  
      if (item) {
        const priceAfterDiscount = item.price - item.discount;
        setDiscount(item.discount);
        newTotal += priceAfterDiscount * cartItem.quantity;
      }
    });
  
      if (newTotal > 10000.0) {
      const discountFromCart = 0.1;
      const discountCart = newTotal * discountFromCart;
      newTotal -= discountCart;
      setDiscount(discountCart);
    }
  
    setTotal(newTotal); 
  }, [cart, items]);
   
  
  const handleQuantityChange = (itemId: number, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity } : cartItem
        );
      } else {
        return [...prevCart, { id: itemId, quantity }];
      }
    });
  };


  // Search through cart items and getting item IDs and quantities to send
  const saveCart = async () => {
    const cartItemIds = cart.map((cartItem) => cartItem.id);
    const quantities = cart.map((cartItem) => cartItem.quantity);

    try {
      await axios.post("http://localhost:8080/cart/add-item", {
        cartItemIds,
        quantities,
      });
      alert("Cart saved successfully!");
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  // Add item to cart when Add To Cart button clicked
  const addItemToCart = (item: ItemType) => {
    handleQuantityChange(item.id, 1); 
  };

   const removeItem = async (itemId:number )=>{
      const newCart = cart.filter(cartItem => cartItem.id !== itemId);
      setCart(newCart);
   }
 

  return (
    <div className="container">
      <h2 className="p-3 text-justify-center text-cyan">Explore</h2>
      <div className="d-flex flex-wrap gap-3 justify-content">
        {items.map((item) => (
          <div key={item.id} className="col-lg-4 d-flex align-items-stretch">
            <div className="border p-3 w-100" style={{ width: "30%" }}>
              <p>{item.name}</p>
              <p>{item.description}</p>
              <img
                src={`http://localhost:8080/images/${item.imgUrl}`}
                className="img-fluid"
                alt={item.name}
                style={{ width: "200px", height: "200px" }}
              />
              <p>Rs.{item.price}</p>
              <p>{item.discount}</p>
              <input
                type="number"
                min="1"                
                value={
                  cart.find((cartItem) => cartItem.id === item.id)?.quantity || 1
                }
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value, 10))
                }
              />
              <button onClick={() => addItemToCart(item)}>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && ( // This table renders only if items were added
        <div
          className="position-fixed top-0 end-0 bg-dark text-white p-4"
          style={{
            width: '400px',
            height: '100vh',
            overflowY: 'auto',
            zIndex: 1050,
          }}
        >
          <h3 className="text-center">Cart Details</h3>
          <table className="table table-responsive table-striped table-dark table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem) => {
                const item = items.find((i) => i.id === cartItem.id);
                return (
                  <tr key={cartItem.id}>
                    <td>{item?.name}</td>
                    <td>Rs.{item?.price}</td>
                    <td>{cartItem.quantity}</td>
                    <td>Rs.{(item?.price ||0) * cartItem.quantity}</td>
                    <td><button type="button" className='btn-danger'onClick={()=>removeItem(cartItem.id )}>Remove</button></td>
                  </tr>                  
                );
              })}
            </tbody>
          </table>
          <h4 className='px-3 text-white'>Total Amount:-Rs.{total}</h4>
          <h4 className='px-3 text-white'>Discount:-Rs. {discount}</h4>
          <button className="btn btn-primary mt-3 w-100" onClick={saveCart}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCart;