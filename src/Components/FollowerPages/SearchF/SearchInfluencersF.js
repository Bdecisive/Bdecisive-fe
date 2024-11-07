import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBarFollower from '../NavBarFollower';

const products = [
  { id: 1, name: 'Sanjay', description: 'Description' },
  { id: 2, name: 'Jae', description: 'Description ' },
  { id: 3, name: 'Olivia', description: 'Description ' },
  { id: 4, name: 'Limon', description: 'Description ' },
  { id: 5, name: 'Kavya', description: 'Description ' },
];

function SearchInfluencersF() {
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
      <h2 className="text-center">Search Influencers</h2>
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

export default SearchInfluencersF;
