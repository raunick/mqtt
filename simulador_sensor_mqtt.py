import random
from typing import Callable, Dict
from central_sensores_mqtt import SensorManager, MqttParameters, SensorConfig

# Define sensor data generation functions
def generate_temperature() -> float:
    """
    Generate a simulated temperature reading.
    
    :return: Simulated temperature as a float
    """
    return round(random.uniform(15.0, 30.0), 2)

def generate_humidity() -> float:
    """
    Generate a simulated humidity reading.
    
    :return: Simulated humidity as a float
    """
    return round(random.uniform(30.0, 70.0), 2)

def generate_relay_status() -> str:
    """
    Generate a simulated relay status.
    
    :return: Simulated relay status as a string
    """
    return "ON" if random.choice([True, False]) else "OFF"

# Define MQTT parameters and sensor configurations
mqtt_params = MqttParameters(
    broker="mqtt.example.com",
    port=1883,
    update_interval=60
)

sensors: Dict[str, SensorConfig] = {
    'Temperature': {
        'topic': 'sensors/temperature',
        'generate_data': generate_temperature
    },
    'Humidity': {
        'topic': 'sensors/humidity',
        'generate_data': generate_humidity
    },
    'Relay': {
        'topic': 'sensors/relay',
        'generate_data': generate_relay_status
    }
}

if __name__ == "__main__":
    sensor_manager = SensorManager(mqtt_params, sensors)
    sensor_manager.start()
