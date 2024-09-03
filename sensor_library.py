import paho.mqtt.client as mqtt
import random
import time
from typing import TypedDict, List, Dict, Type

# Define a dictionary type for MQTT parameters
class MqttParameters(TypedDict):
    broker: str
    port: int
    topic: str
    update_interval: int
    sensor_type: str

class SensorBase:
    def __init__(self, parameters: MqttParameters) -> None:
        self.parameters = parameters
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        self.connect_to_mqtt()

    def connect_to_mqtt(self) -> None:
        self.client.connect(self.parameters['broker'], self.parameters['port'])
        self.client.loop_start()

    def on_connect(self, client: mqtt.Client, userdata: None, flags: dict, rc: int) -> None:
        print(f"Connected with result code {rc}")

    def on_publish(self, client: mqtt.Client, userdata: None, mid: int) -> None:
        print(f"Message {mid} published.")

    def publish(self) -> None:
        raise NotImplementedError("Subclasses should implement this method.")

class TemperatureSensor(SensorBase):
    def generate_temperature(self) -> float:
        return round(random.uniform(15.0, 30.0), 2)

    def publish(self) -> None:
        temperature = self.generate_temperature()
        payload = f"Temperature: {temperature}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class HumidityAirSensor(SensorBase):
    def generate_humidity_air(self) -> float:
        return round(random.uniform(60.0, 80.0), 2)

    def publish(self) -> None:
        humidity = self.generate_humidity_air()
        payload = f"Humidity Air: {humidity}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class HumiditySoilSensor(SensorBase):
    def generate_humidity_soil(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)

    def publish(self) -> None:
        humidity = self.generate_humidity_soil()
        payload = f"Humidity Soil: {humidity}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class LightSensor(SensorBase):
    def generate_light(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)

    def publish(self) -> None:
        light = self.generate_light()
        payload = f"Light PPD: {light}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class MotionSensor(SensorBase):
    def generate_motion(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)

    def publish(self) -> None:
        motion = self.generate_motion()
        payload = f"Motion: {motion}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class ModuloRele(SensorBase):
    def generate_modulo_rele(self) -> bool:
        return random.choice([True, False])

    def publish(self) -> None:
        modulo_rele = self.generate_modulo_rele()
        payload = f"Modulo Rele: {modulo_rele}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class SensorManager:
    def __init__(self) -> None:
        self.sensors: List[SensorBase] = []

    def add_sensor(self, parameters: MqttParameters) -> None:
        sensor_type = parameters['sensor_type']
        sensor_classes: Dict[str, Type[SensorBase]] = {
            'temperature': TemperatureSensor,
            'humidity_air': HumidityAirSensor,
            'humidity_soil': HumiditySoilSensor,
            'light': LightSensor,
            'motion': MotionSensor,
            'modulo_rele': ModuloRele,
        }
        if sensor_type not in sensor_classes:
            raise ValueError(f"Invalid sensor type: {sensor_type}")
        sensor_class = sensor_classes[sensor_type]
        sensor = sensor_class(parameters)
        self.sensors.append(sensor)

    def start(self) -> None:
        while True:
            for sensor in self.sensors:
                sensor.publish()
            time.sleep(min(sensor.parameters['update_interval'] for sensor in self.sensors))