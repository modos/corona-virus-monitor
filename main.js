const goButton = document.querySelector('.search-button');
const countryName = document.querySelector('.country-name');
const searchInput = document.querySelector('.search-input');
const cases = document.querySelector('.cases');
const historyList = document.querySelector('.history-list');
const clearButton = document.querySelector('.clear-button');

let userHistory = JSON.parse(localStorage.getItem('user-history'));

if (userHistory === null) {
    clearButton.setAttribute('hidden', true);
}else {
    getLocalStorageHistory();
}

function getItemBody(country, cases, critical, deaths, recovered) {
    return `
    <h2 class="country-name">${country}</h2>
    <div class="cases-body">
       <div class="today-cases">
            <h3>Today Cases</h3>
            <p class="today-cases-number">${cases}</p>
        </div>
        <div class="critical">
            <h3>Critical</h3>
            <p class="today-critical-number">${critical}</p>
        </div>
        <div class="today-deaths">
            <h3>Today Deaths</h3>
            <p class="today-deaths-number">${deaths}</p>
        </div>
        <div class="today-recovered">
            <h3>Today Recovered</h3>
            <p class="today-recovered-number">${recovered}</p>
        </div>
    </div>
    `
}

async function getSpecificCountry(country) {
    const req = await fetch(`https://corona.lmao.ninja/v2/countries/${country}?today&strict&query%20`);
    const res = await req.json();

    return res;
};

async function showTopTodayCases() {
    const req = await fetch('https://corona.lmao.ninja/v2/countries?today&sort=todayCases');
    const res = await req.json();

    cases.innerHTML = '';

    for (let index = 0; index < 4; index++) {
        
        cases.innerHTML += getItemBody(res[index].country, res[index].cases,
             res[index].deaths, res[index].critical, res[index].recovered);
                  
    }
};

async function showTopTodayDeaths() {
    const req = await fetch('https://corona.lmao.ninja/v2/countries?today&sort=todayDeaths');
    const res = await req.json();

    cases.innerHTML = '';

    for (let index = 0; index < 4; index++) {
        
        cases.innerHTML+= getItemBody(res[index].country, res[index].cases,
            res[index].deaths, res[index].critical, res[index].recovered);
        
    }
};

async function showTopTodayRecovered() {
    const req = await fetch('https://corona.lmao.ninja/v2/countries?today&sort=recovered');
    const res = await req.json();

    cases.innerHTML = '';

    for (let index = 0; index < 4; index++) {
        
        cases.innerHTML += getItemBody(res[index].country, res[index].cases,
            res[index].deaths, res[index].critical, res[index].recovered);
                
    }
};

function showHistory(query) {
    const node = document.createElement('p');
    node.textContent = query;
    historyList.appendChild(node);
};

function getLocalStorageHistory() {
    userHistory.forEach(element => {
        const node = document.createElement('p');
        node.textContent = element;
        historyList.appendChild(node);
    });
}

goButton.addEventListener(('click'), async () => {
    let query = searchInput.value;

    if (query === '') {
        if (document.getElementById('today-cases-radio').checked) {
            showTopTodayCases();
        }else if (document.getElementById('today-deaths-radio').checked) {
            showTopTodayDeaths();
        }else if (document.getElementById('today-recovered-radio').checked) {
            showTopTodayRecovered();
        }

        return;
    }
    countryName.textContent = query.toUpperCase();

    

    if (userHistory === null) {
        userHistory = [query];
    }else {
        userHistory.push(query);
    }

    clearButton.removeAttribute('hidden');

    localStorage.setItem('user-history', JSON.stringify(userHistory));

    let res = await getSpecificCountry(query);

    cases.innerHTML = '';

    cases.innerHTML = getItemBody(res.country, res.cases,
        res.deaths, res.critical, res.recovered);

        showHistory(query);
});

clearButton.addEventListener('click', () => {
    localStorage.clear();
    historyList.innerHTML = '';
    clearButton.setAttribute('hidden', true);
});