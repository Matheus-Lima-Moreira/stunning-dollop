import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import api from "@/services/api";
import { toast } from "react-toastify";
import "../../scss/components/dialogs/user_dialog.scss";

const UserDialog = ({ isOpen, userSelectedId, onClose }: { isOpen?: boolean; userSelectedId?: number; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get(`/users/${userSelectedId}`);
        const user = data as any;
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message);
      }
    }

    if (userSelectedId && isOpen) {
      fetchUser();
    }
  }, [userSelectedId, isOpen]);

  const handleSubmitUserForm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userSelectedId) {
        const { data } = await api.put(`/users/${userSelectedId}`, {
          name,
          email,
          password,
        });

        // const newUsers = users.map((user: Users) => {
        //   if (user.id === userSelectedId) {
        //     return {
        //       id: user.id,
        //       name: data.user.name,
        //       email: data.user.email,
        //     } as Users;
        //   }

        //   return user;
        // });

        // setUsers(newUsers);
        toast.success("User updated successfully!");
      } else {
        const { data } = await api.post("/users", {
          name,
          email,
          password,
        });

        const userCreated = data.user as never;
        // setUsers([...users, userCreated]);

        toast.success("User created successfully!");
      }

      setName("");
      setEmail("");
      setPassword("");
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message);
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
