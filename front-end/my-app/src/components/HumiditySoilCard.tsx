import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface HumiditySoilData {
  current_value: number;
  previous_value: number;
  diference: number;
  percentage_change: number;
}

const HumiditySoilCard: React.FC = () => {
  const [humiditySoilData, setHumiditySoilData] = useState<HumiditySoilData | null>(null);

  useEffect(() => {
    const fetchHumiditySoilData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sensor/Humidity%20Soil');
        const data: HumiditySoilData = await response.json();
        console.log(data);
        setHumiditySoilData(data);
      } catch (error) {
        console.error('Error fetching humiditySoil data:', error);
      }
    };

    fetchHumiditySoilData();
    const intervalId = setInterval(fetchHumiditySoilData, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  const renderChangeIndicator = () => {
    if (!humiditySoilData) return null;
    const { diference } = humiditySoilData;
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
        <CardTitle>Humidity Soil</CardTitle>
        <CardDescription>Atualização em tempo real 🟢</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="text-left">
            <p className="text-5xl  pb-2 font-bold">
              {humiditySoilData ? `${humiditySoilData.current_value.toFixed(2)}%` : 'N/A'}
            </p>
            <p className="text-sm pb-2 ">
              Previous: {humiditySoilData ? `${humiditySoilData.previous_value.toFixed(2)}%` : 'N/A'}
            </p>
            {renderChangeIndicator()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HumiditySoilCard;