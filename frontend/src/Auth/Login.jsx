import { useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Error from "../utils/Error";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const naviagte = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInput = (e) => {
    e.preventDefault();
    setError("");
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    setLoading(true);
    if (input.email === "" || input.password === "") {
      return setError("Fill all the data");
    }
    try {
      const respone = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: input.email.trim().toLowerCase(),
            password: input.password.trim(),
          }),
        }
      );
      const result = await respone.json();
      if (respone.ok) {
        setLoading(false);
        dispatch({
          type: "LOGIN",
          payload: {
            token: result.token,
            userData: result.data,
          },
        });
        naviagte("/chatapp");
      } else {
        setLoading(false);
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the default form submission if it's inside a form
      handleLogin(); // Calls the handleSubmit function
    }
  };
  
  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-blue-600">
      {loading && !error && <ReactLoading />}
      {!loading && (
        <div>
          {error && <Error errormessage={error} />}
          <div className=" p-3 rounded-xl bg-white text-black border-2 shadow-sm shadow-black border-black">
            <h1 className="flex gap-2 items-center justify-center p-2 px-10 py-4 border-2 border-black font-bold font-mono text-xl bg-blue-200 rounded-lg border-opacity-10 ">
              <FaMessage className="text-2xl text-blue-600" />
              Welcome back to Streamline
            </h1>
            <div className="">
              <label htmlFor="" className="flex flex-col ">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Enter Email:
                </span>
                <input
                  type="text"
                  className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                  placeholder="xyz@example.com"
                  value={input.email}
                  name="email"
                  onChange={handleInput}
                />
              </label>
            </div>
            <div>
              <label htmlFor="" className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Enter Password:
                </span>
                <input
                  type="password"
                  className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                  placeholder="Enter your secret"
                  value={input.password}
                  name="password"
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                />
              </label>
            </div>
            <div className="w-full flex ">
              <button
                className=" py-2 my-2 mx-auto bg-blue-600 text-white font-bold font-mono text-lg rounded-lg px-10"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="flex w-full justify-end p-2 text-black font-medium  ">
              <h1>
                Do you just landed here ?,then{" "}
                <button
                  className="text-blue-700 font-bold hover:underline"
                  onClick={() => naviagte("/register")}
                >
                  Sign up
                </button>
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
