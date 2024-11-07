import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
// import './Login.css';
import NavBar from './NavBar';
// import { BrowserRouter, Routes,Route } from 'react-router-dom';
import {Link} from "react-router-dom"
// import Login from './Main';




const Login =() =>{
  const navigate = useNavigate()
  const [authdata,setData] = useState({
    "email":" ",
    "password":" ",
    "roles" : ["LENDER","BORROWER"]
    // accessToken:" "

  })

{
// const apiurl = "http://localhost:9002/auth/login";
//   function myFunction() {
//     var x = document.getElementById("pass");
//     if (x.type === "password") {
//       x.type = "text";
//     } else {
//       x.type = "password";
//     }
// }

// function saveTokeninlocalstorage(tokenDetails){
//   localStorage.setItem('accessToken',JSON.stringify({tokenDetails}))
// }

// function caps(){ 
// var input = document.getElementById("pass");
// var text = document.getElementById("text");
// input.addEventListener("keyup", function(event) {



const changeHandler= b => {
  // this.changeHandler = this.changeHandler.bind(this);
  setData({...authdata,[b.target.name]:b.target.value})
  console.log(authdata.email)
}


const submitHandler = b=>{
  b.preventDefault();

  var x = document.forms["myForm"]["email"].value;
  if (x == "" || x == null) {
    alert("Name must be filled out");
    return false;
  }

  var y = document.forms["myForm"]["password"].value;
  if (y == "" || y == null) {
    alert("Name must be filled out");
    return false;
  }



  (localStorage.setItem('email',JSON.stringify(authdata.email)))
  
  // console.log(b.target.email)
  // await fetch(`http://localhost:9002/auth/login/sanjay@gmail.com`,
  // const url= "http://localhost:9002/auth/login/"+JSON.parse(localStorage.getItem('email'))
  fetch("http://localhost:9002/auth/login/"+(JSON.parse(localStorage.getItem('email'))),
  {
    method:"POST",
    body:JSON.stringify(authdata),
    headers: {
      "Content-Type" : "application/json; charset=UTF-8",
  }
  }
  )
    
  // .then(response => response.text())
  .then(response => response.json())
  .then(result => {localStorage.setItem('token',JSON.stringify(result.accessToken))})
  // .then(result => console.log(result))
  
  

  // console.log({data.accessToken})
  // .then(res=> {
  //   saveTokeninlocalstorage(res.data.accessToken)})
    // localStorage.setItem('accessToken',JSON.stringify({token}))})
    // .then(result => (localStorage.setItem('accessToken',JSON.stringify(result))))  
    .catch(Error => navigate('/Login'))
    navigate('/Redirect')
}


  
  
  return(

    

    <div>
      
      
      <center>
      <NavBar/>
        {/* <img src={require('./Hello.jpeg')} height="70px" width="350px" ></img> */}
      </center>
      
      

    
    
    
    

    <div className='border'>
 
      <center>

      
      <form onSubmit={submitHandler} name="myForm" method='post' required>
        
        <label>EMAIL:</label> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="email" name="email" placeholder="Email" onChange={changeHandler} className="rounded"/>
        <br></br>
        <br></br>
        <label>PASSWORD: </label>

        <input type="password" name="password" placeholder="Password" onChange={changeHandler} className="rounded"/>
        <br></br>
        <br></br>

        <input type="submit" value="Submit" class="btn btn-primary my-custom-btn"></input>
        
        <br></br>
        <br></br>
        <h3 className="h3"> New User? </h3>
        <br></br>
        <Link to="/SignUp"><button className="btn btn-primary my-custom-btn">Sign Up</button></Link>

     

     
     
     
   
    </form>
    </center>
    
    </div>
  
    
    
  </div>
  
  
  
  );

  }

  
}
  
    


export default Login;