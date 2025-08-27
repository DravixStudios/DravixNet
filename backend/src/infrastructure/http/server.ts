import Express from 'express';
import { EnvAdapter } from '@/infrastructure/EnvAdapter';

import api from './routers/api.router';

const app = Express();
app.use(Express.json());

const port: string = EnvAdapter.port;

app.set('port', port)

app.use('/api', api);

app.listen(app.get('port'), () => {
    console.log("Listening on port", app.get('port'))
})