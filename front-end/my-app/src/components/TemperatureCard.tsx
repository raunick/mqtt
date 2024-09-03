import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface TemperatureData {
  current_value: number;
  previous_value: number;
  diference: number;
  percentage_change: number;
}

const TemperatureCard: React.FC = () => {
  const [TemperatureData, setTemperatureData] = useState<TemperatureData | null>(null);

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sensor/Temperature');
        const data: TemperatureData = await response.json();
        console.log(data);
        setTemperatureData(data);
      } catch (error) {
        console.error('Error fetching Temperature data:', error);
      }
    };

    fetchTemperatureData();
    const intervalId = setInterval(fetchTemperatureData, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  const renderChangeIndicator = () => {
    if (!TemperatureData) return null;
    const { diference } = TemperatureData;
    const isPositive = diference > 0;
    return (
      <Badge variant="default" className={isPositive ? "bg-green-500" : "bg-red-500"}>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        {Math.abs(diference).toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className='w-full '>
      <CardHeader>
        <CardTitle>Temperature</CardTitle>
        <CardDescription>Atualização em tempo real 🟢</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="text-left">
            <p className="text-5xl  pb-2 font-bold">
              {TemperatureData ? `${TemperatureData.current_value.toFixed(2)}%` : 'N/A'}
            </p>
            <p className="text-sm pb-2 ">
              Previous: {TemperatureData ? `${TemperatureData.previous_value.toFixed(2)}%` : 'N/A'}
            </p>
            {renderChangeIndicator()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemperatureCard;