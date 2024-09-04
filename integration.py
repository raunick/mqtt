import asyncio
from fastapi import FastAPI, HTTPException,WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sqlite3

app = FastAPI()
def calculate_percentage_change(sensor_data):
    if len(sensor_data) < 2:
        raise ValueError("Não há dados suficientes para calcular a diferença")

    current_value = float(sensor_data[-1]['value'])
    previous_value = float(sensor_data[-2]['value'])
    
    if previous_value == 0:
        raise ValueError("O valor anterior não pode ser zero para calcular a porcentagem de alteração")
    
    percentage_change = ((current_value - previous_value) / previous_value) * 100
    diference = previous_value - current_value
    
    return current_value,previous_value, percentage_change,diference

# Enabling CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow only your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

def get_db_connection():
    conn = sqlite3.connect('mqtt_messages.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/sensors")
def get_sensors():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT nome, sensor_type, status, sensor_value FROM messages ORDER BY timestamp DESC LIMIT 6")
    rows = cursor.fetchall()
    conn.close()
    sensors = [{"name": row["nome"], "type": row["sensor_type"], "status": "Online" if row["status"] else "Offline", "value": row["sensor_value"]} for row in rows]
    return JSONResponse(content=sensors)

@app.get('/sensors/{sensor_type}')
def get_sensor_by_type(sensor_type: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT nome,timestamp ,sensor_type, status, sensor_value FROM messages WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 10", (sensor_type,))
    rows = cursor.fetchall()
    conn.close()
    sensors = [{"name": row["nome"],    "timestamp": row["timestamp"] , "type": row["sensor_type"], "status": "Online" if row["status"] else "Offline", "value": row["sensor_value"]} for row in rows]
    return JSONResponse(content=sensors)

@app.get('/sensor/{sensor_type}')
def get_sensor_data(sensor_type: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, sensor_type, sensor_value FROM messages WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 2", 
        (sensor_type,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    if len(rows) < 2:
        raise HTTPException(status_code=404, detail="Dados insuficientes para o tipo de sensor fornecido")
    
    sensors = [{"id": row["id"], "type": row["sensor_type"], "value": row["sensor_value"]} for row in rows]
    
    
    try:
        current_value = float(sensors[0]["value"])
        previous_value = float(sensors[1]["value"])
        diference = current_value - previous_value
        percentage_change = (diference / previous_value) * 100 if previous_value != 0 else 0
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
        
    return JSONResponse(content={
        "current_id": sensors[0]["id"],
        "previous_id": sensors[1]["id"],
        "current_value": current_value,
        "previous_value": previous_value,
        "diference": diference,
        "percentage_change": percentage_change,
    })

@app.get('/sensor/modulos/rele')
def get_sensor_data():
    sensor_type = 'Modulo Rele'
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, sensor_type, sensor_value, timestamp FROM messages WHERE sensor_type = ? ORDER BY timestamp DESC LIMIT 2", 
        (sensor_type,)
    )
    rows = cursor.fetchall()
    conn.close()
    
    if len(rows) < 2:
        raise HTTPException(status_code=404, detail="Dados insuficientes para o tipo de sensor fornecido")
    
    sensors = [{"id": row["id"], "type": row["sensor_type"], "value": row["sensor_value"], "timestamp": row["timestamp"]    } for row in rows]
    
    
    try:
        current_value = sensors[0]["value"]
        previous_value = sensors[1]["value"]
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
        
    return JSONResponse(content={
        "current_id": sensors[0]["id"],
        "previous_id": sensors[1]["id"],
        "current_value": current_value,
        "previous_value": previous_value,
        "timestamp": sensors[0]["timestamp"],
        "diference": '-',
        "percentage_change": '-',
    })

import math

def calculate_vpd(temperature, relative_humidity):
    # Cálculo simplificado do VPD
    saturation_vapor_pressure = 0.611 * math.exp(17.27 * temperature / (temperature + 237.3))
    actual_vapor_pressure = saturation_vapor_pressure * (relative_humidity / 100)
    vpd = saturation_vapor_pressure - actual_vapor_pressure
    return round(vpd, 2)

@app.get('/sensor/VPD_{stage}')
def get_vpd_data(stage: str):
    if stage not in ['vega', 'flora']:
        raise HTTPException(status_code=400, detail="Stage deve ser 'vega' ou 'flora'")

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Obter os últimos dados de temperatura e umidade
    cursor.execute(
        "SELECT sensor_type, sensor_value FROM messages WHERE sensor_type IN ('Temperature Air', 'Humidity Air') ORDER BY timestamp DESC LIMIT 2"
    )
    rows = cursor.fetchall()
    conn.close()

    if len(rows) < 2:
        raise HTTPException(status_code=404, detail="Dados insuficientes para calcular o VPD")

    # Extrair temperatura e umidade
    temp_data = next((row for row in rows if row['sensor_type'] == 'Temperature Air'), None)
    humidity_data = next((row for row in rows if row['sensor_type'] == 'Humidity Air'), None)

    if not temp_data or not humidity_data:
        raise HTTPException(status_code=404, detail="Dados de temperatura ou umidade não encontrados")

    temperature = float(temp_data['sensor_value'])
    humidity = float(humidity_data['sensor_value'])

    # Calcular VPD atual
    current_vpd = calculate_vpd(temperature, humidity)

    # Obter VPD anterior (simplificado - usando os mesmos dados)
    previous_vpd = current_vpd * 0.95  # Simulando um valor anterior

    # Calcular diferença e mudança percentual
    difference = current_vpd - previous_vpd
    percentage_change = (difference / previous_vpd) * 100 if previous_vpd != 0 else 0

    return JSONResponse(content={
        "current_value": current_vpd,
        "previous_value": previous_vpd,
        "difference": round(difference, 2),
        "percentage_change": round(percentage_change, 2),
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)