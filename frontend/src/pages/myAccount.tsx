import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AuthContext } from "@/context/Auth/AuthContext";
import api from "@/services/api";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

const MyAccount = () => {
  const { user, setUser } = useContext(AuthContext);
  const [userId, setUserId] = useState(user?.id || 0);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [userRoleId, setUserRoleId] = useState(user?.role.id || 0);
  const [passwordVisible, setPasswordVisibility] = useState(false);

  const { mutateAsync: updateMyUser } = useMutation({
    mutationFn: async ({ id, name, email, password, roleId }: UserUpdateData) => {
      const { data } = await api.put(`/users/${id}`, {
        name,
        email,
        password,
        roleId
      });

      return data;
    },
    onSuccess: (data) => {
      const userUpdated = data?.user as LoggedInUser;

      setUser(userUpdated);

      toast({ title: "Dados atualizados com sucesso!" });
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.error || errorData?.message || error?.message });
    },
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({ id: userId, name, email, password, roleId: userRoleId });
    updateMyUser({ id: userId, name, email, password, roleId: userRoleId });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  useEffect(() => {
    setUserId(user?.id || 0);
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPassword(user?.password || "");
    setUserRoleId(user?.role.id || 0);
  }, [user]);

  return (
    <div className="w-full max-w-md mx-auto my-auto">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Alterar Dados</h1>
        <div className="mb-4">
          <Label htmlFor="name" className="block mb-1">
            Nome
          </Label>
          <Input type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div className="mb-4">
          <Label htmlFor="email" className="block mb-1">
            E-mail
          </Label>
          <Input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="mb-4">
          <Label htmlFor="password" className="block mb-1">
            Senha
          </Label>
          <div className="relative">
            <Input type={passwordVisible ? "text" : "password"} id="password" value={password} onChange={handlePasswordChange} className="!pr-11" />
            <Button className="adornment-end absolute right-0 top-0 hover:bg-transparent bg-transparent text-inherit size-11 h-[2.5rem]" type="button" size="sm" onClick={togglePasswordVisibility}>
              {passwordVisible ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        <Button type="submit" className="mt-2 w-full">
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
};

export default MyAccount;
