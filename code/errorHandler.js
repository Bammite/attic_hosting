const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Pour le débogage

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // En mode développement, on peut aussi renvoyer la stack trace
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

module.exports = { errorHandler };