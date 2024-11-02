import { useEffect, useState } from "react";
import axios from "axios";
import CategoryType from "../types/CategoryType";

function Categories() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryDescription, setCategoryDescription] = useState<string>("");
    
    const [categoryEditing, setCategoryEditing] = useState<CategoryType | null>(null); // Track the category being edited

   
    async function loadCategories() {
        const response = await axios.get("http://localhost:8080/category");
        setCategories(response.data);
    }

    useEffect(() => {
        loadCategories();
    }, []);


    // Handle form submission for creating a new category
    async function handleSubmit(e:React.FormEvent) {
        e.preventDefault();
        const data = { name: categoryName,
            description: categoryDescription
         };
        try {
            await axios.post("http://localhost:8080/category", data);
            loadCategories(); 
            resetForm();
        } catch (error) {
            console.log(error);
        }
    }

    
    async function updateCategory(e:React.FormEvent) {
        e.preventDefault();
        if (!categoryEditing) return; // Ensure a category is selected for editing

        const data = {
             name: categoryName,
             description:categoryDescription };
        try {
            await axios.put(`http://localhost:8080/category/${categoryEditing.id}`, data);
            loadCategories(); 
            resetForm(); 
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteCategory(id:number) {
        try {
            await axios.delete(`http://localhost:8080/items/${id}`);
            loadCategories();
        } catch (error) {
            console.log(error);
        }
    }

    // Set category for editing and pre-fill the form with its details
    function editCategory(category: CategoryType) {
        setCategoryEditing(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
    }

    // Reset form and editing state
    function resetForm() {
        setCategoryEditing(null);
        setCategoryName("");
        setCategoryDescription("");
    }

    return (
        <div className="container my-5" >
            <h1 className="text-center mb-4">Categories</h1>

            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Category Name</th>
                        <th>Category Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category)=> (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => editCategory(category)}
                                    className="btn btn-warning me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteCategory(category.id)}
                                    className="btn btn-danger"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
    <h2>{categoryEditing ? "Edit Category" : "Create Category"}</h2>
    <div className="border p-4 rounded mt-4">
    <form onSubmit={categoryEditing ? updateCategory : handleSubmit}>
        <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
                type="text"
                className="form-control"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
            />
        </div>

               <div className="mb-3">
            <label className="form-label">Description</label>
            <input
                type="text"
                className="form-control"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                required
            />
        </div>

        <button type="submit" className="btn btn-primary">
            {categoryEditing ? "Update Item" : "Create Item"}
        </button>
    </form>
</div>
</div>
);
}

