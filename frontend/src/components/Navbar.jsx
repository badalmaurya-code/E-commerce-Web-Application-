import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/CartService";


const Navbar = ({ searchTerm, setSearchTerm}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const updateCartCount = () => {
        const currentCart = getCart();
        const totalCount = currentCart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
    };

    const updateAuth = () => {
        const auth = localStorage.getItem("shopmartAuth") === "true";
        setIsLoggedIn(auth);

        const userJson = localStorage.getItem("shopmartUser");
        if (auth && userJson) {
            try {
                const user = JSON.parse(userJson);
                setUserEmail(user?.email || "");
            } catch {
                setUserEmail("");
            }
        } else {
            setUserEmail("");
        }

        if (!auth) {
            setProfileOpen(false);
        }
    };

    useEffect(() => {
        updateCartCount();
        updateAuth();
        window.addEventListener("cartUpdated", updateCartCount);
        window.addEventListener("storage", updateCartCount);
        window.addEventListener("storage", updateAuth);
        window.addEventListener("authChanged", updateAuth);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("storage", updateAuth);
            window.removeEventListener("authChanged", updateAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("shopmartAuth");
        window.dispatchEvent(new Event("authChanged"));
        setProfileOpen(false);
        navigate("/");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <h2 className="navbar-brand">♻️ShopMart</h2>
            
            <div className="navbar-search">
                <input
                    type="search"
                    placeholder="Search Products"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value)}} 
                />
                <button className="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>

            <div className="navbar-actions">
                <Link to="/about" className="nav-link">About Us</Link>
                {isLoggedIn ? (
                    <div className="profile-menu-wrapper">
                        <button
                            type="button"
                            className="nav-button profile-toggle"
                            onClick={() => setProfileOpen((current) => !current)}
                        >
                            Profile <i className="fa-solid fa-caret-down"></i>
                        </button>
                        {profileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-card">
                                    <span>Logged in as</span>
                                    <strong>{userEmail}</strong>
                                </div>
                                <button type="button" className="dropdown-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="nav-button">Login</Link>
                )}
                <Link to="/cart" className="cart-link">
                    <i className="fa-solid fa-cart-shopping fa-lg"></i>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
            </div>

            <button className="hamburger" onClick={toggleMobileMenu}>
                <i className="fa-solid fa-bars"></i>
            </button>

            {isMobileMenuOpen && (
                <div className="mobile-menu active">
                    <div className="mobile-search">
                        <input
                            type="search"
                            placeholder="Search Products"
                            value={searchTerm}
                            onChange={(e) => {setSearchTerm(e.target.value)}} 
                        />
                        <button className="search-btn"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <Link to="/about" className="mobile-link" onClick={closeMobileMenu}>
                        <i className="fa-solid fa-circle-info"></i> About Us
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <div className="mobile-link mobile-profile">
                                <i className="fa-solid fa-user"></i> {userEmail}
                            </div>
                            <button type="button" className="mobile-login" onClick={() => { closeMobileMenu(); handleLogout(); }}>
                                <i className="fa-solid fa-right-from-bracket"></i> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="mobile-login" onClick={closeMobileMenu}>
                            <i className="fa-solid fa-right-to-bracket"></i> Login
                        </Link>
                    )}
                    <Link to="/cart" className="mobile-cart" onClick={closeMobileMenu}>
                        <i className="fa-solid fa-cart-shopping"></i> Cart
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
