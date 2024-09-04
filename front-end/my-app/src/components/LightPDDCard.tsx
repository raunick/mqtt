import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface LightPDDData {
  current_value: number;
  previous_value: number;
  diference: number;
  percentage_change: number;
}

const LightPDDCard: React.FC = () => {
  const [LightPDDData, setLightPDDData] = useState<LightPDDData | null>(null);

  useEffect(() => {
    const fetchLightPDDData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/sensor/Light%20PPD');
        const data: LightPDDData = await response.json();
        console.log(data);
        setLightPDDData(data);
      } catch (error) {
        console.error('Error fetching LightPDD data:', error);
      }
    };

    fetchLightPDDData();
    const intervalId = setInterval(fetchLightPDDData, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId);
  }, []);

  const renderChangeIndicator = () => {
    if (!LightPDDData) return null;
    const { diference } = LightPDDData;
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
        <CardTitle>Light</CardTitle>
        <CardDescription>Atualização em tempo real 🟢</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="text-left">
            <p className="text-5xl  pb-2 font-bold">
              {LightPDDData ? `${LightPDDData.current_value.toFixed(0)} ` : 'N/A'}
            </p>
            <p className="text-sm pb-2 ">
              Previous: {LightPDDData ? `${LightPDDData.previous_value.toFixed(2)}%` : 'N/A'}
            </p>
            {renderChangeIndicator()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LightPDDCard;