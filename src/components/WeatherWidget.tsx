"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "./SettingsProvider";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";

interface WeatherData {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
}

const MOCK_WEATHER: WeatherData = {
    temperature: 28,
    weatherCode: 1,
    windSpeed: 12
};

const WeatherWidget = () => {
    const { isHuman } = useSettings();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [location, setLocation] = useState<string>("กำลังระบุตำแหน่ง...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // 1. Fetch Location by IP
                const locRes = await fetch("https://ipapi.co/json/");
                const locData = await locRes.json();

                const lat = locData.latitude || 14.97;
                const lon = locData.longitude || 102.10;
                const city = locData.city || "Unknown";
                setLocation(city);

                // 2. Fetch Weather using detected coordinates
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
                );

                if (!weatherRes.ok) throw new Error("Weather API response was not ok");

                const weatherData = await weatherRes.json();
                setWeather({
                    temperature: weatherData.current_weather.temperature,
                    weatherCode: weatherData.current_weather.weathercode,
                    windSpeed: weatherData.current_weather.windspeed,
                });
            } catch (error) {
                console.warn("Location or Weather API failed, using fallbacks:", error);
                setLocation("Nakhon Ratchasima");
                setWeather(MOCK_WEATHER);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        // Refresh every 30 mins
        const interval = setInterval(fetchAll, 1800000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code <= 1) return <Sun size={isHuman ? 20 : 16} />;
        if (code <= 3) return <Cloud size={isHuman ? 20 : 16} />;
        if (code <= 69) return <CloudRain size={isHuman ? 20 : 16} />;
        return <Wind size={isHuman ? 20 : 16} />;
    };

    if (loading) return null;

    const displayWeather = weather || MOCK_WEATHER;

    return (
        <div className={`fixed top-24 right-4 md:top-24 md:right-10 z-[40] transition-all ${isHuman
            ? "bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 rounded-full px-4 py-2 flex items-center gap-3 text-slate-700"
            : "bg-[#0a0a0a]/60 border border-[#10b981] px-2 py-1 text-[#10b981] font-mono text-xs flex flex-col items-end gap-1"
            }`}>
            {isHuman ? (
                <>
                    <div className="flex items-center gap-2">
                        {getWeatherIcon(displayWeather.weatherCode)}
                        <span className="font-bold text-sm">{displayWeather.temperature}°C</span>
                    </div>
                    <span className="text-xs text-slate-500 border-l pl-3 border-slate-300">
                        {location}
                    </span>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <span>[ เซ็นเซอร์::{location.toUpperCase()} ]</span>
                        {getWeatherIcon(displayWeather.weatherCode)}
                    </div>
                    <div className="flex gap-4">
                        <span>อุณหภูมิ: {displayWeather.temperature}°C</span>
                        <span>แรงลม: {displayWeather.windSpeed} กม./ชม.</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeatherWidget;
