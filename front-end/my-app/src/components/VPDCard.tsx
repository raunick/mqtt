import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface SensorData {
  current_value: number;
  previous_value: number;
  diference: number;
  percentage_change: number;
}

interface VPDData {
  current_value: number;
  previous_value: number;
  difference: number;
  percentage_change: number;
}

const VPD_IDEAL = {
  vegetativo: { min: 0.8, max: 1.2 },
  floracao: { min: 1.2, max: 1.6 }
};

const VPDCard: React.FC = () => {
  const [humidityData, setHumidityData] = useState<SensorData | null>(null);
  const [temperatureData, setTemperatureData] = useState<SensorData | null>(null);
  const [vpdData, setVPDData] = useState<VPDData | null>(null);
  const [stage, setStage] = useState<'vegetativo' | 'floracao'>('vegetativo');

  console.log(humidityData);
  console.log(temperatureData);
  const fetchSensorData = async (sensorType: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/sensor/${encodeURIComponent(sensorType)}`);
      const data: SensorData = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${sensorType} data:`, error);
      return null;
    }
  };

  const calculateVPD = (temperature: number, humidity: number) => {
    const saturationVaporPressure = 0.611 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    const actualVaporPressure = saturationVaporPressure * (humidity / 100);
    return saturationVaporPressure - actualVaporPressure;
  };

  useEffect(() => {
    const fetchData = async () => {
      const humidityData = await fetchSensorData('Humidity Air');
      const temperatureData = await fetchSensorData('Temperature');

      setHumidityData(humidityData);
      setTemperatureData(temperatureData);

      if (humidityData && temperatureData) {
        const currentVPD = calculateVPD(temperatureData.current_value, humidityData.current_value);
        const previousVPD = calculateVPD(temperatureData.previous_value, humidityData.previous_value);
        const difference = currentVPD - previousVPD;
        const percentageChange = (difference / previousVPD) * 100;

        setVPDData({
          current_value: currentVPD,
          previous_value: previousVPD,
          difference,
          percentage_change: percentageChange
        });
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const isVPDOk = (vpd: number) => {
    const { min, max } = VPD_IDEAL[stage];
    return vpd >= min && vpd <= max;
  };

  const renderChangeIndicator = () => {
    if (!vpdData) return null;
    const { difference } = vpdData;
    const isPositive = difference > 0;
    return (
      <Badge variant={isPositive ? "default" : "destructive"}>
        {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
        {Math.abs(difference).toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="">VPD</CardTitle>
          <Select value={stage} onValueChange={(value: 'vegetativo' | 'floracao') => setStage(value)}>
            <SelectTrigger className="w-35 h-8">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetativo">Vegetativo</SelectItem>
              <SelectItem value="floracao">Floração</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Vapor Pressure Deficit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-2">
          <div className="text-4xl font-bold">
            {vpdData ? (
              <span className={isVPDOk(vpdData.current_value) ? "text-green-500" : "text-red-500"}>
                {vpdData.current_value.toFixed(2)} kPa
              </span>
            ) : 'N/A'}
          </div>
          <div className="text-sm">
            Previous: {vpdData ? `${vpdData.previous_value.toFixed(2)} kPa` : 'N/A'}
          </div>
          {renderChangeIndicator()}
          <div className="text-xs text-gray-300 mt-2">
            Ideal range: {VPD_IDEAL[stage].min} - {VPD_IDEAL[stage].max} kPa
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VPDCard;