import { createContext, useCallback, useEffect, useState } from "react";
import { postRegister } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    // setRegisterInfo(info);
    setRegisterInfo((prevInfo) => ({ ...prevInfo, ...info }));
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRegister(
        "http://localhost:3000/api/users/register",
        registerInfo
      );
      setIsRegisterLoading(false);
      if (response.error) {
        setRegisterError(response);
        return;
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo((prevInfo) => ({ ...prevInfo, ...info }));
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);
      const response = await postRegister(
        "http://localhost:3000/api/users/login",
        loginInfo
      );
      setIsLoginLoading(false);
      if (response.error) {
        setLoginError(response);
        return;
      }
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
    setLoginInfo(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        registerInfo,
        user,
        updateRegisterInfo,
        registerUser,
        registerError,
        setRegisterError,
        isRegisterLoading,
        logoutUser,
        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
