/* eslint-disable react/prop-types */
import { useState } from "react";
import ReactLoading from "react-loading";
import Error from "../utils/Error.jsx";
const JoinChannel = ({ close, client }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userid = client?.userID;
  const addMemberToChannel = async (e) => {
    setLoading(true);
    e.preventDefault();
    if ( input.trim() == "") {
      return setError("Please Enter Channel Id"),setLoading(false);
    }
    if(!userid ){
      return setError("No userId found"),setLoading(false);
    }
    try {
      const channel = client.channel("team", input);
      await channel.addMembers([userid]);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.log(error.message)
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center z-50 justify-center ">
      <div className=" absolute inset-0 bg-blue-950 opacity-10 "></div>
      {loading && !error && <ReactLoading />}
      {!loading && (
        <form
          onSubmit={addMemberToChannel}
          className=" p-2 text-black  bg-gray-100 flex flex-col z-50 border-2 rounded-md  border-black shadow-sm shadow-black gap-4"
        >
          {error && <Error errormessage={error} />}
          <div>
            <h1 className=" text-black text-md font-mono font-bold p-1 border-b-2 w-fit border-black mb-1">
              Enter Channel Id:
            </h1>
            <input
              type="text"
              value={input}
              onChange={(e) =>{ setInput(e.target.value),setError('')}}
              className="border-2 border-black border-opacity-25 bg-black rounded bg-opacity-40 w-full px-4 py-1 text-black"
              autoFocus
            />
          </div>
          <div className="w-full flex gap-2">
            <button
              type="button"
              className=" p-1 w-full bg-gray-500 font-bold font-mono rounded-md"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" p-1 w-full bg-green-500 font-bold font-mono rounded-md"
            >
              Join
            </button>
          </div>
          <h1 className="flex flex-shrink items-center justify-center text-[10px] gap-1 "><span className=" bg-black w-3 p-2 flex items-center justify-center h-3 text-white rounded-full italic">i</span><span>Please note that only public channel can be joined.<br/>For Private Channel Tell admin to send invites or add you.</span></h1>
        </form>
      )}
    </div>
  );
};

// Example usage
export default JoinChannel;
