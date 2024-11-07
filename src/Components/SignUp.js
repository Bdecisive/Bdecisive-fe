import { Link } from 'react-router-dom';
import NavBar from './NavBar';

function Home() {
    return (
      <>
        <NavBar />
        <div className="container d-flex flex-column justify-content-start align-items-center min-vh-100 pt-5">
          <h2 className='h2 text-center mb-4'>Choose what you're here for :</h2>
          <Link to="/RegistrationForm">
            <button className="btn btn-primary my-custom-btn mb-2">I'm here for reviews</button>
          </Link>
          <Link to="/RegistrationForm">
            <button className="btn btn-primary my-custom-btn mb-2">I'm an Influencer</button>
          </Link>
          <Link to="/RegistrationForm">
            <button className="btn btn-primary my-custom-btn mb-2">I'm a vendor</button>
          </Link>
        </div>
      </>
    );
}

export default Home;
