import { useSelector } from "react-redux";

export const useAuth = () => {
  const isAuthenticated = useSelector((state) => !!state.token);
  const userRole = useSelector((state) => state.user.role || "");

  const isAdmin = userRole === "admin";

  console.log("User Role:", userRole);
  console.log("Is Admin:", isAdmin);

  return {
    isAuthenticated,
    isAdmin,
  };
};

export default useAuth;
