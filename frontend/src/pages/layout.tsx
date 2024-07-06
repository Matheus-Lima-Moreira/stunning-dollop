import { ChevronLeft, House, LogOut, Menu, Moon, SquareUser, Sun, User2, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/context/Theme/ThemeContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import RestrictAccess from "@/components/RestrictAccess";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { handleLogout, isAuth, loading } = useAuthContext();
  const [isHideBar, setIsHideBar] = useState(false);
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
      case "/roles":
        return "Cargos";
      default:
        return "";
    }
  };

  const toggleHideBar = () => {
    setIsHideBar(!isHideBar);
  };

  useEffect(() => {
    if (!isAuth && !loading) navigate("/login");
  }, [isAuth, loading]);

  return (
    <TooltipProvider>
      <div className={`grid h-screen w-full ${!isHideBar ? "pl-[56px]" : ""}`}>
        <aside id="aside-bar" className={`inset-y fixed  left-0 z-20 flex h-full flex-col border-r ${isHideBar ? "-translate-x-full" : "translate-x-0"} bg-background transition-transform duration-300`}>
          <div className="border-b p-2 h-[57px]">
            <Button variant="ghost" size="icon" onClick={() => toggleHideBar()} aria-label="Esconder Barra Lateral">
              <ChevronLeft />
            </Button>
          </div>

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

            <RestrictAccess neededPermissions={["LIST_ROLES"]}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className={`rounded-lg ${location.pathname === "/roles" ? "bg-muted" : ""}`} aria-label="Cargos" onClick={() => navigate("/roles")}>
                    <UserRoundCog className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Cargos
                </TooltipContent>
              </Tooltip>
            </RestrictAccess>
          </nav>

          <nav className="mt-auto grid gap-1 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="mt-auto rounded-lg" aria-label="Modo Escuro" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
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

        <div id="content" className="flex flex-col overflow-auto">
          <header className={`sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background ${isHideBar ? "px-2" : "px-4"}`}>
            {isHideBar && (
              <Button variant="ghost" size="icon" onClick={() => toggleHideBar()} aria-label="Mostrar Barra Lateral">
                <Menu />
              </Button>
            )}

            <h1 className="text-xl font-semibold">{getRouteName()}</h1>
          </header>

          <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-1">{children ? children : null}</main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
