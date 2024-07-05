import { House, LogOut, Moon, SquareUser, Sun, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/context/Theme/ThemeContext";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { handleLogout, isAuth, loading } = useAuth();
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  const getRouteName = () => {
    const activeBar = "/" + location?.pathname?.split("/")[1];

    switch (activeBar) {
      case "/":
        return "Início";
      case "/users":
        return "Usuários";
      case "/profile":
        return "Minha Conta";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) navigate("/login");
  }, [isAuth, loading]);

  return (
    <TooltipProvider>
      <div className="grid h-screen w-full pl-[56px]">
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
          <div className="border-b p-2 h-[57px]">{/*  */}</div>

          <nav className="grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={`rounded-lg ${location.pathname === "/" ? "bg-muted" : ""}`} aria-label="Início" onClick={() => navigate("/")}>
                  <House className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Início
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={`rounded-lg ${location.pathname === "/users" ? "bg-muted" : ""}`} aria-label="Usuários" onClick={() => navigate("/users")}>
                  <User2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Usuários
              </TooltipContent>
            </Tooltip>
          </nav>

          <nav className="mt-auto grid gap-1 p-2">          
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Modo Escuro" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {
                    theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />
                  }
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className={`mt-auto rounded-lg ${location.pathname === "/profile" ? "bg-muted" : ""}`} aria-label="Minha Conta" onClick={() => navigate("/profile")}>
                  <SquareUser className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Minha Conta
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Sair" onClick={handleLogout}>
                  <LogOut className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Sair
              </TooltipContent>
            </Tooltip>
          </nav>
        </aside>

        <div className="flex flex-col overflow-auto">
          <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <h1 className="text-xl font-semibold">{getRouteName()}</h1>
          </header>

          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1">{children ? children : null}</main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
