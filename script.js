
// DARK MODE SWITCH
const root = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");
const thumb = toggleBtn.querySelector(".thumb");

// load saved theme
if (localStorage.getItem("theme") === "dark") {
    root.classList.add("dark-mode");
    toggleDark();
}

toggleBtn.addEventListener("click", () => {
    root.classList.toggle("dark-mode");

    if (root.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleDark();
    } else {
        localStorage.setItem("theme", "light");
        toggleLight();
    }
});

function toggleDark() {
    thumb.textContent = "⏾";
    document.getElementById("github").src = "https://cdn.simpleicons.org/github/ffffff";
    document.getElementById("lofi_cafe").src = "https://cdn.simpleicons.org/soundcharts/f7f5ef";
    const gLogo = document.querySelector(".google-logo");
    if (gLogo) {
        gLogo.src = "https://cdn.simpleicons.org/google/f3d8b6";
    }
    const rainImgs = document.getElementsByClassName('forecast-rain-icon')
    for (const img of rainImgs) {
        img.src = "https://cdn.simpleicons.org/rainmeter/b89b79";
    }
}

function toggleLight() {
    thumb.textContent = "𖤓";
    document.getElementById("github").src = "https://cdn.simpleicons.org/github";
    document.getElementById("lofi_cafe").src = "https://cdn.simpleicons.org/soundcharts";
    const gLogo = document.querySelector(".google-logo");
    if (gLogo) {
        gLogo.src = "https://cdn.simpleicons.org/google/202124";
    }
    const rainImgs = document.getElementsByClassName('forecast-rain-icon')
    for (const img of rainImgs) {
        img.src = "https://cdn.simpleicons.org/rainmeter/746c63";
    }
}


// TIME AND DATE
function updateClock() {
    const now = new Date();
    document.getElementById("clock").textContent = now.toLocaleTimeString(
        [], {hour: "2-digit", minute: "2-digit"}
    );
    document.getElementById("date").textContent = now.toLocaleDateString(
        "en-US", {weekday: "long", month: "long", day: "numeric"}
    );
}

updateClock();
setInterval(updateClock, 1000);


// WEATHER
const weatherDescriptions = {
    0: "Clear",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Fog",
    61: "Rain",
    71: "Snow"
};

async function getWeather() {
    const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=59.437&longitude=24.7536&current=temperature_2m,weather_code,precipitation,wind_speed_10m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Europe%2FTallinn";
    const response = await fetch(weatherUrl);
    const weatherData = await response.json();

    // Weather header
    const currentTemp = weatherData.current.temperature_2m;
    document.getElementById("weather-temp").textContent = currentTemp + "°";

    const weatherCode = weatherData.current.weather_code;
    if (weatherJSON[weatherCode]) {
        const currentWeather = weatherJSON[weatherCode]["day"]
        const currentDescription = currentWeather["description"] ?? "Unknown ..";
        document.getElementById("weather-description").textContent = currentDescription;
        const currentImg = currentWeather["image"]
        document.getElementById("weather-icon-img").src = currentImg;
    }

    // Current detials

    const currentFeels = weatherData.current.apparent_temperature;
    document.getElementById("weather-feels").textContent = currentFeels + "°";
    const currentWind = weatherData.current.wind_speed_10m;
    document.getElementById("weather-wind").textContent = currentWind + " km/h";
    const currentRain = weatherData.current.precipitation;
    document.getElementById("weather-rain").textContent = currentRain + " mm";
    const currentHumid = weatherData.current.relative_humidity_2m;
    document.getElementById("weather-humid").textContent = currentHumid + "%";
    const todayMin = weatherData.daily.temperature_2m_min[0];
    document.getElementById("weather-min").textContent = todayMin + "°";
    const todayMax = weatherData.daily.temperature_2m_max[0];
    document.getElementById("weather-max").textContent = todayMax + "°";

    // Forecast
    dailyWthrCode = weatherData.daily.weather_code;
    dailyPercip = weatherData.daily.precipitation_sum;
    dailyTempMin = weatherData.daily.temperature_2m_min;
    dailyTempMax = weatherData.daily.temperature_2m_max;
    dailyDate = weatherData.daily.time;

    for (let i = 1; i <= 3; i++) {
        var forecast = document.getElementById(`forecast-${i}`);
        
        var date = forecast.querySelector(".forecast-date")
        var forecastDate = new Date(dailyDate[i]);
        date.textContent = forecastDate.toLocaleDateString(
            "en-US", {weekday: "long"}
        );
        var rain = forecast.querySelector(".forecast-rain");
        rain.textContent = dailyPercip[i] + " mm"
        var tempMin = forecast.querySelector(".forecast-min");
        tempMin.textContent = dailyTempMin[i] + "°"
        var tempMax = forecast.querySelector(".forecast-max");
        tempMax.textContent = dailyTempMax[i] + "°"

        if (weatherJSON[dailyWthrCode[i]]) {
            var icon = forecast.querySelector(".forecast-icon-img");
            icon.src = weatherJSON[dailyWthrCode[i]]["day"]["image"];
        }
            
    }
    
    const updateTime = weatherData.current.time.split("T")[1];
    document.getElementById("last-updated").textContent = "- As of " + updateTime + " -";
}

getWeather();
setInterval(getWeather, 900000);  // 15-min interval


// SEARCH BUTTON
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");

function updateSearchButton() {
    if (searchInput.value.length > 0) {
        searchClear.innerHTML = "&times;";
        searchClear.classList.add("is-clear");
        searchClear.setAttribute("aria-label", "Clear search");
    } else {
        var logoColor = localStorage.getItem("theme") === "light" ? "202124" : "f3d8b6";
        searchClear.innerHTML = `<img class="google-logo" src="https://cdn.simpleicons.org/google/${logoColor}" alt="Google">`;
        searchClear.classList.remove("is-clear");
        searchClear.setAttribute("aria-label", "Google search");
    }
}

searchInput.addEventListener("input", updateSearchButton);

searchClear.addEventListener("click", function () {
    if (searchInput.value.length > 0) {
        searchInput.value = "";
        updateSearchButton();
        searchInput.focus();
    }
});

updateSearchButton();


// SPORTS
const sportsWidget = document.getElementById("sports-widget");
const leagues = [
        "4429"  // World Cup
    ];

async function getSports() {
    const todayDate = new Date();
    today = todayDate.toISOString().split('T')[0];

    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);
    yesterday = yesterdayDate.toISOString().split('T')[0];

    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);
    tomorrow = tomorrowDate.toISOString().split('T')[0];

    const dates = {
        Yesterday: yesterday, 
        Today: today, 
        Tomorrow: tomorrow
    };
    const games = [];

    for (const [name, date] of Object.entries(dates)) {
        console.log(date + " - " + name)
        for (const league of leagues) {
            var sportsApi = `https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=${date}&l=${league}`;
            var response = await fetch(sportsApi);
            var data = await response.json();
            console.log(data);

            if (data.events != null) {
                for (let match of data.events) {
                    // Condition where we need more up-to-date data
                    if (match.strStatus != "FT" || name != "Tomorrow") {
                        var eventUrl = `https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=${match.idEvent}`;
                        var eventRes = await fetch(eventUrl);
                        var eventData = await eventRes.json();
                        match = eventData.events[0]
                    };
                    games.push(match);

                    var matchTeams = document.createElement("div");
                    matchTeams.className = "match-teams";
                    var matchScores = document.createElement("div");
                    matchScores.className = "match-scores";
                    // Home team data
                    buildTeamHtml(match, matchTeams, matchScores, "Home");
                    // Away team data
                    buildTeamHtml(match, matchTeams, matchScores, "Away");

                    var matchData = document.createElement("div");
                    matchData.className = "match-data";

                    var matchStatus = document.createElement("span");
                    matchStatus.className = "match-status";
                    if (match.strStatus == "NS") {
                        matchStatus.textContent = name;
                    } else {
                        matchStatus.textContent = match.strStatus;
                    }

                    var matchResult = document.createElement("div");
                    matchResult.className = "match-result"
                    matchResult.append(matchScores, matchStatus)
                    matchData.append(matchTeams, matchResult);

                    sportsWidget.appendChild(matchData);
                };
            };
        };
    };

    // sorted games in case needed
    // games.sort((a, b) => a.strTimestamp.localeCompare(b.strTimestamp));
}

function buildTeamHtml(match, matchTeams, matchScores, type) {
    var teamBadge = document.createElement('img');
    teamBadge.src = match[`str${type}TeamBadge`];
    teamBadge.className = "team-badge"
    var teamName = document.createElement('span');
    teamName.textContent = match[`str${type}Team`];
    var teamScore = document.createElement('span');
    teamScore.textContent = match[`int${type}Score`];
    var teamContainer = document.createElement('div');
    teamContainer.className = "team-data";
    teamContainer.append(teamBadge, teamName);
    matchTeams.appendChild(teamContainer);
    matchScores.appendChild(teamScore);
}

getSports();

// NOTES
const notesForm = document.querySelector('#notes-form')
const notesInput = document.querySelector('#notes-input')
const notesList = document.querySelector('#notes-list')

let notes = JSON.parse(localStorage.getItem('notes')) || []

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes))
}

function renderNotes() {
	notesList.innerHTML = ''

	notes.forEach(note => {
		const noteItem = document.createElement('div')
		noteItem.classList.add('note-item')

		if (note.completed) {
			noteItem.classList.add('completed')
		}

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.classList.add('note-checkbox')
		checkbox.checked = note.completed

		checkbox.addEventListener('change', () => {
			note.completed = checkbox.checked
			saveNotes()
			renderNotes()
		})

		const text = document.createElement('div')
		text.classList.add('note-text')
		text.innerHTML = formatNoteText(note.text)

		const deleteButton = document.createElement('button')
		deleteButton.classList.add('note-delete')
		deleteButton.textContent = '×'

		deleteButton.addEventListener('click', () => {
			notes = notes.filter(item => item.id !== note.id)
			saveNotes()
			renderNotes()
		})

		noteItem.append(
			checkbox,
			text, 
			deleteButton
		)

		notesList.appendChild(noteItem)
	})
}

notesForm.addEventListener('submit', event => {
	event.preventDefault()

	const text = notesInput.value.trim()
	if (!text) {
		return
	}

	notes.push({
		id: Date.now(),
		text,
		completed: false
	})

	saveNotes()
	renderNotes()
	notesInput.value = ''
})

renderNotes()

// Change text in braces to muted color
function formatNoteText(text) {
	const escaped = escapeHtml(text)
	return escaped.replace(
		/\((.*?)\)/g,
        '<span class="note-muted">($1)</span>'
	)
}

function escapeHtml(text) {
	const div = document.createElement('div')
	div.textContent = text
	return div.innerHTML
}



// https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
const weatherJSON = {
	"0":{
		"day":{
			"description":"Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"1":{
		"day":{
			"description":"Mainly Sunny",
			"image":"http://openweathermap.org/img/wn/01d@2x.png"
		},
		"night":{
			"description":"Mainly Clear",
			"image":"http://openweathermap.org/img/wn/01n@2x.png"
		}
	},
	"2":{
		"day":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02d@2x.png"
		},
		"night":{
			"description":"Partly Cloudy",
			"image":"http://openweathermap.org/img/wn/02n@2x.png"
		}
	},
	"3":{
		"day":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03d@2x.png"
		},
		"night":{
			"description":"Cloudy",
			"image":"http://openweathermap.org/img/wn/03n@2x.png"
		}
	},
	"45":{
		"day":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Foggy",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"48":{
		"day":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50d@2x.png"
		},
		"night":{
			"description":"Rime Fog",
			"image":"http://openweathermap.org/img/wn/50n@2x.png"
		}
	},
	"51":{
		"day":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"53":{
		"day":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"55":{
		"day":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"56":{
		"day":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"57":{
		"day":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Freezing Drizzle",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"61":{
		"day":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"63":{
		"day":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"65":{
		"day":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Heavy Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"66":{
		"day":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Light Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"67":{
		"day":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10d@2x.png"
		},
		"night":{
			"description":"Freezing Rain",
			"image":"http://openweathermap.org/img/wn/10n@2x.png"
		}
	},
	"71":{
		"day":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"73":{
		"day":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"75":{
		"day":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Heavy Snow",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"77":{
		"day":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Grains",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"80":{
		"day":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Light Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"81":{
		"day":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"82":{
		"day":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09d@2x.png"
		},
		"night":{
			"description":"Heavy Showers",
			"image":"http://openweathermap.org/img/wn/09n@2x.png"
		}
	},
	"85":{
		"day":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Light Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"86":{
		"day":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13d@2x.png"
		},
		"night":{
			"description":"Snow Showers",
			"image":"http://openweathermap.org/img/wn/13n@2x.png"
		}
	},
	"95":{
		"day":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"96":{
		"day":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Light Thunderstorms With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	},
	"99":{
		"day":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11d@2x.png"
		},
		"night":{
			"description":"Thunderstorm With Hail",
			"image":"http://openweathermap.org/img/wn/11n@2x.png"
		}
	}
}