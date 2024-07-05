import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Permissions from "@/rules";
import { Button } from "../ui/button";
import { DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { useToast } from "../ui/use-toast";
import { AxiosError } from "axios";

const RolePermissionsDialog = ({ isOpen, roleSelectedId, onClose }: { isOpen?: boolean; roleSelectedId?: number; onClose: () => void }) => {
  const [permissionsSelected, setPermissionsSelected] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const {
    data: role,
    status,
    error,
  } = useQuery({
    queryKey: ["show-role", roleSelectedId],
    queryFn: async () => {
      const { data } = await api.get(`/roles/${roleSelectedId}`);
      return data;
    },
    enabled: !!roleSelectedId && isOpen,
  });
  const { toast } = useToast();

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, name, permissions }: RoleUpdateData) => {
      const { data } = await api.put(`/roles/${id}`, {
        name,
        permissions,
      });

      return data;
    },
    onSuccess: (data) => {
      const roleUpdated = data?.role;

      queryClient.setQueryData(["list-roles"], (data: any) => {
        return data.map((role: any) => {
          if (role.id === roleUpdated.id) {
            return roleUpdated;
          }

          return role;
        });
      });

      toast({ title: "Cargo atualizado com sucesso!" });
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.error || errorData?.message || error?.message });
    },
  });

  const handleClose = () => {
    setPermissionsSelected([]);
    onClose();
  };

  const handleUpdateRole = async () => {
    if (!roleSelectedId) return;

    await updateRole({ id: roleSelectedId, name: role?.name, permissions: permissionsSelected });
  }

  useEffect(() => {
    if (isOpen && roleSelectedId) {
      if (status === "error") {
        toast({ title: error?.message });
      }

      if (status === "success") {
        setPermissionsSelected(role.permissions.map((p: any) => p.name));
      }
    }
  }, [isOpen, roleSelectedId, role]);

  useEffect(() => {
    if (status === "error") {
      toast({ title: error?.message });
    }

    if (status === "success") {
      setPermissionsSelected(role.permissions.map((p: any) => p.name));
    }
  }, [status, role]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Permissões</DialogTitle>
        <DialogDescription>Selecione as permissões que o cargo terá acesso.</DialogDescription>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Permissão</TableHead>
              <TableHead className="text-center">Ativar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(Permissions).map((key) => (
              <TableRow
                key={key}
                onClick={() => {
                  if (permissionsSelected.includes(key)) {
                    setPermissionsSelected(permissionsSelected.filter((p) => p !== key));
                  } else {
                    setPermissionsSelected([...permissionsSelected, key]);
                  }
                }}>
                <TableCell className="text-center">{Permissions[key]}</TableCell>
                <TableCell className="text-center p-0">
                  <Checkbox id={key} name={key} value={key} checked={permissionsSelected.includes(key)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter className="dialog-footer">
          <DialogClose asChild>
            <Button
              className="button"
              type="button"
              onClick={() => {
                handleUpdateRole();
              }}>
              Salvar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RolePermissionsDialog;
