import React, { useEffect, useState } from 'react'
import { getProducts, getCategories, getProductsByCategory } from '../services/Api';
import ProductCard from '../components/ProductCard'
import BannerSlider from '../components/BannerSlider';

const Home = ({ product, searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    // const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData);
            } catch (error) {
                console.log(error)
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);

            try {
                const data = selectedCategory === 'all'
                    ? await getProducts()
                    : await getProductsByCategory(selectedCategory);

                setProducts(data);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [selectedCategory]);

    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    )

    return (
        <div>
            <BannerSlider />
            <section className="premium-category-section">
                <div className="premium-category-header">
                    <h2>Explore Collections</h2>
                    <div className="title-accent"></div>
                </div>

                <div className="premium-category-scroll">
                    <button
                        className={`premium-category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`premium-category-pill ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            <div className='products-container'>
                {loading ? (
                    <div className='loader-block'>
                        <h2 className='loader'><i className="fa-solid fa-spinner fa-lg"></i></h2>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <h3 style={{ textAlign: "center" }}>
                        No Products Found..
                    </h3>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Home
