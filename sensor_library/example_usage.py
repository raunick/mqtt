from sensor_library import SensorManager, MqttParameters

if __name__ == "__main__":
    mqtt_params1 = MqttParameters(
        broker="broker.mqtt.cool",
        port=1883,
        topic="sensors/temperature1",
        update_interval=60
    )
    
    mqtt_params2 = MqttParameters(
        broker="broker.mqtt.cool",
        port=1883,
        topic="sensors/temperature2",
        update_interval=30
    )
    
    manager = SensorManager()
    manager.add_sensor(mqtt_params1)
    manager.add_sensor(mqtt_params2)
    
    manager.start()
