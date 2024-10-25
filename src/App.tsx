

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';

import Item from './pages/Item';
import Stock from './pages/Stock';
import AddToCart from './pages/AddToCart';


function App() {
 
  return (   

      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />      
      <Route path="/category" element={<Category />} />
      <Route path="/cart/add-item" element={<AddToCart />} />
      <Route path="/items" element={<Item />} />
      <Route path="/stocks" element={<Stock />} />
      </Routes>      
      </BrowserRouter>     
  );
}

export default App
