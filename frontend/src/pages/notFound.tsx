const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8 text-gray-600">Oops! Você se perdeu...</h2>
      <p className="text-lg mb-8 text-gray-500">Parece que você encontrou um buraco negro na internet! Vamos te ajudar a sair daqui.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.history.back()}>
        Voltar para a segurança
      </button>
      <p className="text-sm mt-4 text-gray-400">Se você acha que isso é um erro, contate o suporte técnico.</p>
    </div>
  );
};

export default NotFound;
