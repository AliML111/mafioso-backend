const express = require('express');

const app = express();
app.use(express.json());

// Error constants
const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    UNSUPPORTED_MEDIA_TYPE: 415,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
    [HTTP_STATUS.BAD_REQUEST]: {
        INVALID_PHONE_NUMBER: 'phoneNumber must only contain digits 2-9',
        MISSING_PHONE_NUMBER: 'phoneNumber is required and must be a string'
    },
    [HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type: Request must be in JSON format',
    [HTTP_STATUS.NOT_FOUND]: 'Resource not found',
    [HTTP_STATUS.METHOD_NOT_ALLOWED]: 'Method not allowed',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal server error'
};

const digitMap = {
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z']
};

app.get('/healthz', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: "healthy"
    });
});

// Middleware to check if request is JSON
app.use((req, res, next) => {
    if (req.method === 'POST' && !req.is('application/json')) {
        return res.status(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE).json({
            error: ERROR_MESSAGES[HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE],
            status: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE
        });
    }
    next();
});

app.post('/combinations', (req, res) => {
    try {
        const phoneNumber = req.body.phoneNumber;
        
        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].MISSING_PHONE_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
            });
        }

        if (!/^[2-9]+$/.test(phoneNumber)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].INVALID_PHONE_NUMBER,
                status: HTTP_STATUS.BAD_REQUEST
            });
        }

        let combinations = [''];
        for (const digit of phoneNumber) {
            const letters = digitMap[digit];
            combinations = combinations.flatMap(combo => letters.map(letter => combo + letter));
        }

        res.json({ combinations });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error:`, error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            error: ERROR_MESSAGES[HTTP_STATUS.INTERNAL_SERVER_ERROR],
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        });
    }
});

app.all('/combinations', (req, res) => {
    res.set('Allow', 'POST');
    res.status(HTTP_STATUS.METHOD_NOT_ALLOWED).json({
        error: ERROR_MESSAGES[HTTP_STATUS.METHOD_NOT_ALLOWED],
        status: HTTP_STATUS.METHOD_NOT_ALLOWED
    });
});

app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        error: ERROR_MESSAGES[HTTP_STATUS.NOT_FOUND],
        path: req.originalUrl,
        status: HTTP_STATUS.NOT_FOUND
    });
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});