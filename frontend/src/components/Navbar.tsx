import { Activity } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => (
  <nav className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
    <div className="container flex items-center justify-between h-14">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Activity className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-lg font-display font-bold tracking-tight text-foreground">
          Football Analytics
        </h1>
      </div>
      <ThemeSwitcher />
    </div>
  </nav>
);

export default Navbar;
