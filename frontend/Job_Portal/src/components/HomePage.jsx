import React, { Component } from 'react'
import '../css/HomePage.css'
import { BASEURL,callApi,setSession } from '../api';
export class HomePage extends Component {
  constructor()
  {
    super();
    this.userRegistration = this.userRegistration.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.signin=this.signin.bind(this);
  }
  showSigIn(){
    let popup = document.getElementById("popup");
    let signIn=document.getElementById("signIn");
    let signup=document.getElementById("signup");
    let popupHeader=document.getElementById("popupHeader");
    popupHeader.innerHTML='login';
    signIn.style.display="block";
    signup.style.display="none";
    popup.style.display="block";
  }
  showsingup(){
    let popup = document.getElementById("popup");
    let signIn=document.getElementById("signIn");
    let signup=document.getElementById("signup");
    let popupHeader=document.getElementById("popupHeader");
    popupHeader.innerHTML='signup';
    signIn.style.display="none";
    signup.style.display="block";
    popup.style.display="block";

    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let  signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");
    fullname.value = "";
    email.value = "";
    role.value = "";
    signuppassword.value = "";
    confirmpassword.value = "";

  }

  closeSingin(event){
    if(event.target.id==="popup"){
      let popup=document.getElementById("popup");
      popup.style.display="none";
    }
  }

  userRegistration()
  {
        let fullname = document.getElementById("fullname");
        let email = document.getElementById("email");
        let role = document.getElementById("role");
        let  signuppassword = document.getElementById("signuppassword");
        let confirmpassword = document.getElementById("confirmpassword");

        fullname.style.border = "";
        email.style.border = "";
        role.style.border = "";
        signuppassword.style.border = "";
        confirmpassword.style.border = "";
        if(fullname.value=="")
        {
          fullname.style.border = "1px solid red";
          fullname.focus();
          return;
        }
        if(email.value=="")
          {
            email.style.border = "1px solid red";
            email.focus();
            return;
          }
          if(role.value=="")
            {
              role.style.border = "1px solid red";
              role.focus();
              return;
            }
            if(signuppassword.value=="")
              {
                signuppassword.style.border = "1px solid red";
                signuppassword.focus();
                return;
              }
              if(confirmpassword.value=="")
                {
                  confirmpassword.style.border = "1px solid red";
                  confirmpassword.focus();
                  return;
                }
                if(signuppassword.value !== confirmpassword.value)
                {
                  signuppassword.style.border = "1px solid red";
                  signuppassword.focus();
                  return;
                }

  


        var data = JSON.stringify({
              fullname : fullname.value,
              email : email.value,
              role : role.value,
              password : signuppassword.value
        })
        callApi("POST", "http://localhost:8080/users/signup", data, this.getResponse)
  }
  getResponse(res){
    let resp = res.split('::');
    alert(resp[1]);
    if (resp[0] === "200")
      {
          let signin = document.getElementById("signin");
          let signup = document.getElementById("signup");
          signin.style.display = "block";
          signup.style.display = "none";
      }
  }
  forgotPasswordResponse(res)
  {
      let data = res.split('::');
      if (data[0] === "200")
          responseDiv.innerHTML =` <br/><br/><label style='color:green'>${data[1]}</label>`;
      else
      responseDiv.innerHTML =`<br/><br/><label style='color:red'>${data[1]}</label>`;
  }
  forgotPassword()
  {
    username.style.border="";
    if(username.value==="")
    {
      username.style.border="1px solid red";
      username.focus()
      return;
    }

    let url="http://localhost:8080/users/forgotpassword/"+username.value;
    callApi("GET",url,"",this.forgotPasswordResponse);
  }
  signin()
  {
    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";
    if(username.value === "")
    {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    if(password.value === "")
    {
      password.style.border = "1px solid red";
      password.focus();
      return;
    }
    let data = JSON.stringify({
      email : username.value,
      password : password.value
    });
    callApi("POST",BASEURL+"users/signin",data,this.signinResponse);
  }

  signinResponse(res){
    let rdata = res.split("::");
    if(rdata[0] === "200")
    {
      setSession("csrid", rdata[1],1);
      window.location.replace("/dashboard");
    }
    else{
      let responseDiv = document.getElementById("responseDiv");
      responseDiv.innerHTML = `<br/><br/><label style="color:red">${rdata[1]}</label>`;
    }
  }
  render() {
    return (

      <div id="base">

        <div id='popup' onClick={this.closeSingin}>
          <div className='popupWindow'>
          <div id='popupHeader'>Login</div>
          <div id='signIn'>
            <label className='usernameLabel'>Username:</label>
            <input type='text' id='username'/>
            <label className='passwordLabel'>Password:</label>
            <input type='password' id='password'/>
            <div className='forgotPassword'>Forgot <label onClick={this.forgotPassword}>Password?</label></div>
            <button className='signinButton' onClick={this.signin}>Sign In</button>
            <div className='div1' id='responseDiv'></div>
          </div>
          <div id='signup'>
            <label>Full Name:</label>
             <input type='text'id='fullname'/>
             <label>Email</label>
             <input type='email'id='email'/>
             <label>Select Role:</label>
             <select id='role'>
                <option value></option>
                <option value='1'>Admin</option>
                <option value='2'>Employer</option>
                <option value='3'>job seeker</option>
             </select>
             <label>Password:</label>
             <input type='password'id="signuppassword"/>
             <label>Confirm Password:</label>
          <input type='password' id="confirmpassword" />
             <button onClick={this.userRegistration}>Register Now</button>
             <div>Already have an account?<span onClick={this.signIn}>SIGN IN</span></div>
          </div>
          <div className='div1'></div>
          <div className='div2'>
            Dont have an account?
            <label onClick={this.showsingup}> SIGNUP NOW</label>
          </div>
          </div>
        </div>

        <div id="header">
          <img className='logo' src='./images/logo1.png' alt='no' />
          <img className='signinIcon' src='./images/user.png' alt='sign' />
          <label className='signinText'onClick={this.showSigIn}>SignIn</label>
        </div>


      <div id="content"> 
      <div>
        <div className='text1'>Indias #1 job portal - kl job portal</div>
        <div className='text2'>Your job search ends here</div>
        <div className='text3'>Discover career oppurtunities</div>
        </div>
        <div className='searchBar'>
          <input type='text' className='searchText' placeholder='Search by Skill' />
          <input type='text' className='searchLocation' placeholder='Job Location' />
          <button className='searchButton'> SearchJob</button>
        
        </div>
      </div>


        
        <div id='footer'>
          <label className='copyrightText'>Copyright&copy;B.Mohan Reddy - K L University.All rights reserved </label>
          <img className='socialmediaIcon' src='./images/facebook.png'/>
          <img className='socialmediaIcon' src='./images/linkedin.png'/>
          <img className='socialmediaIcon' src='./images/twitter.png'/>
        </div>

        
      </div>
    )
  }
}

export default HomePage