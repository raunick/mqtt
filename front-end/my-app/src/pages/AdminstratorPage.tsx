import React from 'react';

const Adminstrator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">Adminstrator</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Opa! Redirecionamento Inesperado</h2>
        <p className="text-gray-600 mb-6">
          Parece que você foi redirecionado para cá... mas não se preocupe, não é o fim do mundo!
        </p>
        <div className="text-5xl mb-6">🕵️‍♂️🚀</div>
        <p className="text-gray-700 mb-6">
          Nossos detetives cibernéticos estão investigando este redirecionamento misterioso.
          Enquanto isso, que tal uma piada?
        </p>
        <p className="text-gray-800 italic mb-8">
          "quando voce perceber que o computador esta velho ?
          a placa mae ja virou avó "
        </p>
        <a 
          href="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Voltar para a Página Inicial
        </a>
      </div>
    </div>
  );
};

export default Adminstrator;