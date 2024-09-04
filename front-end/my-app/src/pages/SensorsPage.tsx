import HumidityCard from '@/components/HumidityCard';
import HumiditySoilCard from '@/components/HumiditySoilCard';
import LightPDDCard from '@/components/LightPDDCard';
import ModuloReleCard from '@/components/ModuloReleCard';
import MotionCard from '@/components/MotionCard';
import TemperatureCard from '@/components/TemperatureCard';
import { Button } from '@/components/ui/button';
import VPDCard from '@/components/VPDCard';
import { CalendarIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';

const Sensors: React.FC = () => {
  return (
    <main className="p-6">
    <div className="flex items-center justify-between">
      <h1 className="ml-2 text-5xl font-bold">Dispositivos</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Jan 20, 2023 - Feb 09, 2023</span>
        </div>
        <Button>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Sensor
        </Button>
      </div>
    </div>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6'>
            <TemperatureCard />
            <HumidityCard />
            <VPDCard />
            <HumiditySoilCard />
            <LightPDDCard />
            <MotionCard />
            <ModuloReleCard />
            <ModuloReleCard />
            <ModuloReleCard />
          </div>
          <div className="grid gap-6  mt-6">
            
          </div>
        </main>
  );
};

export default Sensors;