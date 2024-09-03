import { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from './components/ui/button';
import { BellIcon, ChevronDownIcon, GearIcon, HomeIcon, InfoCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const [sensors, setSensors] = useState([]);
  const [lastTemperature, setLastTemperature] = useState(null);
  const [lastHumidity, setLastHumidity] = useState(null);

  useEffect(() => {
    const client = mqtt.connect('tcp://broker.mqtt.cool:1883');

    client.on('connect', () => {
      client.subscribe('Sys/sensors/temperature');
      client.subscribe('Sys/sensors/humidity_air');
    });

    client.on('message', (topic, message) => {
      const payload = parseFloat(message.toString());

      if (topic === 'Sys/sensors/temperature') {
        const tempDelta = lastTemperature !== null ? payload - lastTemperature : 0;
        setLastTemperature(payload);

        const sensorData = {
          name: 'Temperature Sensor',
          type: 'Temperature',
          status: 'Online',
          value: `${payload.toFixed(1)} °C (${tempDelta >= 0 ? '+' : ''}${tempDelta.toFixed(1)} °C)`
        };
        setSensors(prevSensors => [sensorData, ...prevSensors.filter(s => s.type !== 'Temperature')]);
      }

      if (topic === 'Sys/sensors/humidity_air') {
        const humidDelta = lastHumidity !== null ? payload - lastHumidity : 0;
        setLastHumidity(payload);

        const sensorData = {
          name: 'Humidity Sensor',
          type: 'Humidity',
          status: 'Online',
          value: `${payload.toFixed(1)}% (${humidDelta >= 0 ? '+' : ''}${humidDelta.toFixed(1)}%)`
        };
        setSensors(prevSensors => [sensorData, ...prevSensors.filter(s => s.type !== 'Humidity')]);
      }
    });

    return () => {
      client.end();
    };
  }, [lastTemperature, lastHumidity]);

  const calculateVPD = (temperature, humidity) => {
    const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    const actualVaporPressure = (humidity / 100) * saturationVaporPressure;
    return saturationVaporPressure - actualVaporPressure;
  };

  useEffect(() => {
    if (lastTemperature !== null && lastHumidity !== null) {
      const vpd = calculateVPD(lastTemperature, lastHumidity);
      const sensorData = {
        name: 'VPD',
        type: 'VPD',
        status: 'Calculated',
        value: `${vpd.toFixed(2)} kPa`
      };
      setSensors(prevSensors => [sensorData, ...prevSensors.filter(s => s.type !== 'VPD')]);
    }
  }, [lastTemperature, lastHumidity]);

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
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <InfoCircledIcon className="h-5 w-5" />
                Sensores
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <GearIcon className="h-5 w-5" />
                Configuração
              </a>
            </li>
          </ul>
        </nav>
        <main className="p-5 grid gap-6">
          <div className="flex items-center justify-between">
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
                <CardDescription>Lista de sensores</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Umidade</CardTitle>
                <CardDescription>Lista de sensores</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>VPD</CardTitle>
                <CardDescription>Lista de sensores</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>John Doe</CardTitle>
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
                          <Badge variant={sensor.status === "Online" || sensor.status === "Calculated" ? "success" : "destructive"}>
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
                <Button variant="outline">View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
