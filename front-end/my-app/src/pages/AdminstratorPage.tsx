import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';

const Adminstrator: React.FC = () => {
  const [pollingInterval, setPollingInterval] = useState('5');

  return (
    <main className="p-6">
    <div className="flex items-center justify-between">
      <h1 className="ml-2 text-5xl font-bold">Configurações</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Jan 20, 2023 - Feb 09, 2023</span>
        </div>
        <Button>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Sensor
        </Button>
      </div>
    </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Configurações Banco de dados</CardTitle>
            <CardDescription>Status do Sistema 🟢</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Polling Interval</label>
                <select
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="60">1 minute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Banco</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caminho</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter location"
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">Tipo do banco</label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Sql</option>
                  <option value="user">NoSql</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div>
            <Button variant={'outline'}>Save</Button> <Button variant={'destructive'}>Delete</Button> 
            </div>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Configurações API</CardTitle>
            <CardDescription>Status do Sistema 🟢</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Polling Interval</label>
                <select
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="60">1 minute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sensor Group</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Level</label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Configurações Front-end</CardTitle>
            <CardDescription>Status do Sistema 🟢</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Polling Interval</label>
                <select
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="60">1 minute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sensor Group</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Access Level</label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Adminstrator;
