module.exports = function (req, res) {
    return function (data, err) {
        let responseObj = {
            success: true,
        };
        if (data) return res.json(Object.assign(responseObj, data));   
        responseObj.success = false;
        responseObj.error = err;
        res.json(responseObj);
    };
};
