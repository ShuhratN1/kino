import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    setLoadingUser(false);
  }, []);

  const login = (username, password) => {
    if (!username || !password) return { success: false, message: "Username va Password kiriting!" };

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return { success: false, message: "Foydalanuvchi topilmadi, iltimos ro‘yxatdan o‘ting!" };
    if (storedUser.username !== username || storedUser.password !== password)
      return { success: false, message: "Username yoki Password noto‘g‘ri!" };

    setUser(storedUser);
    return { success: true };
  };

  
  const register = (username, password) => {
    if (!username || !password) return { success: false, message: "Username va Password kiriting!" };

    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.username === username) {
      return { success: false, message: "Bu foydalanuvchi allaqachon mavjud!" };
    }

    const newUser = { username, password };
    localStorage.setItem("user", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
