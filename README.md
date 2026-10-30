# WeatherAI — Live Weather Website

A small Flask website that displays live weather conditions and a five-day forecast using the free Open-Meteo API. The lower machine-learning rainfall prediction panel has been removed. The current-weather precipitation reading and forecast rain probability remain part of the live weather data.

## Requirements
- Python 3.10 or newer
- Internet connection (for live weather data)

## Run on Windows
1. Extract this ZIP file.
2. Open the extracted `weather_ai_website` folder.
3. Open Command Prompt or PowerShell in that folder.
4. Install the dependency:
   ```powershell
   python -m pip install -r requirements.txt
   ```
5. Start the website:
   ```powershell
   python app.py
   ```
6. Open `http://127.0.0.1:5000` in your browser.

If `python` does not work, try `py -m pip install -r requirements.txt` and `py app.py`.

## Features
- Search for a city
- Current temperature and feels-like temperature
- Humidity, wind speed, pressure, and current precipitation
- Five-day forecast with weather icons, high/low temperatures, and precipitation probability
- Responsive layout for desktop and mobile

## Data source
Open-Meteo geocoding and forecast APIs: https://open-meteo.com/
