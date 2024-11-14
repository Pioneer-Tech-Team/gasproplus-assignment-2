"use client"
import React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="en">
    <head>
      <title>Accounting</title>
    </head>
    <body>
      <div className="container mx-auto p-4">
        {children}
      </div>
    </body>
    </html>
    </>
  );
}
