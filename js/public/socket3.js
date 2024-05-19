const URL = 'http://localhost:8001';
var socket = io.connect(URL);
let stockData;

socket.emit('pointAdd', 'hey from HTML');

socket.on('chat message back', msg => {
  stockData = msg;
  console.log(stockData);
  renderCharts(stockData);
});

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

var chart = new Chart(ctx, {
  type: 'candlestick',
  data: {
    datasets: [{
      label: 'CHRT - Chart.js Corporation',
      data: [],
    }, {
      label: 'Close price',
      type: 'line',
      data: [],
      hidden: true,
    }]
  }
});

function randomBar(target, index, date, lastClose) {
  var open = parseFloat(target[index].Open).toFixed(2);
  var close = parseFloat(target[index].Close).toFixed(2);
  var high = parseFloat(target[index].High).toFixed(2);
  var low = parseFloat(target[index].Low).toFixed(2);

  target[index] = {
    x: new Date(date).valueOf(),
    o: open,
    h: high,
    l: low,
    c: close
  };
}

function renderCharts(stockData) {
  var barData = [];
  var lineData = [];

  Object.keys(stockData).forEach(ticker => {
    stockData[ticker].forEach((dataPoint, i) => {
      randomBar(stockData[ticker], i, dataPoint.Date, i === 0 ? 30 : stockData[ticker][i - 1].Close);
      barData.push(stockData[ticker][i]);
      lineData.push({ x: new Date(stockData[ticker][i].Date).valueOf(), y: parseFloat(stockData[ticker][i].Close).toFixed(2) });
    });
  });

  chart.config.data.datasets[0].data = barData;
  chart.config.data.datasets[1].data = lineData;
  chart.update();
}

var update = function () {
  var type = document.getElementById('type').value;
  chart.config.type = type;

  var scaleType = document.getElementById('scale-type').value;
  chart.config.options.scales.y.type = scaleType;

  var colorScheme = document.getElementById('color-scheme').value;
  if (colorScheme === 'neon') {
    chart.config.data.datasets[0].backgroundColors = {
      up: '#01ff01',
      down: '#fe0000',
      unchanged: '#999',
    };
  } else {
    delete chart.config.data.datasets[0].backgroundColors;
  }

  var border = document.getElementById('border').value;
  if (border === 'false') {
    chart.config.data.datasets[0].borderColor = 'rgba(0, 0, 0, 0)';
  } else {
    delete chart.config.data.datasets[0].borderColor;
  }

  var mixed = document.getElementById('mixed').value;
  chart.config.data.datasets[1].hidden = mixed !== 'true';

  chart.update();
};

[...document.getElementsByTagName('select')].forEach(element => element.addEventListener('change', update));
document.getElementById('update').addEventListener('click', update);

document.getElementById('randomizeData').addEventListener('click', function () {
  renderCharts(stockData); // Update with new data
  update();
});
