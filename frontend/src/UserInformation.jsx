import { useChatContext } from "stream-chat-react";
import { useEffect, useRef, useState } from "react";

const UserInformation = ({ close, imageicon }) => {
  const { client } = useChatContext();
  const user = {
    image: client?.user?.image,
    name: client?.user?.name,
    username: client?.user?.username,
    email: client?.user?.email,
    age: client?.user?.age,
  };
  const [input, setInput] = useState({
    image: user.image || "",
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    age: user.age || "",
  });
  const containerRef = useRef(null);
  const [edit, setEdit] = useState(false);

  const handleupdate = async () => {
    try {
      const updatedUser = await client.upsertUser({
        id: client.userID,
        name: "New User Name",
      });
      console.log("User updated:", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlechange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
      <div
        ref={containerRef}
        className="bg-blue-500 text-black rounded-lg shadow-lg w-full max-w-sm p-4 flex flex-col items-center border-2 border-black shadow-black "
      >
        <div className="flex items-center justify-between w-full ">
          <div className="flex flex-col items-center justify-center gap-1">
            {user.image && (
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover overflow-hidden border-2 border-black border-opacity-80"
              />
            )}
            {!user.image && (
              <div className="w-24 h-24 border-2 border-black flex items-center justify-center rounded-full bg-blue-800 text-5xl">
                {imageicon}
              </div>
            )}
            {!edit ? (
              <h1 className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-balance font-bold font-mono text-white">
                {user.age}
              </h1>
            ) : (
                <input type="text" value={input.age} name="age" onChange={handlechange}  className="w-8 h-8 flex text-center rounded-full bg-white  font-bold font-mono text-black p-1 border border-black underline"/>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold mb-2 italic border-b p-1 px-3 border-black w-fit rounded-md text-black">
              ~{user.name}
            </h2>
            <div className="flex gap-2 items-center">
              <h1 className="font-semibold font-mono italic">Name:</h1>
              
              {!edit ? <h1 className="">{user.username}</h1>: <input type="text" name="username" value={input.username} onChange={handlechange}  className="w-40 bg-transparent border-b h-5 px-2 outline-none border-black rounded"/> }
            </div>
            <div className="flex items-center">
              <h1 className="font-semibold font-mono italic">Email:</h1>
              <h1 className="flex  text-xs">{user.email}</h1>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-green-500 text-black w-14 font-medium py-1 rounded-lg"
            onClick={() => {
              edit ? setEdit(false) : setEdit(true);
            }}
          >
            {edit ? "Save" : "Edit"}
          </button>
          <button
            className="bg-red-600 text-black px-3 font-medium py-1 rounded-lg hover:bg-red-600"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
