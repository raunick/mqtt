import ParticleCube from '@/components/ParticleCube';
import React from 'react';

const Simulator3dPage: React.FC = () => {
  return (
    <main className="h-full w-full">
        <ParticleCube apiEndpoint="http://127.0.0.1:8000/sensors" />
    </main>
  );
};

export default Simulator3dPage;
