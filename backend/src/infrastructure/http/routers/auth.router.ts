import Router, {
    type Request,
    type Response
} from 'express';
const router = Router();

import { CheckRegisterBody } from '../middlewares/auth.middleware';


router.route('/register')
.post([CheckRegisterBody])

export default router;