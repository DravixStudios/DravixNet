import Router, {
    type Request,
    type Response,
    type NextFunction
} from 'express';

import { ResponseBuilder } from '@/infrastructure/ResponseBuilder';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json(new ResponseBuilder(404).addError("The /api endpoint can't be get.").build());
})

export default router;