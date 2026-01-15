const asyncHandleWrapper = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

module.exports = asyncHandleWrapper;