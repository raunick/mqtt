import HumidityCard from '@/components/HumidityCard';
import SensorMonitoringTable from '@/components/SensorMonitoringTable';
import TemperatureCard from '@/components/TemperatureCard';
import { Button } from '@/components/ui/button';
import VPDCard from '@/components/VpdCard';
import { PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Sensors: React.FC = () => {
  return (
    <main className="p-5 grid gap-6">
        <Outlet />
          <div className="flex items-center justify-between ">
          
            <h2 className="ml-2 text-5xl font-bold">Sensores</h2>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Sensor
            </Button>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            <TemperatureCard />
            <HumidityCard />
            <VPDCard />
          </div>
          <div className="grid gap-6">
            <SensorMonitoringTable  />
          </div>
        </main>
  );
};

export default Sensors;