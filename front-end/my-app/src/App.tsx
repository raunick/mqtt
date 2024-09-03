import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import {  BellIcon, ChevronDownIcon, CodeSandboxLogoIcon, GearIcon, HomeIcon, InfoCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';import HumidityCard from './components/HumidityCard';
import TemperatureCard from './components/TemperatureCard';
import VPDCard from './components/VpdCard';
import SensorMonitoringTable from './components/SensorMonitoringTable';
import ParticleCube from './components/ParticleCube';
import { Outlet } from "react-router-dom";


function App() {
  const [sensors, setSensors] = useState([]);
  console.log(sensors)
  useEffect(() => {
    fetch('http://127.0.0.1:8000/sensors')
      .then(response => response.json())
      .then(data => setSensors(data))
      .catch(error => console.error('Error fetching sensor data:', error));
  }, []);

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
                    <AvatarFallback className='text-black' ><span>JD</span></AvatarFallback>
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
                href="/Dashboard"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/Sensors"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <InfoCircledIcon className="h-5 w-5" />
                Sensores
              </a>
            </li>
            <li>
              <a
                href="/Adminstrator"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <GearIcon className="h-5 w-5" />
                Configuração
              </a>
            </li>
            <li>
              <a
                href="/3d"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <CodeSandboxLogoIcon className="h-5 w-5" />
                3D Simulator - BETA
              </a>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
