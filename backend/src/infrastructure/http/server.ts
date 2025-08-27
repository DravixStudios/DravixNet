import Express from 'express';
import { EnvAdapter } from '@/infrastructure/EnvAdapter';
const app = Express();

const port: string = EnvAdapter.port;

app.set('port', port)

app.listen(app.get('port'), () => {
    console.log("Listening on port", app.get('port'))
})