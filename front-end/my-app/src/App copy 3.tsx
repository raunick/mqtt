import React, { useEffect, useState, useCallback } from 'react';
import mqtt from 'mqtt';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { BellIcon, ChevronDownIcon, GearIcon, HomeIcon, InfoCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  const [sensorData, setSensorData] = useState({
    temperature: { current: null, last: null },
    humidity: { current: null, last: null },
    vpd: { current: null, last: null },
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const calculateVpd = useCallback((temp, hum) => {
    if (temp === null || hum === null) return null;
    const es = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
    const ea = (hum / 100) * es;
    return es - ea;
  }, []);

  const updateSensorData = useCallback((type, value) => {
    setSensorData(prevData => {
      const newData = { ...prevData };
      newData[type] = {
        last: newData[type].current,
        current: value
      };
      if (type === 'temperature' || type === 'humidity') {
        const newTemp = type === 'temperature' ? value : newData.temperature.current;
        const newHum = type === 'humidity' ? value : newData.humidity.current;
        const newVpd = calculateVpd(newTemp, newHum);
        newData.vpd = {
          last: newData.vpd.current,
          current: newVpd
        };
      }
      return newData;
    });
    setLastUpdate(Date.now());
  }, [calculateVpd]);

  useEffect(() => {
    const client = mqtt.connect('tcp://broker.mqtt.cool:1883');

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('Sys/sensors/temperature');
      client.subscribe('Sys/sensors/humidity_air');
    });

    client.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      if (topic === 'Sys/sensors/temperature') {
        updateSensorData('temperature', value);
      } else if (topic === 'Sys/sensors/humidity_air') {
        updateSensorData('humidity', value);
      }
    });

    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 5000);

    return () => {
      clearInterval(interval);
      client.end();
    };
  }, [updateSensorData]);

  const calculatePercentageChange = (current, last) => {
    if (last === null || current === null) return null;
    return ((current - last) / last) * 100;
  };

  const formatValue = (value, unit) => {
    return value !== null ? `${value.toFixed(2)} ${unit}` : 'N/A';
  };

  const formatPercentageChange = (current, last) => {
    const change = calculatePercentageChange(current, last);
    return change !== null ? `${change.toFixed(2)}%` : 'N/A';
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">X Sensores</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border">
                    <AvatarImage src="https://thispersondoesnotexist.com/" alt="User Avatar" />
                    <AvatarFallback className='text-black'><span>JD</span></AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[240px_1fr] bg-background">
        <nav className="bg-muted border-r">
          <ul className="grid gap-1 p-4">
            <li>
              <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <InfoCircledIcon className="h-5 w-5" />
                Sensores
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <GearIcon className="h-5 w-5" />
                Configuração
              </a>
            </li>
          </ul>
        </nav>
        <main className="p-5 grid gap-6">
          <div className="flex items-center justify-between ">
            <h2 className="ml-2 text-5xl font-bold">Sensores</h2>
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Client
            </Button>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>Temperatura</CardTitle>
                <CardDescription>
                  Valor atual: {formatValue(sensorData.temperature.current, '°C')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                Mudança: {formatPercentageChange(sensorData.temperature.current, sensorData.temperature.last)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Umidade</CardTitle>
                <CardDescription>
                  Valor atual: {formatValue(sensorData.humidity.current, '%')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                Mudança: {formatPercentageChange(sensorData.humidity.current, sensorData.humidity.last)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>VPD</CardTitle>
                <CardDescription>
                  Valor atual: {formatValue(sensorData.vpd.current, 'kPa')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                Mudança: {formatPercentageChange(sensorData.vpd.current, sensorData.vpd.last)}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados dos Sensores</CardTitle>
                <CardDescription>Valores em tempo real (Última atualização: {new Date(lastUpdate).toLocaleTimeString()})</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='text-center'>
                      <TableHead>Sensor</TableHead>
                      <TableHead>Valor Atual</TableHead>
                      <TableHead>Mudança</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Temperatura</TableCell>
                      <TableCell>{formatValue(sensorData.temperature.current, '°C')}</TableCell>
                      <TableCell>{formatPercentageChange(sensorData.temperature.current, sensorData.temperature.last)}</TableCell>
                      <TableCell>
                        <Badge variant={sensorData.temperature.current !== null ? "success" : "destructive"}>
                          {sensorData.temperature.current !== null ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Umidade</TableCell>
                      <TableCell>{formatValue(sensorData.humidity.current, '%')}</TableCell>
                      <TableCell>{formatPercentageChange(sensorData.humidity.current, sensorData.humidity.last)}</TableCell>
                      <TableCell>
                        <Badge variant={sensorData.humidity.current !== null ? "success" : "destructive"}>
                          {sensorData.humidity.current !== null ? "Online" : "Offline"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>VPD</TableCell>
                      <TableCell>{formatValue(sensorData.vpd.current, 'kPa')}</TableCell>
                      <TableCell>{formatPercentageChange(sensorData.vpd.current, sensorData.vpd.last)}</TableCell>
                      <TableCell>
                        <Badge variant={sensorData.vpd.current !== null ? "success" : "destructive"}>
                          {sensorData.vpd.current !== null ? "Calculado" : "Indisponível"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;