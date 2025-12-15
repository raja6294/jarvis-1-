import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
    try {
        // Accept token from cookie or Authorization header (Bearer)
        let token = req.cookies?.token;
        if (!token) {
            const authHeader = req.headers?.authorization || '';
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({ message: 'token not found' });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
export default isAuth;
