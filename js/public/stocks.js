const URL = 'http://localhost:8001';
var socket = io.connect(URL);
let stockData;

socket.emit('pointAdd', 'hey from HTML');

socket.on('chat message back', msg => {
    stockData = msg;
    console.log('chat message back');
    // renderCharts();
});

document.getElementById('applyFiltersButton').addEventListener('click', () => {
    console.log('applyFiltersButton');
    renderCharts();
});

function findStrat(stok) {
    console.log('findStrat');
    let lastItem = stok[stok.length-1];
    let secondLastItem = stok[stok.length-2];
    let thirdLastItem = stok[stok.length-3];
    let fourthLastItem = stok[stok.length-4];
    if(!lastItem || !secondLastItem || !thirdLastItem || !fourthLastItem) return 0;
    let stratArr = [];
    
    // check third from last candle
    if(fourthLastItem.High > thirdLastItem.High) {
        if(fourthLastItem.Low < thirdLastItem.Low){
            stratArr.push(1);
        } else stratArr.push(2);
    } else {
        if(fourthLastItem.Low < thirdLastItem.Low) {
            stratArr.push(2);
        } else stratArr.push(3);
    }
    
    // check second from last candle
    if(thirdLastItem.High > secondLastItem.High) {
        if(thirdLastItem.Low < secondLastItem.Low){
            stratArr.push(1);
        } else stratArr.push(2);
    } else {
        if(thirdLastItem.Low < secondLastItem.Low) {
            stratArr.push(2);
        } else stratArr.push(3);
    }
    
    // check last candle
    if(secondLastItem.High > lastItem.High) {
        if(secondLastItem.Low < lastItem.Low){
            stratArr.push(1);
        } else stratArr.push(2);
    } else {
        if(secondLastItem.Low < lastItem.Low) {
            stratArr.push(2);
        } else stratArr.push(3);
    }

    if(stratArr[0] == 3 && stratArr[1] == 1 && stratArr[2] == 2) {
        let diff = ((thirdLastItem.High-secondLastItem.High)/thirdLastItem.High)*100;
        if(diff > 0) {
            console.log(`Ticker:${stok[0].ticker}, Strat:${stratArr} 0-1 diff %:${diff}`);
            return true;
        }
    }

    return false;
}

function renderCharts() {
    console.log('renderCharts');
    
    const filterAboveSMA150 = document.getElementById('filterAboveSMA150').checked;
    
    const chartsContainer = document.getElementById('chartsContainer');
    chartsContainer.innerHTML = ''; // Clear any existing charts

    let rowDiv;
    let chartCount = 0;

    Object.keys(stockData).forEach(ticker => {
        const stockItems = stockData[ticker];
        const lastItem = stockItems[stockItems.length - 1];

        // Apply SMA150 filter
        if (filterAboveSMA150 && lastItem.Close <= lastItem.SMA150) {
            return;
        }

        if (!findStrat(stockData[ticker])) {
            return;
        }

        let candlestickData = stockItems.map(data => ({
            x: Date.parse(data.Date),
            o: data.Open,
            h: data.High,
            l: data.Low,
            c: data.Close
        }));

        let sma150Data = stockItems.map(data => ({
            x: Date.parse(data.Date),
            y: data.SMA150
        })).filter(data => data.y !== null);

        if (chartCount % 4 === 0) {
            rowDiv = document.createElement('div');
            rowDiv.className = 'chart-row';
            chartsContainer.appendChild(rowDiv);
        }

        let canvas = document.createElement('canvas');
        canvas.style.maxWidth = '300px';
        canvas.style.maxHeight = '200px';
        rowDiv.appendChild(canvas);

        let ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'candlestick',
            data: {
                datasets: [{
                    label: ticker,
                    data: candlestickData,
                    yAxisID: 'y',
                    type: 'candlestick'
                },
                {
                    label: 'SMA150',
                    data: sma150Data,
                    borderColor: 'blue',
                    borderWidth: 1,
                    fill: false,
                    yAxisID: 'y',
                    type: 'line'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
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

        chartCount++;
    });
}
