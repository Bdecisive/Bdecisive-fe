import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Contact from './Components/Contact';
import Home from './Components/Home';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import RegistrationForm from './Components/RegistrationForm';
import ViewPostsFollowerHome from './Components/FollowerPages/ViewPostsFollowerHome';
import SearchProductsF from './Components/FollowerPages/SearchF/SearchProductsF';
import SearchInfluencersF from './Components/FollowerPages/SearchF/SearchInfluencersF';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />}/>
    <Route path="Contact" element={<Contact/>}/>
    <Route path="/Home" element={<Home />}/>
    <Route path="/Login" element={<Login />}/>
    <Route path="/SignUp" element={<SignUp />}/>
    <Route path="/RegistrationForm" element={<RegistrationForm />}/>
    <Route path="/ViewPostsFollowerHome" element={<ViewPostsFollowerHome />}/>
    <Route path="/SearchProductsF" element={<SearchProductsF />}/>
    <Route path="/SearchInfluencersF" element={<SearchInfluencersF />}/>

  </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();