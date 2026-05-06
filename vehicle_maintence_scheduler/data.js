require('dotenv').config();
const axios=require('axios');

const {Log}=require('../logging_middleware/log');

const token=process.env.AUTH_TOKEN;

const headers={
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
};

const depots=[];
const vehicles=[];

async function getDepots() {
  try {
    const response=await axios.get(
      'http://20.207.122.201/evaluation-service/depots',
      { headers }
    );
    depots.length=0;
    response.data.depots.forEach((depot) => {
      depots.push({
        id: depot.ID,
        mechanicHours: depot.MechanicHours
      });

    });
    await Log(
      'backend',
      'info',
      'service',
      'Depots fetched'
    );

  } catch (error) {

    await Log(
      'backend',
      'error',
      'service',
      'Depot fetch failed'
    );
  }
}

async function getVehicles() {
  try {
    const response = await axios.get(
      'http://20.207.122.201/evaluation-service/vehicles',
      { headers }
    );
    vehicles.length = 0;
    response.data.vehicles.forEach((vehicle) => {
      vehicles.push({
        taskId: vehicle.TaskID,
        duration: vehicle.Duration,
        impact: vehicle.Impact
      });
    });

    await Log(
      'backend',
      'info',
      'service',
      'Vehicles fetched'
    );

  } catch (error) {
    await Log(
      'backend',
      'error',
      'service',
      'Vehicle fetch failed'
    );
  }
}

module.exports = {
  getDepots,
  getVehicles,
  depots,
  vehicles
};