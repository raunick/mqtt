import paho.mqtt.client as mqtt
import time
from typing import Dict, Callable, Any, TypedDict

# Define a dictionary type for MQTT parameters
class MqttParameters(TypedDict):
    broker: str
    port: int
    update_interval: int

# Define a dictionary type for sensor configurations
class SensorConfig(TypedDict):
    topic: str
    generate_data: Callable[[], Any]

# Define a class for managing multiple sensors
class SensorManager:
    def __init__(self, mqtt_params: MqttParameters, sensors: Dict[str, SensorConfig]) -> None:
        """
        Initialize the SensorManager with MQTT parameters and sensor configurations.

        :param mqtt_params: A dictionary with MQTT parameters
        :param sensors: A dictionary where keys are sensor names and values are sensor configurations
        """
        self.mqtt_params = mqtt_params
        self.sensors = sensors
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        self.connect_to_mqtt()

    def connect_to_mqtt(self) -> None:
        """
        Connect to the MQTT broker using the provided parameters.
        """
        self.client.connect(self.mqtt_params['broker'], self.mqtt_params['port'])
        self.client.loop_start()

    def on_connect(self, client: mqtt.Client, userdata: None, flags: dict, rc: int) -> None:
        """
        Callback function for when the client connects to the MQTT broker.

        :param client: The MQTT client instance
        :param userdata: User data of any type
        :param flags: Response flags from the broker
        :param rc: Connection result
        """
        print(f"Connected with result code {rc}")

    def on_publish(self, client: mqtt.Client, userdata: None, mid: int) -> None:
        """
        Callback function for when a message is published.

        :param client: The MQTT client instance
        :param userdata: User data of any type
        :param mid: Message ID of the published message
        """
        print(f"Message {mid} published.")

    def publish_sensor_data(self) -> None:
        """
        Publish data from all sensors to their respective MQTT topics.
        """
        for sensor_name, config in self.sensors.items():
            data = config['generate_data']()
            payload = f"{sensor_name}: {data}"
            self.client.publish(config['topic'], payload)
            print(f"Published: {payload}")

    def start(self) -> None:
        """
        Start the sensor manager and begin publishing data at the specified interval.
        """
        while True:
            self.publish_sensor_data()
            time.sleep(self.mqtt_params['update_interval'])
