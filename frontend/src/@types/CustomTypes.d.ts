interface LoggedInUser {
  id: number;
  email: string;
  name: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserCreateData {
  name: string;
  email: string;
  password: string;
}

interface UserUpdateData extends UserCreateData {
  id: number;
}