from sensor_library import SensorManager, MqttParameters

def main():
    # Dados do Broker MQTT
    broker = "broker.mqtt.cool"
    porta = 1883
    topic = 'sensors'
    sensores = ['temperature', 'humidity_air', 'humidity_soil', 'light', 'motion', 'modulo_rele']
    
    # Crie uma instância do SensorManager
    manager = SensorManager()
    
    # Adicione os sensores ao SensorManager
    for sensor_type in sensores:
        parameters = MqttParameters(
            broker=broker,
            port=porta,
            topic=f'{topic}/{sensor_type}',
            update_interval=30,  # Intervalo de atualização em segundos
            sensor_type=sensor_type
        )
        manager.add_sensor(parameters)
        print(f'Adicionando sensor: {sensor_type}')
    
    # Inicie o gerenciamento dos sensores
    print('Sensores adicionados com sucesso!')
    print('Iniciando o gerenciamento dos sensores...')
    manager.start()

if __name__ == "__main__":
    main()
