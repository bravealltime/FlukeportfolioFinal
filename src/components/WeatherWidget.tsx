"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react";

interface WeatherData {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
}

const WeatherWidget = () => {
    const { isHuman } = useSettings();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    // KORAT Coordinates: 14.97, 102.10
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=14.97&longitude=102.10&current_weather=true"
                );
                const data = await res.json();
                setWeather({
                    temperature: data.current_weather.temperature,
                    weatherCode: data.current_weather.weathercode,
                    windSpeed: data.current_weather.windspeed,
                });
            } catch (error) {
                console.error("Failed to fetch weather", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh every 30 mins
        const interval = setInterval(fetchWeather, 1800000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code <= 1) return <Sun size={isHuman ? 20 : 16} />;
        if (code <= 3) return <Cloud size={isHuman ? 20 : 16} />;
        if (code <= 69) return <CloudRain size={isHuman ? 20 : 16} />;
        return <Wind size={isHuman ? 20 : 16} />;
    };

    if (loading) return null;

    return (
        <div className={`fixed top-4 right-4 z-40 transition-all ${isHuman
                ? "bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 rounded-full px-4 py-2 flex items-center gap-3 text-slate-700"
                : "bg-black/60 border border-[#00ff41] px-2 py-1 text-[#00ff41] font-mono text-xs flex flex-col items-end gap-1"
            }`}>
            {isHuman ? (
                <>
                    <div className="flex items-center gap-2">
                        {getWeatherIcon(weather?.weatherCode || 0)}
                        <span className="font-bold text-sm">{weather?.temperature}°C</span>
                    </div>
                    <span className="text-xs text-slate-500 border-l pl-3 border-slate-300">
                        Nakhon Ratchasima
                    </span>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <span>[ SENSOR::KORAT ]</span>
                        {getWeatherIcon(weather?.weatherCode || 0)}
                    </div>
                    <div className="flex gap-4">
                        <span>TEMP: {weather?.temperature}°C</span>
                        <span>WIND: {weather?.windSpeed}km/h</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeatherWidget;
