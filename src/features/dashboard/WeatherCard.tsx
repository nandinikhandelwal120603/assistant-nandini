import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '../../services/weather';

interface WeatherCardProps {
  weather: WeatherData | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  if (!weather) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="w-5 h-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-gradient-glass rounded-lg" />
            <div className="h-12 bg-gradient-glass rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeather icon codes mapping
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '☀️';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-warning" />
          Weather in {weather.location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Temperature */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl">
                {getWeatherIcon(weather.icon)}
              </span>
              <div className="text-right">
                <div className="text-4xl font-bold text-foreground">
                  {weather.temperature}°
                </div>
                <div className="text-lg text-muted-foreground capitalize">
                  {weather.description}
                </div>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-gradient-glass">
              <Thermometer className="w-5 h-5 mx-auto mb-2 text-therapy-warm" />
              <div className="text-sm font-medium">{weather.feelsLike}°</div>
              <div className="text-xs text-muted-foreground">Feels like</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-gradient-glass">
              <Droplets className="w-5 h-5 mx-auto mb-2 text-therapy-calm" />
              <div className="text-sm font-medium">{weather.humidity}%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-gradient-glass">
              <Wind className="w-5 h-5 mx-auto mb-2 text-therapy-sage" />
              <div className="text-sm font-medium">{weather.windSpeed} m/s</div>
              <div className="text-xs text-muted-foreground">Wind</div>
            </div>
          </div>

          {/* Weather advice */}
          <div className="text-center p-3 rounded-lg bg-gradient-therapy">
            <p className="text-sm text-foreground">
              {weather.temperature < 10 && "Bundle up! It's chilly out there. ❄️"}
              {weather.temperature >= 10 && weather.temperature < 20 && "Perfect weather for a light jacket! 🧥"}
              {weather.temperature >= 20 && weather.temperature < 25 && "Beautiful day ahead! 🌤️"}
              {weather.temperature >= 25 && "Stay hydrated and enjoy the sunshine! ☀️"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;