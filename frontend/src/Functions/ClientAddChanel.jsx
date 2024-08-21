import  { useState } from "react";
import { FaMessage } from "react-icons/fa6";
import { FaRegWindowClose } from "react-icons/fa";
import JoinChannel from "./JoinChannel";
import { useChatContext } from "stream-chat-react";
import CreateChannel from "./CreateChannel";

const ClientAddChanel = ({ close }) => {
    const { client} = useChatContext()
  const [joinChannel, setJoinChannel] = useState(false);
  const [createChannel, setCreateChannel] = useState(false);
  return (
    <div className=" fixed inset-0 flex items-center justify-center ">
      <div className=" absolute inset-0 flex items-center justify-center text-transparent bg-black z-50">
        hello
      </div>
      <header
        className={`flex items-center justify-center shadow-md border-2 border-black text-white bg-blue-600 font-mono font-bold shadow-black m-3 w-full  px-4 py-2 absolute top-1 z-50`}
      >
        <div className="flex items-center space-x-4">
          <FaMessage className="text-2xl text-blue-200 animate-pulse" />
          <h1 className="text-xl font-semibold animate-pulse">StreamLine</h1>
        </div>
      </header>
      {!joinChannel && !createChannel && (
        <div className="flex flex-col gap-2 z-50 bg-white relative  p-2 rounded-lg">
          <div className=" m-4 flex flex-col gap-2 ">
            <h1 className=" px-10 py-3 text-lg ">What do you want to do ?</h1>
            <button className="p-2 px-10  bg-blue-500 text-white  rounded" onClick={()=>setCreateChannel(true)} >
              Create Channel
            </button>
            <button className=" text text-white p-2 px-10  bg-green-500 rounded" onClick={()=>setJoinChannel(true)}>
              Join Channel
            </button>
          </div>
          <button
            type="button"
            className="text-red-600 absolute  right-3 hover:bg-red-900 text-lg"
            onClick={() => close()}
          >
            <FaRegWindowClose />
          </button>
        </div>
      )}
      {joinChannel && <div><JoinChannel close={()=>setJoinChannel(false)} client={client}/></div> }
      {createChannel && <CreateChannel close={()=>setCreateChannel(false)} client={client} userId={client.userID}/> }
    </div>
  );
};

export default ClientAddChanel;
