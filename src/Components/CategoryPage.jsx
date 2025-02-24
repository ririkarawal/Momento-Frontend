import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUploadsByCategory, getCategories } from "../api/api";
import Top from "../Components/Top";
import "./../styles/CategoryPage.css";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [uploads, setUploads] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch uploads for this category
                const uploadsResponse = await getUploadsByCategory(categoryId);
                setUploads(uploadsResponse.data);
                
                // Fetch category details
                const categoriesResponse = await getCategories();
                const foundCategory = categoriesResponse.data.find(
                    cat => cat.id == categoryId
                );
                setCategory(foundCategory);
            } catch (error) {
                console.error("Error fetching category data:", error);
                setError("Failed to load category data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [categoryId]);

    return (
        <div className="category-page">
            <Top />
            
            <h1 className="category-title">{category ? category.categoryName : "Category"} Images</h1>
            
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div className="uploads-grid">
                    {uploads.length > 0 ? (
                        uploads.map(upload => (
                            <div key={upload.id} className="upload-card">
                                <div className="img-wrap">
                                    <img 
                                        src={`http://localhost:5000/uploads/${upload.imagePath}`} 
                                        alt={upload.description} 
                                    />
                                </div>
                                <p>{upload.description}</p>
                                <p>By: {upload.User?.username}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-uploads-message">No images found in this category</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;