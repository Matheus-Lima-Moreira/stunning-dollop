import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import api from "@/services/api";
import { toast } from "react-toastify";
import "../../scss/components/dialogs/user_dialog.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UserCreateData {
  name: string;
  email: string;
  password: string;
}

interface UserUpdateData extends UserCreateData {
  id: number;
}

const UserDialog = ({ isOpen, userSelectedId, onClose }: { isOpen?: boolean; userSelectedId?: number; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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

  const { mutateAsync: createUser } = useMutation({
    mutationFn: async ({ name, email, password }: UserCreateData) => {
      const { data } = await api.post("/users", {
        name,
        email,
        password,
      });

      return data;
    },
    onSuccess: (data) => {
      const userCreated = data?.user;

      queryClient.setQueryData(["list-users"], (data: any) => {
        return [...data, userCreated];
      });

      toast.success("Usuário criado com sucesso!");
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast.error(errorData?.error || errorData?.message || error?.message);
    },
  });

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: async ({ id, name, email, password }: UserUpdateData) => {
      const { data } = await api.put(`/users/${id}`, {
        name,
        email,
        password,
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

      toast.success("Usuário atualizado com sucesso!");
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast.error(errorData?.error || errorData?.message || error?.message);
    },
  });

  useEffect(() => {
    if (isOpen && userSelectedId) {
      if (status === "error") {
        toast.error(error?.message);
      }

      if (status === "success") {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
      }
    }
  }, [isOpen, userSelectedId]);

  useEffect(() => {
    if (status === "error") {
      toast.error(error?.message);
    }

    if (status === "success") {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password);
    }
  }, [status]);

  const handleSubmitUserForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userSelectedId) {
      updateUser({
        id: userSelectedId,
        name,
        email,
        password,
      });
    } else {
      createUser({
        name,
        email,
        password,
      });
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    onClose();
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
                <Label htmlFor="name">Nome</Label>
                <Input type="text" id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field-wrapper">
                <Label htmlFor="email">E-mail</Label>
                <Input type="email" id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field-wrapper">
                <Label htmlFor="password">Senha</Label>
                <Input type="password" id="password" className="col-span-3" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter>
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
