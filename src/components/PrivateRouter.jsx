
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../AuthContext.jsx"; 

// export default function PrivateRoute({ children }) {
//   const { user, loadingUser } = useAuth();

//   if (loadingUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx"; 

export default function PrivateRoute({ children }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Agar user yo'q bo'lsa login sahifasiga yo'naltir
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

