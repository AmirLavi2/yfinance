const URL = 'http://localhost:8001';
var socket = io.connect(URL);
let stockData;

socket.emit('pointAdd', 'hey from HTML');

socket.on('chat message back', msg => {
    stockData = msg;
    console.log(stockData);
    renderCharts();
});

function findStrat(stok) {
    let lastItem = stok[stok.length-1];
    let secondLastItem = stok[stok.length-2];
    let thirdLastItem = stok[stok.length-3];
    let fourthLastItem = stok[stok.length-4];
    if(!lastItem || !secondLastItem || !thirdLastItem || !fourthLastItem) return 0;
    let stratArr = [];
    
    // check third from last candle
    if(fourthLastItem.High > thirdLastItem.High) {
        if(fourthLastItem.Low < thirdLastItem.Low){
            stratArr.push(1) // console.log('third candle is 1');
        } else stratArr.push(2) // console.log('third candle is 2');
    } else {
        if(fourthLastItem.Low < thirdLastItem.Low) {
            stratArr.push(2) // console.log('third candle is 2');
        } else stratArr.push(3) // console.log('third candle is 3');
    }
    
    // check second from last candle
    if(thirdLastItem.High > secondLastItem.High) {
        if(thirdLastItem.Low < secondLastItem.Low){
            stratArr.push(1) // console.log('second candle is 1');
        } else stratArr.push(2) // console.log('second candle is 2');
    } else {
        if(thirdLastItem.Low < secondLastItem.Low) {
            stratArr.push(2) // console.log('second candle is 2');
        } else stratArr.push(3) // console.log('second candle is 3');
    }
    
    // check last candle
    if(secondLastItem.High > lastItem.High) {
        if(secondLastItem.Low < lastItem.Low){
            stratArr.push(1) // console.log('third candle is 1');
        } else stratArr.push(2) // console.log('third candle is 2');
    } else {
        if(secondLastItem.Low < lastItem.Low) {
            stratArr.push(2) // console.log('third candle is 2');
        } else stratArr.push(3) // console.log('third candle is 3');
    }

    // console.log(`Ticker:${stok[0].ticker}, Strat:${stratArr}`);
    
    if(stratArr[0] == 3 && stratArr[1] == 1 & stratArr[2] == 2) {
        let diff = ((thirdLastItem.High-secondLastItem.High)/thirdLastItem.High)*100;
        if(diff > 0) {
            console.log(`Ticker:${stok[0].ticker}, Strat:${stratArr} 0-1 diff %:${diff}`);
            return true;
        }
    }

    return false;
}

function renderCharts() {
    
    const chartsContainer = document.getElementById('chartsContainer');
    chartsContainer.innerHTML = ''; // Clear any existing charts

    let rowDiv;
    let chartCount = 0;

    Object.keys(stockData).forEach(ticker => {

        if(!findStrat(stockData[ticker])) {
            return;
        }

        let candlestickData = stockData[ticker].map(data => ({
            x: Date.parse(data.Date),
            o: data.Open,
            h: data.High,
            l: data.Low,
            c: data.Close
        }));

        let sma150Data = stockData[ticker].map(data => ({
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
                maintainAspectRatio: true, // Maintain aspect ratio to avoid stretching
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


        
        // findStrat(stockData[ticker])

        chartCount++;
    });
}



//// stockData EXAMPLE:
// stockData = {
//     "DLX": [
//         {
//             "id": 227,
//             "ticker": "DLX",
//             "Date": "2024-03-03T22:00:00.000Z",
//             "Open": 19.440000534057617,
//             "High": 19.489999771118164,
//             "Low": 19.149999618530273,
//             "Close": 19.15999984741211,
//             "Adj Close": 19.15999984741211,
//             "Volume": 129500,
//             "SMA50": 20.107999877929686,
//             "SMA150": 19.368333307902017,
//             "SMA200": 18.791949963569643,
//             "SMA20": 19.827999877929688
//         },
//         {
//             "id": 228,
//             "ticker": "DLX",
//             "Date": "2024-03-04T22:00:00.000Z",
//             "Open": 19,
//             "High": 19.399999618530273,
//             "Low": 18.950000762939453,
//             "Close": 18.969999313354492,
//             "Adj Close": 18.969999313354492,
//             "Volume": 147400,
//             "SMA50": 20.086399879455566,
//             "SMA150": 19.368199971516926,
//             "SMA200": 18.810449957847595,
//             "SMA20": 19.7564998626709
//         },
//         {
//             "id": 229,
//             "ticker": "DLX",
//             "Date": "2024-03-05T22:00:00.000Z",
//             "Open": 19.18000030517578,
//             "High": 19.18000030517578,
//             "Low": 18.81999969482422,
//             "Close": 18.8700008392334,
//             "Adj Close": 18.8700008392334,
//             "Volume": 124100,
//             "SMA50": 20.057599906921386,
//             "SMA150": 19.368666648864746,
//             "SMA200": 18.82644996166229,
//             "SMA20": 19.657999897003172
//         },
//         {
//             "id": 275,
//             "ticker": "DLX",
//             "Date": "2024-05-09T21:00:00.000Z",
//             "Open": 22.709999084472656,
//             "High": 22.829999923706055,
//             "Low": 22.3799991607666,
//             "Close": 22.719999313354492,
//             "Adj Close": 22.719999313354492,
//             "Volume": 205800,
//             "SMA50": 20.052399940490723,
//             "SMA150": 19.476333287556965,
//             "SMA200": 19.53119996070862,
//             "SMA20": 20.544499969482423
//         }
//     ],
//     "LC": [
//         {
//             "id": 502,
//             "ticker": "LC",
//             "Date": "2024-03-03T22:00:00.000Z",
//             "Open": 8.239999771118164,
//             "High": 8.3100004196167,
//             "Low": 8.020000457763672,
//             "Close": 8.039999961853027,
//             "Adj Close": 8.039999961853027,
//             "Volume": 824600,
//             "SMA50": 8.523399953842164,
//             "SMA150": 7.091466655731201,
//             "SMA200": 7.649050006866455,
//             "SMA20": 8.409499883651733
//         },
//         {
//             "id": 503,
//             "ticker": "LC",
//             "Date": "2024-03-04T22:00:00.000Z",
//             "Open": 7.929999828338623,
//             "High": 8.170000076293945,
//             "Low": 7.9029998779296875,
//             "Close": 7.989999771118164,
//             "Adj Close": 7.989999771118164,
//             "Volume": 929600,
//             "SMA50": 8.513999948501587,
//             "SMA150": 7.088799985249837,
//             "SMA200": 7.650000004768372,
//             "SMA20": 8.372499895095824
//         },
//         {
//             "id": 504,
//             "ticker": "LC",
//             "Date": "2024-03-05T22:00:00.000Z",
//             "Open": 8.069999694824219,
//             "High": 8.149999618530273,
//             "Low": 7.929999828338623,
//             "Close": 7.980000019073486,
//             "Adj Close": 7.980000019073486,
//             "Volume": 904300,
//             "SMA50": 8.498799953460694,
//             "SMA150": 7.087999982833862,
//             "SMA200": 7.6494500041008,
//             "SMA20": 8.33749988079071
//         },
//         {
//             "id": 550,
//             "ticker": "LC",
//             "Date": "2024-05-09T21:00:00.000Z",
//             "Open": 9.210000038146973,
//             "High": 9.234999656677246,
//             "Low": 8.90999984741211,
//             "Close": 9.010000228881836,
//             "Adj Close": 9.010000228881836,
//             "Volume": 3754800,
//             "SMA50": 8.31279998779297,
//             "SMA150": 7.579399973551432,
//             "SMA200": 7.397749986648559,
//             "SMA20": 8.384499979019164
//         }
//     ],
//     "COLL": [
//         {
//             "id": 777,
//             "ticker": "COLL",
//             "Date": "2024-03-03T22:00:00.000Z",
//             "Open": 37.52000045776367,
//             "High": 37.650001525878906,
//             "Low": 36.61000061035156,
//             "Close": 37.029998779296875,
//             "Adj Close": 37.029998779296875,
//             "Volume": 294900,
//             "SMA50": 33.0738000869751,
//             "SMA150": 26.95006669362386,
//             "SMA200": 25.738049993515016,
//             "SMA20": 34.272500324249265
//         },
//         {
//             "id": 778,
//             "ticker": "COLL",
//             "Date": "2024-03-04T22:00:00.000Z",
//             "Open": 37.0099983215332,
//             "High": 37.09000015258789,
//             "Low": 35.91899871826172,
//             "Close": 36.310001373291016,
//             "Adj Close": 36.310001373291016,
//             "Volume": 318300,
//             "SMA50": 33.203400115966794,
//             "SMA150": 27.04040003458659,
//             "SMA200": 25.80545000076294,
//             "SMA20": 34.433500385284425
//         },
//         {
//             "id": 779,
//             "ticker": "COLL",
//             "Date": "2024-03-05T22:00:00.000Z",
//             "Open": 36.369998931884766,
//             "High": 36.91999816894531,
//             "Low": 35.90999984741211,
//             "Close": 36.68000030517578,
//             "Adj Close": 36.68000030517578,
//             "Volume": 403400,
//             "SMA50": 33.32780014038086,
//             "SMA150": 27.13313336690267,
//             "SMA200": 25.87619999885559,
//             "SMA20": 34.605500316619874
//         },
//         {
//             "id": 780,
//             "ticker": "COLL",
//             "Date": "2024-03-06T22:00:00.000Z",
//             "Open": 36.970001220703125,
//             "High": 37.22999954223633,
//             "Low": 36.459999084472656,
//             "Close": 37.20000076293945,
//             "Adj Close": 37.20000076293945,
//             "Volume": 332300,
//             "SMA50": 33.470800170898436,
//             "SMA150": 27.234466705322266,
//             "SMA200": 25.94585000038147,
//             "SMA20": 34.805000400543214
//         },
//     "OBK": [
//         {
//             "id": 2977,
//             "ticker": "OBK",
//             "Date": "2024-03-03T22:00:00.000Z",
//             "Open": 29.520000457763672,
//             "High": 29.920000076293945,
//             "Low": 29.40999984741211,
//             "Close": 29.5,
//             "Adj Close": 29.5,
//             "Volume": 57500,
//             "SMA50": 31.997599906921387,
//             "SMA150": 31.21413333892822,
//             "SMA200": 31.026100006103515,
//             "SMA20": 29.77449998855591
//         },
//         {
//             "id": 2978,
//             "ticker": "OBK",
//             "Date": "2024-03-04T22:00:00.000Z",
//             "Open": 29.329999923706055,
//             "High": 30.860000610351562,
//             "Low": 29.191999435424805,
//             "Close": 30.850000381469727,
//             "Adj Close": 30.850000381469727,
//             "Volume": 123100,
//             "SMA50": 31.906599884033202,
//             "SMA150": 31.202466684977214,
//             "SMA200": 31.035200004577636,
//             "SMA20": 29.832499980926514
//         },
//         {
//             "id": 2979,
//             "ticker": "OBK",
//             "Date": "2024-03-05T22:00:00.000Z",
//             "Open": 30.799999237060547,
//             "High": 31.239999771118164,
//             "Low": 30.260000228881836,
//             "Close": 30.84000015258789,
//             "Adj Close": 30.84000015258789,
//             "Volume": 116900,
//             "SMA50": 31.80799987792969,
//             "SMA150": 31.189200007120768,
//             "SMA200": 31.043650007247926,
//             "SMA20": 29.87849998474121
//         }
//     ]
// }