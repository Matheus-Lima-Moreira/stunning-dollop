import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import api from "@/services/api";
import "../../scss/components/dialogs/role_dialog.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";

const RoleDialog = ({ isOpen, roleSelectedId, onClose }: { isOpen?: boolean; roleSelectedId?: number; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [permissionsSelected, setPermissionsSelected] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const {
    data: role,
    error,
    status,
  } = useQuery({
    queryKey: ["show-role", roleSelectedId],
    queryFn: async () => {
      const { data } = await api.get(`/roles/${roleSelectedId}`);
      return data;
    },
    enabled: !!roleSelectedId && isOpen,
  });
  const { toast } = useToast();

  const { mutateAsync: createRole } = useMutation({
    mutationFn: async ({ name, permissions }: RoleCreateData) => {
      const { data } = await api.post("/roles", {
        name,
        permissions,
      });

      return data;
    },
    onSuccess: (data) => {
      const roleCreated = data?.role;

      queryClient.setQueryData(["list-roles"], (data: any) => {
        return [...data, roleCreated];
      });

      toast({ title: "Cargo criado com sucesso!" });
      handleClose();
    },
    onError: (error: AxiosError) => {
      const errorData = error?.response?.data as any;
      toast({ title: errorData?.error || errorData?.message || error?.message });
    },
  });

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

  useEffect(() => {
    if (isOpen && roleSelectedId) {
      if (status === "error") {
        toast({ title: error?.message });
      }

      if (status === "success") {
        setName(role.name);
        setPermissionsSelected(role.permissions.map((p: any) => p.name));
      }
    }
  }, [isOpen, roleSelectedId, role]);

  useEffect(() => {
    if (status === "error") {
      toast({ title: error?.message });
    }

    if (status === "success") {
      setName(role.name);
      setPermissionsSelected(role.permissions.map((p: any) => p.name));
    }
  }, [status, role]);

  const handleSubmitRoleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (roleSelectedId) {
      updateRole({
        id: roleSelectedId,
        name,
        permissions: permissionsSelected,
      });
    } else {
      createRole({
        name,
        permissions: permissionsSelected,
      });
    }
  };

  const handleClose = () => {
    setName("");
    setPermissionsSelected([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmitRoleForm}>
          <DialogHeader>
            <DialogTitle>{roleSelectedId ? "Editar" : "Adicionar"} Cargo</DialogTitle>
          </DialogHeader>

          <div className="role-form">
            <div className="content">
              <div className="field-wrapper">
                <Label htmlFor="name" className="block mb-1">
                  Nome
                </Label>
                <Input type="text" id="name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>              
            </div>
          </div>

          <DialogFooter className="dialog-footer">
            <DialogClose asChild>
              <Button type="button" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit">{roleSelectedId ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
