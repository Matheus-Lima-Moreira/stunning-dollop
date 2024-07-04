import { useEffect, useState } from "react";
import "../scss/pages/users.scss";
import { toast } from "react-toastify";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserDialog from "@/components/dialogs/userDialog";

interface Users {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState([] as Users[]);
  const [userSelectedId, setUserSelectedId] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      const newUsers = users.filter((user: Users) => user.id !== id);
      setUsers(newUsers);
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || error?.message);
    }
  };

  return (
    <div className="user-list">
      <UserDialog isOpen={openUserDialog} userSelectedId={userSelectedId} onClose={() => setOpenUserDialog(false)}/>

      <div className="users-wrapper">
        <div className="user-actions">
          <Button
            className="button"
            type="button"
            onClick={() => {
              setUserSelectedId(0);
              setOpenUserDialog(true);
            }}>
            Adicionar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[100px]">ID</TableHead>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">E-mail</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: Users) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="table-actions">
                <Button
                  className="edit-button"
                  type="button"
                  onClick={() => {
                    setUserSelectedId(user.id);
                    setOpenUserDialog(true);
                  }}>
                  Editar
                </Button>

                <Button className="delete-button" type="button" onClick={() => handleDelete(user.id)}>
                  Deletar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
