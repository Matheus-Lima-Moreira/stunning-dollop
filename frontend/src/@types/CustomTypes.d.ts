interface LoggedInUser {
  id: number;
  email: string;
  name: string;
  password: string;
  role: Roles;
}

interface LoginData {
  email: string;
  password: string;
}

interface Users {
  id: number;
  name: string;
  email: string;
  role: Roles;
}

interface UserCreateData {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

interface UserUpdateData extends UserCreateData {
  id: number;
}

interface Roles {
  id: number;
  name: string;
  permissions: {
    id: number;
    name: string;
  }[];
}

interface RoleCreateData {
  name: string;
  permissions: string[];
}

interface RoleUpdateData extends RoleCreateData {
  id: number;
}