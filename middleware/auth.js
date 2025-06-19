/**
 * @author: srinivasaimandi
 */

const VALID_API_KEY = 'b7f2e1a4-9c3d-4e8a-8f2e-2c1a7d6b5e9c';
let validApiKeys = [VALID_API_KEY];

function addApiKey(apiKey) {
    validApiKeys.push(apiKey);
}

function apiKeyAuth(req, res, next) {
    const apiKey = req.header('x-api-key');
    if (!validApiKeys.includes(apiKey)) {
        return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
    next();
}

module.exports = {
    apiKeyAuth,
    addApiKey,
    validApiKeys
};