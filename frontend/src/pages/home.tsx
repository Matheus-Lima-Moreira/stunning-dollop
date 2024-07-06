import { useAuthContext } from "@/context/Auth/AuthContext";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
    </div>
  );
};

export default Home;
