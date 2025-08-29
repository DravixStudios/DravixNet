import Router, {
    type Request,
    type Response,
    type NextFunction
} from 'express';

import { ResponseBuilder } from '@/infrastructure/ResponseBuilder';

import auth from './auth.router';

const router = Router();

router.use('/auth', auth);

router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json(new ResponseBuilder(404).addError("Not found").build());
})

export default router;