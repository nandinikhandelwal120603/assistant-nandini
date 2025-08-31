// TODO: Add OPENWEATHER_API_KEY as Netlify env var
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface WeatherForecast {
  current: WeatherData;
  hourly: HourlyWeather[];
}

class WeatherService {
  private apiKey: string;

  constructor() {
    this.apiKey = OPENWEATHER_API_KEY;
  }

  async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData> {
    // TODO: Remove mock when API key is added
    if (!this.apiKey) {
      return this.getMockCurrentWeather();
    }

    try {
      // Get user location if not provided
      if (!lat || !lon) {
        const position = await this.getUserLocation();
        lat = position.lat;
        lon = position.lon;
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        location: data.name
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.getMockCurrentWeather();
    }
  }

  async getHourlyForecast(lat?: number, lon?: number): Promise<HourlyWeather[]> {
    // TODO: Remove mock when API key is added  
    if (!this.apiKey) {
      return this.getMockHourlyWeather();
    }

    try {
      if (!lat || !lon) {
        const position = await this.getUserLocation();
        lat = position.lat;
        lon = position.lon;
      }

      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather forecast API request failed');
      }

      const data = await response.json();

      return data.list.slice(0, 8).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric',
          hour12: true 
        }),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: Math.round((item.pop || 0) * 100)
      }));
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
      return this.getMockHourlyWeather();
    }
  }

  async getWeatherForecast(lat?: number, lon?: number): Promise<WeatherForecast> {
    const [current, hourly] = await Promise.all([
      this.getCurrentWeather(lat, lon),
      this.getHourlyForecast(lat, lon)
    ]);

    return { current, hourly };
  }

  private async getUserLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to a sample location (San Francisco)
          resolve({ lat: 37.7749, lon: -122.4194 });
        },
        { timeout: 10000 }
      );
    });
  }

  private getMockCurrentWeather(): WeatherData {
    return {
      temperature: 22,
      description: 'partly cloudy',
      icon: '02d',
      humidity: 65,
      windSpeed: 3.2,
      feelsLike: 24,
      location: 'Your City'
    };
  }

  private getMockHourlyWeather(): HourlyWeather[] {
    const hours = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
    const temps = [22, 24, 26, 25, 23, 21, 19, 18];
    const descriptions = ['sunny', 'partly cloudy', 'cloudy', 'partly cloudy', 'sunny', 'clear', 'clear', 'clear'];

    return hours.map((time, index) => ({
      time,
      temperature: temps[index],
      description: descriptions[index],
      icon: '01d',
      precipitation: Math.floor(Math.random() * 30)
    }));
  }
}

export const weatherService = new WeatherService();