import { useEffect, useState } from "react";
import './App.css';
import {io} from "socket.io-client";

function App() {
  const [message , setMessage] = useState("");
  const [room , setRoom] = useState("");
  const [socketId , setSocketId] = useState("");
  const [saveMessage, setSaveMessage] = useState([{
    userId: '',
    text: ''
  }])

  const socket = io("http://localhost:8080");

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit('message',{message,room,socketId});
    const data = {userId:socketId,text:message}
    setSaveMessage(preMessage =>[...preMessage,data]);
    setMessage("");
  }

  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketId(socket.id);
      console.log('user connected',socket.id);
    });
    socket.on("receive-message",(data)=>{
      console.log(data);
      setSaveMessage(preMessage =>[...preMessage,data]);
      console.log(saveMessage);
    })

    return ()=>{
      socket.disconnect();
    };

  },[]);

 

  return (
    <>
    <h2>Chat App</h2>
    <div className="container">
    
    <div className="output-area" id="outputArea">
  {saveMessage ? saveMessage.map((msg, index) => (
    <div key={index} className={`message ${msg.userId === socketId ? 'sender' : 'receiver'}`}>
      <span>{msg.text}</span>
    </div>
  )):saveMessage.map((msg, index) => (
    <div key={index} className={`message ${msg.userId === socketId ? 'sender' : 'receiver'}`}>
      <span>{msg.text}</span>
    </div>
  ))}
</div>
    <h6 style={{marginLeft:'10px'}}>{socketId}</h6>
    <div className="input-area">

      <form onSubmit={handleSubmit}>
        <input type="text" className="input-field" id="inputField" value={message} placeholder="message" onChange={(e)=>setMessage(e.target.value)}/>
        <input type="text" className="input-field" id="inputField" value={room} placeholder="Enter Other person above Id for connect" onChange={(e)=>setRoom(e.target.value)}/>
       
        <button type="submit">Send</button>
      </form>
      </div>
    </div>
    </>
  );
}

export default App;
   