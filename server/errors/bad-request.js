
const { StatusCodes} =require('http-status-codes')
class BadRequestError extends Error {
    consturctor (message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports= BadRequestError