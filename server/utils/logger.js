function formatContext(context = {}) {
  try {
    return JSON.stringify(context);
  } catch {
    return '{}';
  }
}

function log(level, message, context = {}) {
  const ts = new Date().toISOString();
  const payload = formatContext(context);
  console.log(`[${ts}] [${level}] ${message} ${payload}`);
}

function logInfo(message, context) {
  log('INFO', message, context);
}

function logWarn(message, context) {
  log('WARN', message, context);
}

function logError(message, context) {
  log('ERROR', message, context);
}

export { logInfo, logWarn, logError };
