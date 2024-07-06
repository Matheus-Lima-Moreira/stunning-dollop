import React, { useEffect, useState } from "react";
import "../scss/pages/login.scss";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "@/context/Auth/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const { handleLogin, isAuth, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    handleLogin({ email, password });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  useEffect(() => {
    if (isAuth && !loading) navigate("/");
  }, [isAuth, loading]);

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Insira suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="block mb-1">E-mail</Label>
            <Input id="email" type="email" placeholder="email@example.com" required value={email} onChange={handleEmailChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="block mb-1">Senha</Label>
            <div className="relative">
              <Input id="password" type={passwordVisible ? "text" : "password"} required value={password} onChange={handlePasswordChange} className="!pr-11" />
              <Button className="adornment-end absolute right-0 top-0 hover:bg-transparent bg-transparent text-inherit size-11 h-[2.5rem]" type="button" size="sm" onClick={togglePasswordVisibility}>
                {passwordVisible ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default Login;
