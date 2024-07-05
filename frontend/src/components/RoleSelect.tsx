import api from "@/services/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";

const RoleSelect = ({ selectedRoleId, setSelectedRoleId }: { selectedRoleId: string; setSelectedRoleId: (id: string) => void }) => {
  const { data: roles, isLoading } = useQuery({
    queryKey: ["list-roles"],
    queryFn: async () => {
      const { data } = await api.get("/roles");
      return data;
    },
  });

  return (
    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um cargo" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {isLoading && <SelectLabel className="text-center">Carregando...</SelectLabel>}

          {!isLoading && roles.length === 0 && <SelectLabel className="text-center">Nenhum cargo encontrado</SelectLabel>}

          {!isLoading &&
            roles.length > 0 &&
            roles.map((role: Roles) => (
              <SelectItem key={role.id} value={role?.id?.toString()}>
                {role.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
