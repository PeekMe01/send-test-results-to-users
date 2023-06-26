import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";
import './body.css';

export default function Body(props) {
    const id = props.user.id;
    const username = props.user.username;
    const password = props.user.password;
    const [send_to,setSend_to] =useState();
    const [result_context, setResult_context] = useState();
    const [serverResponse, setServerResponse] = useState('');
    const [refresh,setRefresh] = useState('');
    const [results, setResults] = useState([{ send_by:null, result_text:null}]);

    useEffect(()=> {
        if(props.user.permission==1) return;

        const userInfo = { id, username, password };

        getResults(userInfo);
    }, []);

    const getResults = async(userInfo) =>{
      try {
        const response = await axios.post(
          "http://localhost:8081/getresults",
          userInfo
        );
        //console.log(response.data.result);
        setResults(response.data.result);
        setServerResponse(response.data.message);
        document.getElementById('serverResponseId').className = 'goodResponse';

      } catch (error) {
        setServerResponse(error.response.data.error);
        setResults([{}]);
        document.getElementById('serverResponseId').className = 'badResponse';
        //console.log(error)
      }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const userInfo = { username, password, send_to, result_context };
        // send the username and password to the server
        try {
          const response = await axios.post(
            "http://localhost:8081/sendresults",
            userInfo
          );
          setServerResponse(response.data.message);
          setResult_context('');
          setSend_to('');
          document.getElementById('serverResponseId').className = 'goodResponse';
        } catch (error) {
          console.log(error.response.data.error);
          setServerResponse(error.response.data.error);
          document.getElementById('serverResponseId').className = 'badResponse';
        }
      };
    
      const refreshTable = e =>{
        setServerResponse('Refreshing...');
        const userInfo = { id, username, password };
        getResults(userInfo);
        setRefresh('1');
        setRefresh('0');
      }

    if(props.user.permission==1){
        return (
            <div className='form__center'>
              <form onSubmit={handleSubmit}>
                <small id='serverResponseId'>{serverResponse}</small>
                <div>
                    <strong><label htmlFor='receiver'>Send to</label></strong>
                    <input type='text' name='receiver' placeholder='Enter receiver name' className='input__text'
                    onChange={({ target }) => setSend_to(target.value)} value={send_to}></input>
                </div>
                <div className='resultstext__label'>
                    <strong><label htmlFor='result'>Results Text</label></strong>
                </div>
                <div>
                    <textarea className='input__text results__textarea' placeholder='Enter results text'
                    onChange={({ target }) => setResult_context(target.value)} value={result_context}></textarea>
                </div>
                <button type="submit">Send results</button>
              </form>
            </div>
        )
    }else if(props.user.permission==0){

        

        return (
            <div className='result__page'>
                <button className='refresh__button' onClick={refreshTable}>Refresh</button>
                <small id='serverResponseId'>{serverResponse}</small>
                <table className='testresult__table'>
                <thead>
                  <tr>
                    <th>Send By</th>
                    <th>Test Results</th>
                  </tr>
                </thead>
                <tbody>
                {results.map((data,i)=>(
                  //console.log(data.send_by);
                  //console.log(data.result_text);
                    <tr key={i}>
                        <td>{data.send_by}</td>
                        <td>{data.result_text}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
            </div>
        )
    }
}
