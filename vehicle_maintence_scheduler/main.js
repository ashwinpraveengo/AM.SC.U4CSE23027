const express = require('express');

const {
  getDepots,
  getVehicles,
  depots,
  vehicles
} = require('./data');

const { Log } =
  require('../logging_middleware/log');

const app = express();

app.use(express.json());

function knapsack(tasks, budget) {

  const n=tasks.length;

  const dp=Array(n + 1)
    .fill()
    .map(() => Array(budget + 1).fill(0));

  for (let i=1;i<=n; i++) {

    const duration=tasks[i-1].duration;

    const impact=tasks[i-1].impact;

    for (let w=0; w<= budget; w++) {

      if (duration <= w) {
        dp[i][w] = Math.max(
          impact + dp[i-1][w -duration],
          dp[i-1][w]
        );
      } else {
        dp[i][w]=dp[i-1][w];
      }
    }
  }

  let w=budget;

  const selectedTasks=[];

  for (let i=n; i > 0; i--) {
    if (dp[i][w] !== dp[i-1][w]) {
      selectedTasks.push(tasks[i - 1]);
      w-=tasks[i-1].duration;
    }
  }

  return {
    totalImpact: dp[n][budget],
    selectedTasks
  };
}

app.get('/schedule', async (req, res) => {
  try {
    await getDepots();
    await getVehicles();

    await Log(
      'backend',
      'info',
      'route',
      'Schedule requested'
    );

    if (depots.length === 0) {
      await Log(
        'backend',
        'warn',
        'service',
        'No depots found'
      );

      return res.status(404).json({
        error: 'No depots found'
      });
    }

    const depot=depots[0];

    const result=knapsack(
      vehicles,
      depot.mechanicHours
    );

    await Log('backend','info','service','Schedule generated');

    res.json({
      depotId: depot.id,
      mechanicHours: depot.mechanicHours,
      totalImpact: result.totalImpact,
      selectedTasks: result.selectedTasks
    });

  } catch (error) {

    await Log(
      'backend','fatal','handler','Schedule generation failed');

    res.status(500).json({
      error: error.message
    });
  }
});

const PORT=3000;

app.listen(PORT, async () => {

  console.log(`Server running ${PORT}`);
  await Log('backend','info', 'service', 'Server started');
});