import { useState } from "react";
import { FaMessage } from "react-icons/fa6";
import ReactLoading from "react-loading";
import uploadCloudinary from "../utils/uploadCloudinary";
import { useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import deafultimage from "../assets/image/default.png";
import { BiSolidShow } from "react-icons/bi";
import { BiSolidHide } from "react-icons/bi";

const Register = () => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    confirm: "",
    image: image,
    age: "",
    phoneNumber: "",
    username: "",
    bio: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleImage = async (e) => {
    setImageLoading(true);
    const file = e.target.files[0];
    const data = await uploadCloudinary(file);
    setImage(data.url);
    setInput((prevState) => ({ ...prevState, image: data.url }));
    setImageLoading(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
    setError("");

    // Check for spaces in the username
    if (name === "username" && /\s/.test(value)) {
      setError("Username cannot contain spaces.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (/\s/.test(input.username)) {
      setError("Username cannot contain spaces.");
      setLoading(false);
      return;
    }

    if (input.password.trim() !== input.confirm.trim()) {
      setError("Password Do Not Match");
      setLoading(false);
      return;
    }

    if (
      input.email === "" ||
      input.age === "" ||
      input.password === "" ||
      input.fullname === "" ||
      input.username === ""
    ) {
      setError("Enter all (*) Required Fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: input.email.trim().toLowerCase(),
            password: input.password.trim(),
            name: input.fullname.trim(),
            age: parseInt(input.age, 10),
            phoneNumber: input.phoneNumber.trim()
              ? input.phoneNumber.trim()
              : "",
            image: input.image ? input.image : deafultimage,
            bio: input.bio ? input.bio.trim() : "",
            username: input.username.trim().toLowerCase()
          }),
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <div className="bg-blue-500 w-full min-h-screen flex items-center justify-center">
      <div className="p-2 border-2 border-black shadow-sm shadow-black bg-white rounded-md">
        <div className="flex items-center gap-2 px-20 text-xl font-bold font-mono w-full justify-center sm:p-4 p-1 bg-blue-200 rounded-lg">
          <h1 className="text-center">Join StreamChat</h1>
          <FaMessage className="text-3xl text-blue-600" />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <Error errormessage={error} />}
          <div className="sm:flex gap-1 items-center ">
            <div>
              <label className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Username*:
                </span>
                <input
                  type="text"
                  className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                  placeholder="make it unique"
                  name="username"
                  value={input.username}
                  onChange={handleInput}
                />
              </label>
            </div>
            <div className="sm:flex gap-1 items-center flex ">
              <div>
                <label className="flex flex-col">
                  <span className="font-semibold p-1 border-b-2 w-fit border-black">
                    FullName*:
                  </span>
                  <input
                    type="text"
                    className="border-2 border-black border-opacity-55 w-[275px] p-2 m-1 rounded-lg mx-auto"
                    placeholder="Ex: Name Surname"
                    name="fullname"
                    value={input.fullname}
                    onChange={handleInput}
                    autoFocus
                  />
                </label>
              </div>
              <div>
                <label className="flex flex-col">
                  <span className="font-semibold p-1 border-b-2 w-fit border-black ">
                    Age*:
                  </span>
                  <input
                    type="number"
                    className="border-2 border-black border-opacity-55 w-[70px] p-2 m-1 rounded-lg mx-auto"
                    placeholder="Ex:20"
                    name="age"
                    value={input.age}
                    onChange={handleInput}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="sm:flex gap-1 items-center">
            <div>
              <label className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Email*:
                </span>
                <input
                  type="email"
                  className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                  placeholder="xyz@example.com"
                  name="email"
                  value={input.email}
                  onChange={handleInput}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Phone Number:
                </span>
                <input
                  type="number"
                  className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                  placeholder="1234567890"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={handleInput}
                />
              </label>
            </div>
          </div>
          <div className="sm:flex gap-1 items-center">
            <div>
              <label className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Password*:
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                    placeholder="Enter password"
                    name="password"
                    value={input.password}
                    onChange={handleInput}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <div className="text-xl mr-1">
                        <BiSolidHide />
                      </div>
                    ) : (
                      <div className="text-xl mr-1">
                        <BiSolidShow />
                      </div>
                    )}
                  </button>
                </div>
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <span className="font-semibold p-1 border-b-2 w-fit border-black">
                  Confirm Password*:
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border-2 border-black border-opacity-55 w-[350px] p-2 m-1 rounded-lg mx-auto"
                    placeholder="Re-enter password"
                    name="confirm"
                    value={input.confirm}
                    onChange={handleInput}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <div className="text-xl mr-1">
                        <BiSolidHide />
                      </div>
                    ) : (
                      <div className="text-xl mr-1">
                        <BiSolidShow />
                      </div>
                    )}
                  </button>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="flex flex-col">
              <span className="font-semibold p-1 border-b-2 w-fit border-black">
                Bio:
              </span>
              <textarea
                type="text"
                className="border-2 border-black border-opacity-55 w-full p-2 m-1 rounded-lg mx-auto"
                placeholder="About Yourself"
                name="bio"
                value={input.bio}
                onChange={handleInput}
              />
            </label>
          </div>

          <div className="flex flex-row items-center justify-center w-full">
            {imageLoading ? (
              <ReactLoading color="blue" />
            ) : (
              <div className="flex items-center gap-2 justify-center w-full flex-col">
                {image && (
                  <img
                    src={image}
                    width={50}
                    height={50}
                    alt="Uploaded"
                    className="object-cover rounded-full overflow-hidden w-10 border-2 h-10 border-blue-800"
                  />
                )}
                <div className="relative w-[290px] h-[40px]">
                  <input
                    type="file"
                    name="photo"
                    id="customFile"
                    onChange={handleImage}
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <label
                    htmlFor="customFile"
                    className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer justify-center"
                  >
                    Upload photo
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center py-2 px-2">
            <button
              type="submit"
              className="flex justify-center items-center w-full py-3 px-6 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-mono"
              disabled={loading || imageLoading}
            >
              {loading ? (
                <div className="">
                  <ReactLoading color="white" />
                </div>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-center gap-2 p-2">
          <p className="text-black">Already have an account?</p>
          <button
            className="text-blue-700 font-bold hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
