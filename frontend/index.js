import { backend } from 'declarations/backend';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const toggleChartTypeButton = document.getElementById('toggle-chart-type');
const chartCanvas = document.getElementById('stock-chart');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading-indicator');

let chart;
let chartType = 'line';

const ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';

searchButton.addEventListener('click', searchStock);
toggleChartTypeButton.addEventListener('click', toggleChartType);

async function searchStock() {
    const symbol = searchInput.value.toUpperCase();
    if (!symbol) return;

    errorMessage.textContent = '';
    loadingIndicator.style.display = 'block';

    try {
        await backend.addSearch(symbol);
        const data = await fetchStockData(symbol);
        updateChart(data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        errorMessage.textContent = error.message;
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

async function fetchStockData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    if (data['Error Message']) {
        throw new Error(`API Error: ${data['Error Message']}`);
    }
    if (!data['Time Series (Daily)']) {
        throw new Error('No daily time series data available for this symbol');
    }
    return data['Time Series (Daily)'];
}

function updateChart(data) {
    const dates = Object.keys(data).reverse();
    const prices = dates.map(date => parseFloat(data[date]['4. close']));

    if (chart) {
        chart.destroy();
    }

    const ctx = chartCanvas.getContext('2d');
    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function toggleChartType() {
    chartType = chartType === 'line' ? 'candlestick' : 'line';
    if (chart) {
        chart.config.type = chartType;
        chart.update();
    }
}

// Load search history on page load
async function loadSearchHistory() {
    try {
        const history = await backend.getSearchHistory();
        console.log('Search History:', history);
    } catch (error) {
        console.error('Error loading search history:', error);
    }
}

loadSearchHistory();
