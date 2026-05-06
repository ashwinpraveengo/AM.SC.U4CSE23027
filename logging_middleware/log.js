const baseUrl='http://20.207.122.201/evaluation-service/logs';

const valid_stacks=new Set(['backend','frontend']);
const valid_levels=new Set(['debug', 'info', 'warn', 'error', 'fatal']);
const valid_packs=new Set([
  'cache',
  'controller',
  'cron_job',
  'service',
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style',
  'auth',
  'config',
  'middleware',
  'utils'
]);

function validateField(value, validSet) {
  if (!validSet.has(value)){
    console.error('Invalid');
  }
}

async function Log(stack, level, packageName, message, options = {}) {
  validateField(stack,valid_stacks);
  validateField(level, valid_levels);
  validateField(packageName,valid_packs);

  const authToken=options.authToken || process.env.LOG_API_TOKEN;
  const headers={
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers.Authorization=`Bearer ${authToken}`;
  }

  const logbody={
    stack,
    level,
    package: packageName,
    message
  };

  const response=await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(logbody)
  });

  if (!response.ok) {
    const error=await response.text();
    console.error('Failed to send log', error);
  }

  return response.json();
}

module.exports={Log};
