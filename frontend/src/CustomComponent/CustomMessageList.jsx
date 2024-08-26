import { useEffect, useRef } from 'react';
import { MessageList, useChannelStateContext } from 'stream-chat-react';

const CustomMessagelist = (props) => {
    const messageListRef = useRef(null);
    const { messages } = useChannelStateContext();
    useEffect(() => {
        const scrollToBottom = () => {
            if (messageListRef.current) {
                messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
            }
        };
        scrollToBottom();
    }, [messages]);

    return (
        <div ref={messageListRef}  className="flex-grow overflow-y-scroll mb-[68px] hidden-scrollbar">
            <MessageList {...props} />
        </div>
    );
};

export default CustomMessagelist;
