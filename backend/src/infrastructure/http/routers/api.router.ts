import Router, {
    type Request,
    type Response,
    type NextFunction
} from 'express';
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: 'Not found', 
        code: 404, 
        has_errors: true, 
        errors: ["Not found"]
    });
})

export default router;