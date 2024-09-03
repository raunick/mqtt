import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Sensor {
  name: string;
  type: string;
  status: 'Online' | 'Offline';
  value: string;
}

const SensorMonitoringTable: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sensors');
      const data: Sensor[] = await response.json();
      setSensors(data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData,10000); // Update every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitorização</CardTitle>
        <CardDescription>Individual</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className='text-center'>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sensors.map((sensor, index) => (
              <TableRow key={index}>
                <TableCell>{sensor.name}</TableCell>
                <TableCell>{sensor.type}</TableCell>
                <TableCell>
                  <Badge variant={sensor.status === "Online" ? "default" : "destructive"}>
                    {sensor.status}
                  </Badge>
                </TableCell>
                <TableCell>{sensor.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Detalhes</Button>
      </CardFooter>
    </Card>
  );
};

export default SensorMonitoringTable;