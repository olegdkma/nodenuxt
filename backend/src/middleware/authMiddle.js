import jwt from "jsonwebtoken";

export function authMiddle(req, res, next) {
    try {
        const cookie = req.cookies.token
console.log(req.cookies)
        if(!cookie) {
            return res.status(401).json({error: 'unathorised'})
        }
        const decoded = jwt.verify(cookie, 'secret')
console.log(decoded)
         req.user = decoded

        next()

    }catch (e) {
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'expired' });
        }
        console.log(e)
        return res.status(500).json({error: 'Server error'})
    }
 }