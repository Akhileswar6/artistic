// src/Pages/User/Account.jsx

import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return <div className="p-6">Please login to view account</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto" style={{ fontFamily: "Inter, serif" }}>
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>

      <div className="border rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-4">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-500 text-white flex items-center justify-center text-xl">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-lg font-medium">{user.fullName}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}