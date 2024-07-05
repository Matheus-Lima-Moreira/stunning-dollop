import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "../scss/pages/roles.scss";
import TableRowSkeleton from "@/components/TableRowSkeleton";
import RoleDialog from "@/components/dialogs/roleDialog";
import { AxiosError } from "axios";
import RolePermissionsDialog from "@/components/dialogs/rolePermissionsDialog";

const Roles = () => {
  const [roleSelectedId, setRoleSelectedId] = useState(0);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openRolePermissionsDialog, setOpenRolePermissionsDialog] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: roles,
    error,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["list-roles"],
    queryFn: async () => {
      const { data } = await api.get("/roles");
      return data;
    },
  });
  const { toast } = useToast();

  const { mutateAsync: deleteRole } = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/roles/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["list-roles"], (data: any) => {
        return data.filter((role: Roles) => role.id !== id);
      });

      toast({ title: "Cargo deletado com sucesso!" });
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.message || errorData?.error || error?.message });
    },
  });

  const handleDelete = async (id: number) => {
    deleteRole(id);
  };

  const handleEdit = (id: number) => {
    setRoleSelectedId(id);
    setOpenRoleDialog(true);
  };

  const handleEditPermissions = (id: number) => {
    setRoleSelectedId(id);
    setOpenRolePermissionsDialog(true);
  };

  useEffect(() => {
    if (status === "error") {
      toast({ title: error?.message });
    }
  }, [status]);

  return (
    <div className="role-list">
      <RoleDialog isOpen={openRoleDialog} roleSelectedId={roleSelectedId} onClose={() => setOpenRoleDialog(false)} />

      <RolePermissionsDialog isOpen={openRolePermissionsDialog} roleSelectedId={roleSelectedId} onClose={() => setOpenRolePermissionsDialog(false)} />

      <div className="roles-wrapper">
        <div className="role-actions">
          <Button
            className="button"
            type="button"
            onClick={() => {
              setRoleSelectedId(0);
              setOpenRoleDialog(true);
            }}>
            Adicionar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRowSkeleton columns={2} />}

          {!isLoading && roles?.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Nenhum cargo encontrado.
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            roles?.length > 0 &&
            roles.map((role: Roles) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <div className="table-actions">
                    <Button className="edit-button" type="button" onClick={() => handleEdit(role.id)}>
                      Editar
                    </Button>

                    <Button className="edit-button" type="button" onClick={() => handleEditPermissions(role.id)}>
                      Permissões
                    </Button>

                    <Button className="delete-button" type="button" onClick={() => handleDelete(role.id)}>
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

export default Roles;
