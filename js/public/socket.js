const URL = 'http://localhost:8001';
var socket = io.connect(URL);

socket.emit('pointAdd', 'hey from HTML');

socket.on('chat message back', msg => {
    const stockData = msg;
    console.log(stockData);
    renderCharts(stockData);
});

function renderCharts(data) {
    const container = document.getElementById('chartContainer');
    container.innerHTML = ''; // Clear previous charts

    Object.keys(data).forEach(ticker => {
        // Create a canvas element for each stock chart
        const canvas = document.createElement('canvas');
        canvas.id = `chart_${ticker}`;
        canvas.classList.add('chartCanvas');
        canvas.style.height = '300px'; // Set the height directly in JavaScript
        container.appendChild(canvas);

        const stockData = data[ticker];
        const prices = stockData.map(entry => ({
            x: new Date(entry.Date),
            y: entry.Close
        }));

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [{
                    label: ticker,
                    data: prices,
                    fill: false,
                    borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: `Stock Chart: ${ticker}`
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'll'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price'
                        }
                    }
                }
            }
        });
    });
}
