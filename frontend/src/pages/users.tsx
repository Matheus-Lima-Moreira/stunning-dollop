import { useEffect, useState } from "react";
import "../scss/pages/users.scss";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserDialog from "@/components/dialogs/userDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";

interface Users {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [userSelectedId, setUserSelectedId] = useState(0);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: users,
    error,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["list-users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
  const { toast } = useToast();

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["list-users"], (data: any) => {
        return data.filter((user: Users) => user.id !== id);
      });

      toast({ title: "Usuário deletado com sucesso!" });
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.message || errorData?.error || error?.message });
    },
  });

  useEffect(() => {
    if (status === "error") {
      toast({ title: error?.message });
    }
  }, [status]);

  const handleDelete = async (id: number) => {
    deleteUser(id);
  };

  const handleEdit = (id: number) => {
    setUserSelectedId(id);
    setOpenUserDialog(true);
  };

  return (
    <div className="user-list">
      <UserDialog isOpen={openUserDialog} userSelectedId={userSelectedId} onClose={() => setOpenUserDialog(false)} />

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
          {isLoading && (
            <TableRow>
              <TableCell>
                <Skeleton className="h-4 w-[50px] ml-auto mr-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[50px] ml-auto mr-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[50px] ml-auto mr-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[50px] ml-auto mr-auto" />
              </TableCell>
            </TableRow>
          )}

          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            users.length > 0 &&
            users.map((user: Users) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="table-actions">
                    <Button className="edit-button" type="button" onClick={() => handleEdit(user.id)}>
                      Editar
                    </Button>

                    <Button className="delete-button" type="button" onClick={() => handleDelete(user.id)}>
                      Deletar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
