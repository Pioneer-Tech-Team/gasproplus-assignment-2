"use client"
import React, { useEffect, useState } from "react";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  let token = localStorage.getItem("authToken");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
      setIsAuthenticated(!!token);
      console.log(token);
    }
  }, [token]);
  return (
    <html lang="en">
      <body >

            {isAuthenticated ? (
                <nav className="bg-gray-800 p-4">
                <ul className="flex space-x-4">
                  <li><a className="text-white hover:text-gray-400" href="/company">Company</a></li>
                  <li><a className="text-white hover:text-gray-400" href="/account">Account</a></li>
                  <li><a className="text-white hover:text-gray-400" href="/voucher">Voucher</a></li>
                  <li>
                  <button 
                    className="text-white hover:text-gray-400" 
                    onClick={() => { localStorage.removeItem("authToken"); window.location.reload(); }}
                  >
                    Logout
                  </button>
                  </li>
                </ul>
                </nav>
              ) : (
                <nav className="bg-gray-800 p-4">
                <ul className="flex space-x-4">
                  <li><a className="text-white hover:text-gray-400" href="/login">Login</a></li>
                  <li><a className="text-white hover:text-gray-400" href="/register">Register</a></li>
                </ul>
                </nav>
            )}
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
