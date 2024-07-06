import { useAuthContext } from "@/context/Auth/AuthContext";

const RestrictAccess = ({ children, neededPermissions }: { children: React.ReactNode; neededPermissions: string[] }) => {
  const { user, loading, isAuth } = useAuthContext();

  if (!user || loading || !isAuth) {
    return <></>;
  }

  const hasPermission = neededPermissions.some((permission) => user.role.permissions.some((userPermission) => userPermission.name === permission));

  if (!hasPermission) {
    return <></>;
  }

  return <>{children}</>;
};

export default RestrictAccess;
