import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface ModuloReleData {
  current_id: number;
  previous_id: number;
  current_value: string;
  previous_value: string;
  diference: string;
  percentage_change: string;
}

const ModuloReleCard: React.FC = () => {
  const [moduloReleData, setModuloReleData] = useState<ModuloReleData | null>(null);

  useEffect(() => {
    const fetchModuloReleData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sensor/modulos/rele');
        const data: ModuloReleData = await response.json();
        setModuloReleData(data);
      } catch (error) {
        console.error('Error fetching ModuloRele data:', error);
      }
    };

    fetchModuloReleData();
    const intervalId = setInterval(fetchModuloReleData, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  const renderChangeIndicator = () => {
    if (!moduloReleData || moduloReleData.diference === '-') return null;
    const isPositive = parseFloat(moduloReleData.diference) > 0;
    return (
      <Badge variant="default" className={isPositive ? "bg-green-500" : "bg-red-500"}>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        {Math.abs(parseFloat(moduloReleData.diference)).toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Modulo Rele</CardTitle>
        <CardDescription>Atualização em tempo real 🟢</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="text-left">
            <p className="text-5xl pb-2 font-bold">
              {moduloReleData ? `${moduloReleData.current_value === 'True' ? 'Ligado' : 'Desligado'}` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuloReleCard;
