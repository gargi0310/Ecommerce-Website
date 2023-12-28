import React from 'react';
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";


const Product = ({product}) => {

  const options = {
    edit:false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth< 700 ? 15:20,
    value:product.ratings,
    isHalf:true
}

  return (

    <Link className="productCard" to={product.id}>
        <img src={product.images[0].url} alt={product.name} />
        <p> {product.name} </p>
    
        <div>
            <ReactStars {...options} /> <span> ({product.numOfreviews} Reviews) </span>
        </div>

        <span> {`₹${product.price}`} </span>

    </Link>
    
  )
}

export default Product