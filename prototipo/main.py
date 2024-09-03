import asyncio
import websockets
import json
import paho.mqtt.client as mqtt

# Dados do Broker MQTT
broker = "broker.mqtt.cool"
porta = 1883
topic = 'sensors'
sensores = ['temperature', 'humidity_air', 'humidity_soil', 'light', 'motion', 'modulo_rele']

# Lista para armazenar as últimas leituras dos sensores
sensor_data = {sensor: None for sensor in sensores}

# Função chamada quando uma mensagem MQTT é recebida
def on_message(client, userdata, msg):
    global sensor_data
    try:
        # Decodifica a mensagem recebida
        payload = msg.payload.decode()
        data = json.loads(payload)

        # Atualiza o dado correspondente ao sensor
        sensor_name = data.get("sensor")
        if sensor_name in sensor_data:
            sensor_data[sensor_name] = data["value"]

        print(f"Received data: {data}")

    except Exception as e:
        print(f"Error processing message: {e}")

# Configuração do cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message

mqtt_client.connect(broker, porta)
mqtt_client.subscribe(topic)

mqtt_client.loop_start()

# Servidor WebSocket
async def websocket_handler(websocket, path):
    print("Client connected")
    try:
        while True:
            # Envia as últimas leituras dos sensores para o cliente conectado
            await websocket.send(json.dumps(sensor_data))
            await asyncio.sleep(1)  # Intervalo de 1 segundo para atualização

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client disconnected: {e}")

# Inicializa o servidor WebSocket na porta 8765
start_server = websockets.serve(websocket_handler, "localhost", 8765)

# Loop de eventos assíncrono
asyncio.get_event_loop().run_until_complete(start_server)
print("WebSocket server is running on ws://localhost:8765")
asyncio.get_event_loop().run_forever()
