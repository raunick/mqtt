import paho.mqtt.client as mqtt
import sqlite3
import datetime

# Conectar ao banco de dados SQLite (ou criar se não existir)
conn = sqlite3.connect('mqtt_messages.db')
cursor = conn.cursor()

# Verificar se a tabela 'messages' já existe
cursor.execute('''
SELECT name FROM sqlite_master WHERE type='table' AND name='messages';
''')
table_exists = cursor.fetchone()

# Criar a tabela 'messages' se ela não existir
if not table_exists:
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        status boolean,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        topic TEXT,
        sensor_type TEXT,
        sensor_value TEXT,
        qos INTEGER,
        retain INTEGER
    )
    ''')
    conn.commit()
    print("Tabela 'messages' criada.")
else:
    print("Tabela 'messages' já existe.")

# Função chamada quando o cliente MQTT se conecta ao broker
def on_connect(client, userdata, flags, rc):
    print(f"Conectado com o código de resultado {rc}")
    client.subscribe("sensors/#")

# Função chamada quando uma mensagem é recebida
def on_message(client, userdata, msg):
    # Decodifica a mensagem e separa o tipo de leitura e o valor
    payload = msg.payload.decode()
    sensor_type, sensor_value = payload.split(": ")

    # Insere as informações no banco de dados, armazenando o tipo de sensor e o valor em colunas separadas
    cursor.execute('INSERT INTO messages (nome, status, topic, sensor_type, sensor_value, qos, retain) VALUES (?,?,?,?,?,?,?)', 
                   (f'Sys/{msg.topic}', True, msg.topic, sensor_type, sensor_value, msg.qos, msg.retain)
                   )
    conn.commit()
    
    # Exibe a mensagem recebida no console
    print(f"Mensagem recebida no tópico {msg.topic} {sensor_type}: {sensor_value}")
# Configurar o cliente MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Conectar ao broker MQTT
client.connect("broker.mqtt.cool", 1883, 60)

# Iniciar loop para escutar mensagens
client.loop_forever()
