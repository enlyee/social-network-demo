import {NextFunction, Request, Response} from "express";
import {ValidationError, validationResult} from "express-validator";

export const errorThrower = (req: Request, res: Response, next: NextFunction) => {

    const err = validationResult(req).formatWith((error: ValidationError) => {
        switch (error.type) {
            case "field":
                return {
                    message: error.msg,
                    field: error.path
                }
            default:
                return {
                    message: error.msg,
                    field: 'Unknown'
                }

        }
    })

    if (!err.isEmpty()) {
        const errorMessage = err.array({onlyFirstError: true})
        const errors = {
            errorsMessages: errorMessage
        }
        res.status(400).send(errors)
        return
    }

    next()

}