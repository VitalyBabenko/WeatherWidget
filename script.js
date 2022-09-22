const [button] = document.getElementsByTagName('button');
const [input] = document.getElementsByTagName('input');
const title = document.querySelector(".weather__title");
const out = document.querySelector('.weather');
const appid = '80c3c4b682bed8b4f996e213fbd607e9';

const getWeatherData = async (city) => {
  let link = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appid}`
  try {
    return await fetch(link).then(resp => resp.json())
  } catch(error) {
    console.error(error);
  }
}

const getWeekDay = (unixTime) => {
  const a = new Date(unixTime * 1000)
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekDays[a.getDay()]
}

const getMiddleDayWeather = ( data, middleDayTime = '15:00:00' ) => {
  let allDays = data.list
  return allDays.filter(day => day.dt_txt.slice(-8) === middleDayTime)
}

function createWeatherItem(data) {
  const description = data.weather[0].description
  const celsius = Math.floor(data.main.temp - 273)
  const minTemp = Math.floor(data.main.temp_min - 273)
  const maxTemp = Math.floor(data.main.temp_max - 273)

  const getIcon = () => {
    let iconId = data.weather[0].icon
    iconId = iconId.substring(0, iconId.length - 1);
   return iconId
  }

  return `
    <div class="weather__item">
      <img src="./img/${getIcon()}.svg" alt="weather-icon" />
      <hr />
      <div class="weather__info">
        <span class="weather__day">${getWeekDay(data.dt)}</span>
        <span class="weather__celsius">${celsius}&deg;C</span>
        <span class="weather__desc">${description}</span>
      </div>
      <div class="weather__minmax">
        <span class="min">min:${minTemp}&deg;C</span>
        <span class="max">max:${maxTemp}&deg;C</span>
      </div>
    </div>`
};

const app = async (city) => {
  const data = await getWeatherData(city);
  title.innerHTML = data.city.name;
  let middleDaysData = getMiddleDayWeather(data);
  out.innerHTML = middleDaysData.map(dayData => createWeatherItem(dayData)).join('')
}

button.addEventListener('click', () => {
  app(input.value)
})

app('Kyiv')