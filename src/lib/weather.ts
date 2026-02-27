/**
 * Utility functions for bridging Geolocation and the Open-Meteo free API.
 */

// WMO Weather interpretation codes (https://open-meteo.com/en/docs)
export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'unknown';

export function parseWMOCode(code: number): WeatherCondition {
    // 0: Clear sky
    if (code === 0) return 'clear';

    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if ([1, 2, 3].includes(code)) return 'cloudy';

    // 45, 48: Fog and depositing rime fog (treated as cloudy for vibe purposes)
    if ([45, 48].includes(code)) return 'cloudy';

    // 51-67, 80-82: Drizzle and Rain
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';

    // 71-77, 85, 86: Snow fall, Snow grains, Snow showers
    if ((code >= 71 && code <= 77) || [85, 86].includes(code)) return 'snow';

    // 95, 96, 99: Thunderstorm
    if ([95, 96, 99].includes(code)) return 'thunderstorm';

    return 'unknown';
}

export async function fetchLocalWeather(lat: number, lon: number): Promise<{ condition: WeatherCondition, tempC: number }> {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
        const res = await fetch(url);

        if (!res.ok) throw new Error('API Error');

        const data = await res.json();
        const code = data.current.weather_code;
        const temp = data.current.temperature_2m;

        return {
            condition: parseWMOCode(code),
            tempC: temp
        };
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return { condition: 'unknown', tempC: 20 }; // Fallback
    }
}
