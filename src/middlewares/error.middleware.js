export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error(err.stack);
  const message = err.type === 'entity.parse.failed' ? 'JSON invalide' : status >= 500 ? 'Erreur interne du serveur' : err.message;
  res.status(status).json({ success: false, error: { status, message } });
};
