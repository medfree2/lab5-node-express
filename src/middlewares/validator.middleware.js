import { body, param, validationResult } from 'express-validator';
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};
const field = (name, optional) => optional ? body(name).optional() : body(name).exists().withMessage(`Le champ ${name} est obligatoire`).bail();
const productRules = (optional = false) => [
  body().custom(value => value !== null && typeof value === 'object' && !Array.isArray(value)).withMessage('Un objet JSON est requis'),
  field('name', optional).isString().withMessage('Le nom doit être une chaîne').bail().trim().notEmpty().withMessage('Le nom est obligatoire'),
  field('price', optional).isFloat({ min: 0 }).withMessage('Le prix doit être positif ou nul').bail().toFloat().custom(Number.isFinite),
  field('stock', optional).isInt({ min: 0, max: Number.MAX_SAFE_INTEGER }).withMessage('Le stock doit être un entier positif ou nul').bail().toInt()
];
export const validateId = [param('id').isInt({ min: 1, max: Number.MAX_SAFE_INTEGER }).withMessage('Identifiant invalide').bail().toInt(), handleValidation];
export const validateProduct = [...productRules(), handleValidation];
export const validateProductPatch = [...productRules(true), handleValidation];
