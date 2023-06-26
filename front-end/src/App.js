import './index.css'
import Nav from './component/nav/Nav'
import Body from './component/body/Body' 
import { useState, useEffect } from 'react';
import axios from "axios";


function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState();
  const [permission, setPermission] = useState();
  const [user, setUser] = useState({id: null,username: null,password: null,permission: null})
  const [noAcc, setNoAcc] = useState("");
  const [serverResponse, setServerResponse] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      console.log(loggedInUser)
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const userInfo = { username, password };
    // send the username and password to the server
    try {
      const response = await axios.post(
        "http://localhost:8081/login",
        userInfo
      );

      // set the state of the user
    setUser(
      response.data.data.id,
      response.data.data.username,
      response.data.data.password,
      response.data.data.permission
      )
    // store the user in localStorage
    localStorage.setItem('user', JSON.stringify(response.data.data));
    console.log(response.data.message);
    setServerResponse(response.data.message);
    document.getElementById('serverResponseId').className = 'goodResponse';

    window.location.reload(false);
    } catch (error) {
      console.log(error.response.data.error);
      setServerResponse(error.response.data.error);
      document.getElementById('serverResponseId').className = 'badResponse';

    }
    
    
  };
  if(noAcc=='true'){
    return (
    <div className='tooBad_div'>
      Too bad, ask Ralph for an account.
      <button onClick={()=>setNoAcc('false')} className='goBack__button'>Go back</button>
    </div>
    )
  }

// if there's a user show the message below
  if (user.id != null) {
    return (
    <div>
      <Nav user={user}/>
      <Body user={user}/>
    </div>
      )
  }

  // if there's no user, show the login form
  return (
    <>
    
    <div class="form__center">
      <form onSubmit={handleSubmit}>
      <small id='serverResponseId'>{serverResponse}</small>
        <div>
          <strong><label htmlFor="username">Username: </label></strong>
          <input
            className='input__text'
            type="text"
            value={username}
            placeholder="enter a username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <strong><label htmlFor="password">Password: </label></strong>
          <input
            className='input__text'
            type="password"
            value={password}
            placeholder="enter a password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <small>No account? Click <u className='underline' onClick={()=>setNoAcc('true')}>here</u>.</small>
      </form>
    </div>
    </>
  );
}

export default App;
