import streamlit as st
import requests
import pandas as pd

# Função para buscar dados da API
def fetch_sensor_data():
    url = "http://127.0.0.1:8000/sensors"
    response = requests.get(url)
    response.raise_for_status()  # Verifica se a requisição foi bem-sucedida
    return response.json()

# Função principal para criar o dashboard
def main():
    st.title("Sensor Dashboard")

    st.write("Buscando dados dos sensores...")

    try:
        # Buscar os dados dos sensores
        data = fetch_sensor_data()

        # Criar um DataFrame a partir dos dados JSON
        df = pd.DataFrame(data)

        # Exibir a tabela
        st.write("Dados dos Sensores")
        st.dataframe(df)
    
    except requests.exceptions.RequestException as e:
        st.error(f"Erro ao buscar dados: {e}")

if __name__ == "__main__":
    main()
