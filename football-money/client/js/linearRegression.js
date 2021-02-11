// https://stackoverflow.com/questions/6195335/linear-regression-in-javascript
const linearRegression = (x, y) => {
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {
    sum_x += x[i];
    sum_y += y[i];
    sum_xy += x[i] * y[i];
    sum_xx += x[i] * x[i];
    sum_yy += y[i] * y[i];
  }

  lr["slope"] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  lr["intercept"] = (sum_y - lr.slope * sum_x) / n;
  lr["r2"] = Math.pow(
    (n * sum_xy - sum_x * sum_y) /
      Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
    2
  );

  lr["func"] = (xVal) => lr["slope"] * xVal + lr["intercept"];

  return lr;
};

const calcMean = (data) => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i];
  }
  return (1 / data.length) * total;
};

const calcStd = (data, mean) => {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += Math.pow(data[i] - mean, 2);
  }
  const varinace = (1 / data.length) * total;
  return Math.sqrt(varinace);
};
