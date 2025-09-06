"use client";
import "./globals.css";
import ThemeContext from "./contexts/ThemeProvider";
import { useState } from "react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  const [theme, setTheme] = useState<"light"|"dark">("light");
  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <ThemeContext>
        <body className={`bg-primary text-accent` }>{children}</body>
      </ThemeContext>
    </html>
  );
}
