/* eslint-disable react/prop-types */
import {
  CallControls,
  CallingState,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import ReactLoading from "react-loading";
import { useChannelStateContext } from "stream-chat-react";
import { useEffect, useRef } from "react";
import { ParticipantView } from "@stream-io/video-react-sdk";
import Draggable from "react-draggable";

export const MyParticipantList = ({ participants }) => {
  const {useLocalParticipant} = useCallStateHooks()
  const localParticipant = useLocalParticipant();
  const localstream = localParticipant?.screenShareStream;
  const stream = participants?.screenShareStream
  return (
    <div className="flex flex-row flex-wrap gap-8">
      {participants.map((participant) => (
        <ParticipantView
          participant={participant}
          key={participant.sessionId}
        />
      ))}
      {localstream && <ScreenShare stream={localstream} />}
      {stream && <ScreenShare stream={stream} />}
    </div>
  );
};

const ScreenShare = ({ stream }) => {
  // Create a ref for the video element
  const videoRef = useRef(null);

  useEffect(() => {
    // Set the srcObject of the video element to the MediaStream
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    // Clean up the srcObject when the component unmounts or the stream changes
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]); // Dependency array ensures effect runs when `stream` changes

  return (
    <div className="">
      <video ref={videoRef} autoPlay playsInline className="w-full h-60" />
    </div>
  );
};
export const MyFloatingLocalParticipant = ({ participant }) => {
  return (
    <Draggable bounds="parent">
      <div className="fixed sm:w-[250px] w-[200px] flex items-center justify-center align-middle h-fit border-2 rounded-xl cursor-move">
        <ParticipantView participant={participant}/>
      </div>
    </Draggable>
  );
};

export const MyUILayout = ({ closeApp }) => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();
  if (callingState !== CallingState.JOINED) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ReactLoading color="white" />
      </div>
    );
  }
  return (
    <div className="h-full relative">
      <StreamTheme>
        <div className="parent bg-black h-[600px] sm:h-[640px]">
          <MyParticipantList participants={remoteParticipants} />
          <MyFloatingLocalParticipant participant={localParticipant} />
        </div>
        <div className=" absolute bottom-0 flex items-center w-full justify-center">
          <CallControls onLeave={() => closeApp()} />
        </div>
      </StreamTheme>
    </div>
  );
};

const CreateVideoCall = ({ apiKey, user, token, closeApp }) => {
  const { channel } = useChannelStateContext();
  const channelMembers = Object.values(channel?.state?.members || {});
  const callID = channel?.data?.id;
  const client = StreamVideoClient.getOrCreateInstance({ apiKey, user, token });
  const call = client.call("default", callID);
  const VideoMembers = channelMembers.map((m) => m.user_id);
  useEffect(() => {
    const joinCall = async () => {
      try {
        await call.getOrCreate({
          data: {
            members: VideoMembers.map((userId) => ({ user_id: userId })),
          },
        });
        await call.join({
          media: {
            audio: true,
            video: true,
          },
        });
        await channel.sendMessage({
          text: `Video call started `,
          customType: 'video_call',
          callID: callID,
        });
      } catch (error) {
        console.error("Error joining the call:", error);
      }
    };

    joinCall();

    return () => {
      call.leave();
    };
  }, [call, VideoMembers]);

  const handleCall = () => closeApp();

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <div className="h-full  w-full ">
          <MyUILayout closeApp={handleCall} />
        </div>
      </StreamCall>
    </StreamVideo>
  );
};

export default CreateVideoCall;
