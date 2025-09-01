import Router, {
    type Request,
    type Response
} from 'express';
const router = Router();

import { CheckRegisterBody, CheckLoginBody, VerifyToken } from '../middlewares/auth.middleware';
import { AuthController } from '../controllers/auth.controller';
import { JwtAdapter } from '@/infrastructure/auth/JwtAdapter';
import { EnvAdapter } from '@/infrastructure/EnvAdapter';

const verifyToken = VerifyToken(JwtAdapter, EnvAdapter);


router.route('/register')
.post([CheckRegisterBody, AuthController.register]);

router.route('/login')
.post([CheckLoginBody, AuthController.login]);

router.route('/me')
.get([verifyToken, AuthController.getMe]);

export default router;