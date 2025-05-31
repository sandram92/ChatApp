import { createContext, useState, useEffect, useCallback } from "react";
import { postRequest, getRequest, baseURL } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseURL}/users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) return false;
        if (userChats) {
          isChatCreated = userChats.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };

    getUsers();
  }, [userChats]);

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
  }, [user]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseURL}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        isUserChatsLoading,
        setIsUserChatsLoading,
        userChatsError,
        setUserChatsError,
        potentialChats,
        createChat,
        updateCurrentChat, 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
