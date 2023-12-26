import React, { Fragment } from 'react';
import {CgMouse} from "react-icons/cg";
import "./Home.css";
import Product from "./Product.js";

const product = {
    id:"gargi",
    name:"Blue TShirt",
    images:[{url:"https://thehouseofrare.com/cdn/shop/products/IMG_0053_5c650849-9d9d-4cc3-8863-6a23778cd9a0.jpg?v=1675170808"}],
    price:"Rs 3000",
    

}

const Home = () => {
  return (
    <Fragment>

    <div className='banner'>
        <p>Welcome to Ecommerce</p>
        <h1>Find Amazing products below</h1>

        <a href='#container'>
            <button>
                Scroll <CgMouse />
            </button>
        </a>
    </div>

    <h2 className='homeHeading'>Featured Products</h2>

    <div className="container" id="container">
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
        <Product product={product} />
    </div>
    

    </Fragment>
  )
}

export default Home