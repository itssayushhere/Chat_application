import { useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const naviagte = useNavigate()
    const [input,setInput] =useState({
        email:'',
        password: ''
    })
    const handleInput = (e) =>{
        e.preventDefault()
        setInput({...input,[e.target.name]:e.target.value})
    }
    console.log(input)
  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-blue-600">
      <div className=" p-3 rounded-xl bg-white text-black">
        <h1 className="flex gap-2 items-center justify-center p-2 px-10 py-4 border-2 border-black font-bold font-mono text-xl bg-blue-200 rounded-lg border-opacity-10 ">
          <FaMessage className="text-2xl text-blue-600" />
          Welcome back to Streamline
        </h1>
        <div className="">
            <label htmlFor="" className="flex flex-col ">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">Enter Email:</span>
                <input type="text" className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto" placeholder="xyz@example.com" value={input.email} name="email" onChange={handleInput} />
            </label>
        </div>
        <div>
            <label htmlFor="" className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">Enter Password:</span>
                <input type="password" className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto" placeholder="Enter your secret" value={input.password} name="password" onChange={handleInput}/>
            </label>
        </div>
        <div className="flex justify-end p-3">
            <h1>Do you just landed here then click here , <button className="text-blue-700 font-bold" onClick={()=>naviagte('/register')}>Sign up</button></h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
