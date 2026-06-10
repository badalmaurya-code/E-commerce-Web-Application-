import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
    return (
        <div className="aboutus-page">
            <section className="aboutus-hero">
                <div>
                    <p className="aboutus-subtitle">Welcome to ShopMart</p>
                    <h1>We make online shopping simple, fast, and secure.</h1>
                    <p className="aboutus-text">
                        ShopMart is built for customers who want smart product discovery, reliable delivery,
                        and a friendly shopping experience. Discover curated products, fast support, and
                        savings every day.
                    </p>
                    <Link to="/" className="aboutus-button">Go to Home</Link>
                </div>
            </section>

            <section className="aboutus-grid">
                <article className="aboutus-card">
                    <h2>Trusted Quality</h2>
                    <p>Every product is reviewed for quality, so you can shop confidently from brands you trust.</p>
                </article>
                <article className="aboutus-card">
                    <h2>Fast Delivery</h2>
                    <p>Enjoy speedy shipping and easy tracking on every order, with timely updates at your fingertips.</p>
                </article>
                <article className="aboutus-card">
                    <h2>Customer Support</h2>
                    <p>Our support team is ready to help you 24/7, with quick answers and friendly guidance.</p>
                </article>
                <article className="aboutus-card">
                    <h2>Smart Savings</h2>
                    <p>Find great deals, seasonal offers, and handpicked collections tailored to your needs.</p>
                </article>
            </section>
        </div>
    )
}

export default AboutUs
