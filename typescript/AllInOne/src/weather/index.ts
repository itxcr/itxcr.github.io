import colors from 'colors'
import axios, {AxiosResponse} from "axios";
import * as process from "process";

const program = require('commander')

interface WeatherResponse {
    status: string
    count: string
    info: string
    infocode: string
    lives: Live[]
}

interface Live {
    province: string
    city: string
    adcode: string
    weather: string
    temperature: string
    winddirection: string
    windpower: string
    humidity: string
    reporttime: string
    temperature_float: string
    humidity_float: string
}

const URL = `https://restapi.amap.com/v3/weather/weatherInfo`
const KEY = `高德key`

async function getWeather(city: string) {
    try {
        const url = `${URL}?city=${encodeURI(city)}&key=${KEY}`
        const response: AxiosResponse<WeatherResponse> = await axios.get(url)
        const live = response.data.lives[0]
        console.log(colors.yellow(live.reporttime))
        console.log(colors.white(`${live.province} ${live.city}`))
        console.log(colors.green(`${live.weather} ${live.temperature} 度`))
    } catch (e) {
        console.log(colors.red('天气服务出现异常'))
    }
}

program
    .version('0.0.1')
    .option('-c, --city [cityName]', 'Add city name')
    .action((argv: any) => {
        const {city} = argv
        getWeather(city)
    })
    .parse(program.argv)

// const options = program.opts()
// getWeather(options.city)
if (process.argv.slice(2).length === 0) {
    program.outputHelp(colors.red)
    process.exit()
}





