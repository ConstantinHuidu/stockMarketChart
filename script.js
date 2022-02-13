let main = document.getElementById('main');
let selectStock = document.querySelector('.stock-items');
let timeSelection = document.querySelector('.time');
let stockSymbol = document.getElementById('stocks').value;
let timeframe = document.getElementById('time').value;
let chartActive = false;

selectStock.addEventListener('change', fetchAndDraw);
timeSelection.addEventListener('change', fetchAndDraw);

//fetch stock price and generate chart
async function fetchAndDraw() {
    let stockSymbol = document.getElementById('stocks').value;
    let timeframe = document.getElementById('time').value;
    document.getElementById('default').setAttribute("disabled", "disabled");
    const api_url = `https://twelve-data1.p.rapidapi.com/time_series?order=ASC&symbol=${stockSymbol}&interval=${timeframe}&outputsize=30&format=json`;
    const response = await fetch(api_url, {
        "method": "GET",
        "headers": {
        "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
        "x-rapidapi-key": "0cfeed69acmshcf2f63272ffecb8p1103e6jsn55810a173bfa"
    }
    });
    if (response.status != 200) {
        main.textContent = "You have exceeded the rate limit per minute for your plan, BASIC, by the API provider. Upgrade your plan or try again shortly."
        return;
    }
    const stocks = await response.json();
    let stocksData = stocks.values;
    drawChart(stocksData, chartActive);
    if (!chartActive) {
        chartActive = true;
    } 
}

//fill in chart data
function newChart(values) {
    const labels = values.map(values => values.datetime);
    const data = {
        labels: labels,
        datasets: [
            {
                label: `${stockSymbol} High`,
                backgroundColor: 'rgb(50, 205, 50)',
                borderColor: 'rgb(50, 205, 50)',
                data: values.map(values => values.high),
            },
            {
                label: `${stockSymbol} Low`,
                backgroundColor: 'rgb(220, 20, 60)',
                borderColor: 'rgb(220, 20, 60)',
                data: values.map(values => values.low),
            }
        ]
    };   
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    };
    return new Chart(
        document.getElementById('myChart'),
        config
    );
}

//draw a chart
function drawChart (values, chartActive) {
    if(!chartActive) {
        chart = newChart(values);
    } else {
        updateChartData(chart, values);
    }
}

//update a chart based on the new selections
function updateChartData(chart, values) {
    chart.data.labels = values.map(values => values.datetime);
    chart.data.datasets[0].data = values.map(values => values.high);
    chart.data.datasets[0].label = `${stockSymbol} High`;
	chart.data.datasets[1].data = values.map(values => values.low);
	chart.data.datasets[1].label = `${stockSymbol} Low`;
	chart.update();
}