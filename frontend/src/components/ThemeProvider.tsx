import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "midnight";

const ThemeContext = createContext({
  theme: "dark" as Theme,
  setTheme: (_: Theme) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark", "midnight");

    if (theme === "light") root.classList.add("light");
    else if (theme === "midnight") root.classList.add("midnight");
    else root.classList.add("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);