import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface HumidityData {
  current_value: number;
  previous_value: number;
  diference: number;
  percentage_change: number;
}

const HumidityCard: React.FC = () => {
  const [humidityData, setHumidityData] = useState<HumidityData | null>(null);

  useEffect(() => {
    const fetchHumidityData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sensor/Humidity%20Air');
        const data: HumidityData = await response.json();
        console.log(data);
        setHumidityData(data);
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchHumidityData();
    const intervalId = setInterval(fetchHumidityData, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  const renderChangeIndicator = () => {
    if (!humidityData) return null;
    const { diference } = humidityData;
    const isPositive = diference > 0;
    return (
      <Badge variant="default" className={isPositive ? "bg-green-500" : "bg-red-500"}>
        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
        {Math.abs(diference).toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Humidity</CardTitle>
        <CardDescription>Atualização em tempo real 🟢</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="text-left">
            <p className="text-5xl  pb-2 font-bold">
              {humidityData ? `${humidityData.current_value.toFixed(2)}%` : 'N/A'}
            </p>
            <p className="text-sm pb-2 ">
              Previous: {humidityData ? `${humidityData.previous_value.toFixed(2)}%` : 'N/A'}
            </p>
            {renderChangeIndicator()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HumidityCard;