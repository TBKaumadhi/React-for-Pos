import { useEffect, useState } from "react";
import axios from "axios";
import CategoryType from "../types/CategoryType";
import ItemType from "../types/ItemType";

function Item() {
    const [items, setItems] = useState<ItemType[]>([]);
    const [itemName, setItemName] = useState<string>("");
    const [price, setItemPrice] = useState<number>(0.0);
    const [description, setItemDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null); // Correct type for image file
    const [categoryId, setCategoryId] = useState<number | undefined>();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [itemEditing, setItemEditing] = useState<ItemType | null>(null);

    useEffect(() => {
        loadItems();
        loadCategories();
    }, []);

    async function loadItems() {
        const response = await axios.get("http://localhost:8080/items");
        setItems(response.data);
    }

    async function loadCategories() {
        const response = await axios.get("http://localhost:8080/category");
        setCategories(response.data);
    }

    function handleItemImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; // Safely access the file
        if (file) {
            setImage(file); // Store the file
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Prevent page refresh

        const data = new FormData();
        data.append("name", itemName);
        data.append("price", price.toString());
        data.append("description", description);
        data.append("discount", "0");
        data.append("categoryId", categoryId?.toString() || "");
        if (image) {
            data.append("image", image); // Append the image file
        }

        try {
            await axios.post("http://localhost:8080/items", data);
            loadItems();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateItem(e: React.FormEvent) {
        e.preventDefault(); // Prevent page refresh

        const data = new FormData();
        data.append("name", itemName);
        data.append("price", price.toString());
        data.append("description", description);
        data.append("categoryId", categoryId?.toString() || "");
        if (image) {
            data.append("image", image); // Append the image if updated
        }

        try {
            await axios.put(`http://localhost:8080/items/${itemEditing?.id}`, data);
            loadItems();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    }

    function resetForm() {
        setItemName("");
        setItemPrice(0.0);
        setItemDescription("");
        setCategoryId(undefined);
        setImage(null); // Reset image state
        setItemEditing(null);
    }

    function editItem(item: ItemType) {
        setItemEditing(item);
        setItemName(item.name);
        setItemPrice(item.price);
        setItemDescription(item.description);
        setCategoryId(item.category?.id);
    }

    async function deleteItem(itemId: number) {
        try {
            await axios.delete(`http://localhost:8080/items/${itemId}`);
            loadItems();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Items</h1>

            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Img</th>
                        <th>Item Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>
                                <img
                                    src={`http://localhost:8080/images/${item.imgUrl}`}
                                    alt={item.name}
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </td>
                            <td>{item.price}</td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => editItem(item)}
                                    className="btn btn-warning me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteItem(item.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border p-4 rounded mt-4">
                <form onSubmit={itemEditing ? updateItem : handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Item Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(e) => setItemPrice(parseFloat(e.target.value))}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                            type="text"
                            className="form-control"
                            value={description}
                            onChange={(e) => setItemDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="form-control"
                            onChange={handleItemImage}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            required >
                            <option value="">Please select category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {itemEditing ? "Update Item" : "Create Item"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Item;
