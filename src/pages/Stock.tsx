import { useState, useEffect } from "react";
import axios from "axios";
import ItemType from "../types/ItemType";
import StockType from "../types/StockType";


function Stock() {
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [availableStock, setAvailableStock] = useState<number | undefined>();
  const [itemId, setItemId] = useState<number | undefined>();
  const [items, setItems] = useState<ItemType[]>([]);
  const [stockEditing, setStockEditing] = useState<StockType | null>(null);

  // Load Items and Stocks
  async function loadItems() {
    const response = await axios.get("http://localhost:8080/items");
    setItems(response.data);
  }

  async function loadStocks() {
    const response = await axios.get("http://localhost:8080/stock");
    setStocks(response.data);
  }

  useEffect(() => {
    loadStocks();
    loadItems();
  }, []);

  
  async function handleSubmit() {
    const data = { availableStock, itemId };

    try {
      await axios.post("http://localhost:8080/stock", data);
      loadStocks();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateStock() {
    const data = { availableStock, itemId };

    try {
      if (stockEditing) {
        await axios.put(`http://localhost:8080/stock/${stockEditing.id}`, data);
        loadStocks();
        resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Handle form state and reset
  function resetForm() {
    setStockEditing(null);
    setAvailableStock(0);
    setItemId(0);
  }

  function editStock(stock: StockType) {
    setStockEditing(stock);
    setAvailableStock(stock.availableStock);
    setItemId(stock.item?.id);
  }

  async function deleteStock(stockId: number) {
    try {
      await axios.delete(`http://localhost:8080/stock/${stockId}`);
      loadStocks();
    } catch (error) {
      console.error(error);
    }
  }

  function handleItemId(e: React.ChangeEvent<HTMLSelectElement>) {
    setItemId(parseInt(e.target.value));
  }

  function handleStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAvailableStock(parseInt(e.target.value));
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Stocks</h1>

      <table className="table table-striped border">
        <thead>
          <tr>
            <th>Stock Id</th>
            <th>Available Stock</th>
            <th>Item Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.id}</td>
              <td>{stock.availableStock}</td>
              <td>{stock.item?.name || "N/A"}</td>
              <td>
                <button
                  type="button"
                  onClick={() => editStock(stock)}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteStock(stock.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="mt-4">
        <div className="mb-3">
          <label className="form-label">Available Stock</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={availableStock || ""}
            onChange={handleStockChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Item</label>
          <select
            className="form-select"
            value={itemId || ""}
            onChange={handleItemId}
            required
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {stockEditing ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={updateStock}
          >
            Update Stock
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            Create Stock
          </button>
        )}
      </form>
    </div>
  );
}
export default Stock;
