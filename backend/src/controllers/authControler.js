
function generateHash(content) {
    return crypto.generate('sha256').digest('hex')
}
export class AuthControler {
    static async generateAccessToken(req, res) {
        try{
            const token = generateHash()
            const {access_token} = await AccessToken(token)
            return res.status(200).json({access_token})
        }catch (e) {
            res.status(422)
        }
    }
}