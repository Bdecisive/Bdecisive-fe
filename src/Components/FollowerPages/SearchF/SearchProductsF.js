import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarFollower from '../NavBarFollower';

const products = [
  { id: 1, name: 'Product 1', description: 'Description of Product 1' },
  { id: 2, name: 'Product 2', description: 'Description of Product 2' },
  { id: 3, name: 'Product 3', description: 'Description of Product 3' },
  { id: 4, name: 'Product 4', description: 'Description of Product 4' },
  { id: 5, name: 'Product 5', description: 'Description of Product 5' },
];

function SearchProductsF() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <NavBarFollower />

    <div className="container mt-5">
      <h2 className="text-center">Search Products</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-primary" type="button">
          Search
        </button>
      </div>
      <ul className="list-group">
        {filteredProducts.map(product => (
          <li key={product.id} className="list-group-item">
            <h5>{product.name}</h5>
            <p>{product.description}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default SearchProductsF;
