const { check, validationResult } = require('express-validator/check'),
    { Employee, Address } = require('../../models'),
    newEmployeeValidation = [
        check('firstName').isAlpha().withMessage('first Name has incorrect form'), check('lastName').isAlpha().withMessage('last Name has incorrect form'),
        check('firstName').not().isEmpty().withMessage('first Name not be empty'), check('lastName').not().isEmpty().withMessage('last Name not be empty'),
        check('email').not().optional().withMessage('email required'), check('email').isEmail(),
        check('title').not().optional(), check('hireDate').not().optional(), check('birthDate').not().optional(),
        check('country').not().optional(), check('country').isAlpha(), check('country').not().isEmpty(),
        check('city').not().optional(), check('city').isAlpha(), check('city').not().isEmpty(),
        check('state').not().optional(), check('state').isAlpha(), check('state').not().isEmpty(),
        check('address').not().optional(), check('address').isString(), check('address').not().isEmpty(),
        check('phone').not().isEmpty(), check('fax').not().isEmpty(),
        check('postalCode').not().optional(), check('postalCode').isPostalCode('US'), (req, res, next) => {
            let newEmployee, errors = validationResult(req);

            if (!errors.isEmpty()) {
                let errorMessages = errors.array().map((item) => {
                    return item.msg;
                });

                return next(errorMessages.join(','));
            }
            newEmployee = new Employee({
                'firstName': req.body.firstName,
                'lastName': req.body.lastName,
                'email': req.body.email,
                'title': req.body.title,
                'hireDate': req.body.hireDate,
                'birthDate': req.body.birthDate,
                'reportsTo': req.body.reportsTo
            });

            newEmployee.address = new Address({
                'country': req.body.country,
                'city': req.body.city,
                'state': req.body.state,
                'address': req.body.address,
                'postalCode': req.body.postalCode,
                'phone': req.body.phone,
                'fax': req.body.fax
            });
            req.employee = newEmployee;
            return next();
        } ];

module.exports = newEmployeeValidation;
