import paho.mqtt.client as mqtt
import random
import time
from typing import TypedDict, Callable, List

# Define a dictionary type for MQTT parameters
class MqttParameters(TypedDict):
    broker: str
    port: int
    topic: str
    update_interval: int

class TemperatureSensor:
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

    def generate_temperature(self) -> float:
        return round(random.uniform(15.0, 30.0), 2)

    def publish_temperature(self) -> None:
        temperature = self.generate_temperature()
        payload = f"Temperature: {temperature}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class HumidityAirSensor:
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

    def generate_humidity_air(self) -> float:
        return round(random.uniform(60.0, 80.0), 2)

    def publish_humidity_air(self) -> None:
        humidity = self.generate_humidity_air()
        payload = f"Humidity Air: {humidity}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class HumiditySoilSensor:

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

    def generate_humidity_soil(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)
    
    def publish_humidity_soil(self) -> None:
        humidity = self.generate_humidity_soil()
        payload = f"Humidity Soil: {humidity}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")

class LightSensor:

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

    def generate_light(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)


    def publish_light(self) -> None:
        light = self.generate_light()
        payload = f"Light PPD: {light}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")


class MotionSensor:

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

    def generate_motion(self) -> float:
        return round(random.uniform(40.0, 60.0), 2)


    def publish_motion(self) -> None:
        motion = self.generate_motion()
        payload = f"Motion: {motion}"
        self.client.publish(self.parameters['topic'], payload)
        print(f"Published: {payload}")  

class ModuloRele:
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

    def generate_modulo_rele(self) -> bool:
        return random.choice([True, False])

    def publish_modulo_rele(self) -> None:
        modulo_rele = self.generate_modulo_rele()
        payload = f"Modulo Rele: {modulo_rele}"
        self.client.publish(self.parameters['topic'], payload)

class SensorManager:
    def __init__(self) -> None:
        self.sensors: List[TemperatureSensor, HumiditySoilSensor, HumidityAirSensor, LightSensor, MotionSensor] = []

    def add_sensor(self, parameters: MqttParameters) -> None:
        if parameters['sensor_type'] == 'temperature':
            sensor = TemperatureSensor(parameters)
            self.sensors.append(sensor)
        elif parameters['sensor_type'] == 'humidity_soil':
            sensor = HumiditySoilSensor(parameters)
            self.sensors.append(sensor)
        elif parameters['sensor_type'] == 'humidity_air':
            sensor = HumidityAirSensor(parameters)
            self.sensors.append(sensor)
        elif parameters['sensor_type'] == 'light':
            sensor = LightSensor(parameters)
            self.sensors.append(sensor)
        elif parameters['sensor_type'] == 'motion':
            sensor = MotionSensor(parameters)
            self.sensors.append(sensor)
        elif parameters['sensor_type'] == 'modulo_rele':
            sensor = ModuloRele(parameters)
            self.sensors.append(sensor)
        else:
            raise ValueError(f"Invalid sensor type: {parameters['sensor_type']}")
        #self.sensors.append(sensor)

    def start(self) -> None:
        while True:
            for sensor in self.sensors:
                sensor.publish_light()
                sensor.publish_motion()
                sensor.publish_humidity_air()
                sensor.publish_humidity_soil()
                sensor.publish_modulo_rele()
                sensor.publish_temperature()
            time.sleep(min(sensor.parameters['update_interval'] for sensor in self.sensors))
