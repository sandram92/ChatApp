import { createContext, useState, useEffect, useCallback } from "react";
import { postRequest, getRequest, baseURL } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendMessageError, setSendMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  // Get user chats
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${baseURL}/chats/${user._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user?._id]); // Only depend on user._id

  // Get potential chats
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseURL}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      
      if (userChats && user?._id) {
        const pChats = response.filter((u) => {
          if (user._id === u._id) return false;
          return !userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        });
        setPotentialChats(pChats);
      }
    };

    if (user?._id) {
      getUsers();
    }
  }, [user?._id, userChats?._id]); // Only re-run when user._id or userChats._id changes

  // Get messages for current chat
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat?._id) {
        setMessages(null);
        return;
      }
      
      try {
        setIsMessagesLoading(true);
        setMessagesError(null);
        const response = await getRequest(`${baseURL}/messages/${currentChat._id}`);
        setIsMessagesLoading(false);
        if (response.error) {
          setMessagesError(response);
          return;
        }
        setMessages(response);
      } catch (error) {
        setIsMessagesLoading(false);
        setMessagesError(error);
      }
    };

    getMessages();
  }, [currentChat]); // Only de

  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("You must type something...");

    const response = await postRequest(
      `${baseURL}/messages`,
      JSON.stringify({
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      })
    );

    if (response.error) {
     return setSendMessageError(response);
    }
    setNewMessage(response);
    setMessages((prev) => [...prev, response]);
    setTextMessage("");
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseURL}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return;
    }
    setUserChats((prev) => [...(prev || []), response]);
  }, []);

  const sendMessage = useCallback(async (textMessage) => {
    if (!currentChat?._id || !user?._id) return;

    const response = await postRequest(
      `${baseURL}/messages`,
      JSON.stringify({
        chatId: currentChat._id,
        senderId: user._id,
        text: textMessage
      })
    );

    if (!response.error) {
      setMessages(prev => [...(prev || []), response]);
    }

    return response;
  }, [currentChat?._id, user?._id]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendMessage,
        currentChat,
        sendTextMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
