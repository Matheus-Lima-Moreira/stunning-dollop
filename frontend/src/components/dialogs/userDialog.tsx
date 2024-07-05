import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import api from "@/services/api";
import "../../scss/components/dialogs/user_dialog.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import RoleSelect from "../RoleSelect";

const UserDialog = ({ isOpen, userSelectedId, onClose }: { isOpen?: boolean; userSelectedId?: number; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const [roleId, setRoleId] = useState("");
  const queryClient = useQueryClient();
  const {
    data: user,
    error,
    status,
  } = useQuery({
    queryKey: ["show-user", userSelectedId],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userSelectedId}`);
      return data;
    },
    enabled: !!userSelectedId && isOpen,
  });
  const { toast } = useToast();

  const { mutateAsync: createUser } = useMutation({
    mutationFn: async ({ name, email, password, roleId }: UserCreateData) => {
      const { data } = await api.post("/users", {
        name,
        email,
        password,
        roleId
      });

      return data;
    },
    onSuccess: (data) => {
      const userCreated = data?.user;

      queryClient.setQueryData(["list-users"], (data: any) => {
        return [...data, userCreated];
      });

      toast({ title: "Usuário criado com sucesso!" });
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.error || errorData?.message || error?.message });
    },
  });

  const { mutateAsync: updateUser } = useMutation({
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
      const userUpdated = data?.user;

      queryClient.setQueryData(["list-users"], (data: any) => {
        return data.map((user: any) => {
          if (user.id === userUpdated.id) {
            return userUpdated;
          }

          return user;
        });
      });

      toast({ title: "Usuário atualizado com sucesso!" });
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.error || errorData?.message || error?.message });
    },
  });

  useEffect(() => {
    if (isOpen && userSelectedId) {
      if (status === "error") {
        toast({ title: error?.message });
      }

      if (status === "success") {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setRoleId(user.roleId.toString());
      }
    }
  }, [isOpen, userSelectedId, user]);

  useEffect(() => {
    if (status === "error") {
      toast({ title: error?.message });
    }

    if (status === "success") {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password);
      setRoleId(user.roleId.toString());
    }
  }, [status, user]);

  const handleSubmitUserForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userSelectedId) {
      updateUser({
        id: userSelectedId,
        name,
        email,
        password,
        roleId: Number(roleId)
      });
    } else {
      createUser({
        name,
        email,
        password,
        roleId: Number(roleId)
      });
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRoleId("");
    onClose();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisible);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmitUserForm}>
          <DialogHeader>
            <DialogTitle>{userSelectedId ? "Editar" : "Adicionar"} Usuário</DialogTitle>
          </DialogHeader>

          <div className="user-form">
            <div className="content">
              <div className="field-wrapper">
                <Label htmlFor="name" className="block mb-1">
                  Nome
                </Label>
                <Input type="text" id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="field-wrapper">
                <Label htmlFor="email" className="block mb-1">
                  E-mail
                </Label>
                <Input type="email" id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="field-wrapper">
                <Label htmlFor="password" className="block mb-1">
                  Senha
                </Label>
                <div className="relative">
                  <Input type={passwordVisible ? "text" : "password"} id="password" className="col-span-3 !pr-11" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <Button className="adornment-end absolute right-0 top-0 hover:bg-transparent bg-transparent text-inherit size-11 h-[2.5rem]" type="button" size="sm" onClick={togglePasswordVisibility}>
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <div className="field-wrapper">
                <Label htmlFor="role" className="block mb-1">
                  Cargo
                </Label>
                <RoleSelect selectedRoleId={roleId} setSelectedRoleId={setRoleId} />
              </div>
            </div>
          </div>

          <DialogFooter className="dialog-footer">
            <DialogClose asChild>
              <Button type="button" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit">{userSelectedId ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
