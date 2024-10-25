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

    
    function handleCategoryName(event: any) {
        setCategoryName(event.target.value);
    }
    function handleCategoryDescription(event: any) {
        setCategoryDescription(event.target.value);
    }


    // Handle form submission for creating a new category
    async function handleSubmit() {
        const data = { name: categoryName,
            description: categoryDescription
         };
        try {
            await axios.post("http://localhost:8083/categories", data);
            loadCategories(); 
            resetForm();
        } catch (error) {
            console.log(error);
        }
    }

    
    async function updateCategory() {
        if (!categoryEditing) return; // Ensure a category is selected for editing

        const data = { name: categoryName };
        try {
            await axios.put(`http://localhost:8083/categories/${categoryEditing.id}`, data);
            loadCategories(); 
            resetForm(); 
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
        <div className="container mt-5" >
            <h1 className="mb-4 text-center">Categories</h1>
            {categories.map((category: CategoryType) => (
                <div key={category.id}>
                    {category.name}
                    {category.description}
                    <button onClick={() => editCategory(category)}>Edit</button>
                </div>
            ))}

            <h2>{categoryEditing ? "Edit Category" : "Create Category"}</h2>
            <form>
                <label>Category Name</label>
                <input
                    type="text"
                    value={categoryName}
                    onChange={handleCategoryName}                
                    required
                />
                <input
                    type="text"
                    value={categoryDescription}
                    onChange={handleCategoryDescription}                
                    required
                />
                {categoryEditing ? (
                    <button type="button" onClick={updateCategory}>Update Category</button>
                ) : (
                    <button type="button" onClick={handleSubmit}>Create Category</button>
                )}
            </form>
        </div>
    );
}

export default Categories;