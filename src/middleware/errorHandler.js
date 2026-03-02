const { CommandSucceededEvent } = require("mongodb");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    //Mongoose Validational error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: message.join(', ')
        })
    }

    //Mongoose Bad objectId
    if (err.name === 'CastError') {
        return res.status(404).json({
            success: false,
            error: 'Resource Not Found'
        })
    }

    //Mongoose Duplicate key(Handling Duplicated Keys)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'Duplicated Field Value Entered'
        })
    }

    //Handling a default erro
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    })
};

module.exports = errorHandler