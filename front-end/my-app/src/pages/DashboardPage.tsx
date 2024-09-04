import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DownloadIcon } from '@radix-ui/react-icons';
import AreaChartComponent from '@/components/AreaChartComponent';
import RadialChartText from '../components/RadialChartText';
import LineChartComponent from '@/components/LineChartComponent';
import BarChartComponent from '@/components/BarChartComponent';
import RadarChartComponet from '@/components/RadarChartComponet';
import SensorMonitoringTable from '@/components/SensorMonitoringTable';

const Dashboard: React.FC = () => {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="ml-2 text-5xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Jan 20, 2023 - Feb 09, 2023</span>
          </div>
          <Button>
            <DownloadIcon className="h-5 w-5 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Card className="">
          <CardHeader>
            <CardTitle>Total Mensagens enviadas</CardTitle>
            <CardDescription className='text-3xl text-black font-bold'>45.231.89</CardDescription>
          </CardHeader>
          <CardContent className='text-gray-500'>+20.1% do ultimo mês</CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Total de topicos inscritos</CardTitle>
            <CardDescription className='text-3xl text-black font-bold'>6</CardDescription>
          </CardHeader>
          <CardContent   className='text-gray-500'>+0.1% do ultimo mês</CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Falhas de conexão</CardTitle>
            <CardDescription className='text-3xl text-black font-bold'>5</CardDescription>
          </CardHeader>
          <CardContent  className='text-gray-500'>-19% do ultimo mês</CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Total relatorio emitidos</CardTitle>
            <CardDescription className='text-3xl text-black font-bold'>573</CardDescription>
          </CardHeader>
          <CardContent className='text-gray-500'>+20% do ultimo mês</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <RadialChartText />        
        <RadarChartComponet />
        <LineChartComponent />
        <BarChartComponent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AreaChartComponent />

        <SensorMonitoringTable  />
      </div>

    </main>
  );
};

export default Dashboard;
