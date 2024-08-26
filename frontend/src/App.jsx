/* eslint-disable react/prop-types */
import { useContext, useEffect, useState, Suspense, lazy } from "react";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageInput,
  Thread,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { FaMessage } from "react-icons/fa6";
import { MdAddCircleOutline } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import ReactLoading from "react-loading";
import "./App.css";
import { AuthContext } from "./Context/AuthContext.jsx";
import CustomMessagelist from "./CustomComponent/CustomMessageList.jsx";
// Lazy load the components
const CustomMessageInput = lazy(() =>
  import("./CustomComponent/CustomMessageInput.jsx")
);
const ChannelInfo = lazy(() => import("./ChannelInformation"));
const JoinChannel = lazy(() => import("./Functions/JoinChannel.jsx"));
const ClientAddChanel = lazy(() => import("./Functions/ClientAddChanel.jsx"));
const CreateVideoCall = lazy(() => import("./Video/CreateVideoCall.jsx"));
const CreateChannel = lazy(() => import("./Functions/CreateChannel.jsx"));
const UserInformation = lazy(() => import("./UserInformation.jsx"));
const App = () => {
  // context variable and action
  const { state, dispatch } = useContext(AuthContext);

  // Variable for creating or joining client
  const apiKey = import.meta.env.VITE_STREAM_APIKEY;
  const userId = state?.userData?.id;
  const token = state?.token;
  // Channel filters options and sort
  const filters = { members: { $in: [userId] } };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };
  // useStates for handling various things
  const [open, setOpen] = useState(false);
  const [joinChannel, setJoinChannel] = useState(false);
  const [VideoCallState, setVideoCallState] = useState(false);
  const [createChannel, setCreateChannel] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  // Create or Login client with useCreateChatClient
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: state.userData,
  });

  // useEffect for fetching user in the api
  const [channels, setChannels] = useState([]);
  const [connecting, setConnecting] = useState(true);
  const [alluser, setAlluser] = useState([]);
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const channel = await client.queryChannels({
          members: { $in: [userId] },
        });
        const user = await client.queryUsers({});
        setChannels(channel);
        setAlluser(user.users);
        setConnecting(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (client) {
      getAllUsers();
    }
  }, [client]);

  // Load total channels user logged in
  if (!client || connecting)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black">
        <ReactLoading color="white" />
      </div>
    );

  // HandleLogout
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const image = client?.user?.image;
  const username = client?.user?.username;
  const avatar = (username) => {
    // Trim any extra spaces and split the username
    const split = username.trim().split(" ");

    // Extract initials
    let name;
    if (split.length === 1) {
      name = split[0][0].toUpperCase();
    } else {
      const [firstName, lastName] = split;
      name = firstName[0].toUpperCase() + lastName[0].toUpperCase();
    }

    return name;
  };

  

  // CustomListContainer
  const CustomListContainer = (props) => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-between relative">
        <div>
          <header className="flex p-2 px-10 shadow-md border-2 border-black rounded-md mx-1 my-2 text-white bg-blue-600 font-mono font-bold shadow-black">
            <div className="flex items-center space-x-2">
              <FaMessage className="text-2xl text-blue-200 animate-pulse" />
              <h1 className="text-xl font-semibold animate-pulse">
                StreamLine
              </h1>
            </div>
          </header>
          <div className="flex flex-col sm:h-[650px] h-[540px] overflow-y-scroll hidden-scrollbar ">
            <div>{props.children}</div>
            <div className="p-2 flex flex-col items-center justify-center text-2xl">
              <button type="button" onClick={() => setJoinChannel(true)}>
                <MdAddCircleOutline />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full  flex items-center justify-between p-2 py-3 absolute bottom-0">
          <button
            className="p-2 text-xs border-2 border-black font-bold font-mono rounded-lg bg-blue-600 text-white shadow-sm shadow-black"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
          <div onClick={() => setOpenUser(true)} className=" cursor-pointer">
            {image && (
              <img
                src={image}
                alt=""
                className="w-11 h-11 object-cover overflow-auto rounded-full border-2 border-blue-900"
              />
            )}
            {!image && (
              <div className="w-10 h-10 border-2 border-black flex items-center justify-center rounded-full bg-blue-900">
                {avatar(username)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  // Return or Render
  return (
    <Chat client={client} theme={"messaging dark"}>
      <div className="flex flex-grow">
        {!connecting && channels.length !== 0 && (
          <aside className="hidden-scrollbar border-r border-gray-700 bg-gray-800">
            <div className="h-full overflow-auto hidden-scrollbar">
              <ChannelList
                sort={sort}
                filters={filters}
                options={options}
                List={CustomListContainer}
              />
            </div>
          </aside>
        )}
        <main className="w-full h-full flex flex-col overflow-hidden relative">
          {channels.length === 0 ? (
            <div
              className="bg-black w-full flex flex-col justify-center items-center relative"
              style={{ paddingTop: "80px" }}
            >
              <header className="flex items-center justify-between shadow-md border-2 border-black text-white bg-blue-600 font-mono font-bold shadow-black m-3 w-full absolute top-0 px-4 py-2 z-50">
                <div className="flex items-center space-x-4">
                  <FaMessage className="text-2xl text-blue-200 animate-pulse" />
                  <h1 className="text-xl font-semibold animate-pulse">
                    StreamLine
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="p-2 text-xs border-2 border-black font-bold font-mono rounded-lg bg-blue-600 text-white shadow-sm shadow-black"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </button>
                </div>
              </header>

              <div className="flex justify-center items-center fixed inset-0 bg-black">
                <div>
                  <h1 className="text-white p-3">No, Channels right now.</h1>
                  <div className="flex flex-col gap-2">
                    <button
                      className="p-4 bg-blue-600 text-white rounded-lg"
                      onClick={() => setCreateChannel(true)}
                    >
                      Create a New Channel
                    </button>
                    <button
                      className="p-4 bg-green-500 text-white rounded-lg"
                      onClick={() => setJoinChannel(true)}
                    >
                      Join Channel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Channel enrichURLForPreview>
              <Window>
                <div className="flex items-center justify-between relative">
                  <div className="w-full flex relative">
                    <button
                      className="absolute left-[52px] top-2 z-50 bg-transparent text-transparent py-4 px-20"
                      onClick={() => setOpen(open === true ? false : true)}
                    >
                      Hello
                    </button>
                    <div className="sticky top-0 w-full z-40  ">
                      <ChannelHeader />
                      <button
                        className="absolute z-50 top-6 right-3 text-2xl"
                        onClick={() => setVideoCallState(true)}
                      >
                        <FaVideo className="text-blue-700" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="z-50">
                  <Suspense
                    fallback={
                      <div className="fixed inset-0 flex items-center justify-center">
                        <ReactLoading color="white" type="spin" />
                      </div>
                    }
                  >
                    {open && (
                      <ChannelInfo
                        close={() => setOpen(false)}
                        user={client?.user?.id}
                        data={alluser}
                      />
                    )}
                  </Suspense>
                </div>
                <CustomMessagelist/>
                <div className=" fixed bottom-0 w-full z-40">
                  <Suspense
                    fallback={
                      <div className="fixed inset-0 flex items-center justify-center">
                        <ReactLoading color="white" type="spin" />
                      </div>
                    }
                  >
                    <MessageInput Input={() => <CustomMessageInput />} />
                  </Suspense>
                </div>
                {VideoCallState && (
                  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <Suspense
                      fallback={
                        <div className="fixed inset-0 flex items-center justify-center">
                          <ReactLoading color="white" type="spin" />
                        </div>
                      }
                    >
                      <CreateVideoCall
                        apiKey={apiKey}
                        user={state?.userData}
                        token={token}
                        closeApp={() => setVideoCallState(false)}
                      />
                    </Suspense>
                  </div>
                )}
              </Window>
              <Thread />
            </Channel>
          )}
          {channels.length === 0
            ? joinChannel && (
                <Suspense
                  fallback={
                    <div className="fixed inset-0 flex items-center justify-center">
                      <ReactLoading color="white" type="spin" />
                    </div>
                  }
                >
                  <JoinChannel
                    close={() => setJoinChannel(false)}
                    client={client}
                  />
                </Suspense>
              )
            : joinChannel && (
                <div className="absolute inset-0 z-50">
                  <Suspense
                    fallback={
                      <div className="fixed inset-0 flex items-center justify-center">
                        <ReactLoading color="white" type="spin" />
                      </div>
                    }
                  >
                    <ClientAddChanel close={() => setJoinChannel(false)} />
                  </Suspense>
                </div>
              )}
          {channels.length === 0 && createChannel && (
            <div className="fixed items-center justify-center flex inset-0 z-50">
              <Suspense
                fallback={
                  <div className="fixed inset-0 flex items-center justify-center">
                    <ReactLoading color="white" type="spin" />
                  </div>
                }
              >
                <CreateChannel
                  close={() => setCreateChannel(false)}
                  client={client}
                  userId={client.userID}
                />
              </Suspense>
            </div>
          )}
          {openUser && (
            <Suspense
              fallback={
                <div className="fixed inset-0 flex items-center justify-center">
                  <ReactLoading color="white" type="spin" />
                </div>
              }
            >
              <UserInformation
                close={() => setOpenUser(false)}
                imageicon={avatar(username)}
              />
            </Suspense>
          )}
        </main>
      </div>
    </Chat>
  );
};

export default App;
