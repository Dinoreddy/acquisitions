import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';

app.listen(config.port, '0.0.0.0', () => {
  console.log(
    `Server running in ${config.env} at http://0.0.0.0:${config.port}`
  );
});
