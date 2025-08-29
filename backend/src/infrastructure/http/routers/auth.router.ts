import Router, {
    type Request,
    type Response
} from 'express';
const router = Router();

import { CheckRegisterBody } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';


router.route('/register')
.post([CheckRegisterBody, AuthController.register]);

export default router;