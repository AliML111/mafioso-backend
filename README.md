# How this program works
The question was to take a phone number then using phone number and letter mapping to return a list of combinations.
To do this we need validate the request in multiple stages:

1. To check if request is in JSON format which is done by this middleware:

```

app.use((req, res, next) => {
    if (req.method === 'POST' && !req.is('application/json')) {
        return res.status(HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE).json({
            error: ERROR_MESSAGES[HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE],
            status: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE
        });
    }
    next();
});
```

2. To check if request has any field called phoneNumber and the type is string:

```
if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].MISSING_PHONE_NUMBER,
        status: HTTP_STATUS.BAD_REQUEST
    });
}
```

3. Then to check if the entered string include numbers between 2 up to 9:

```
if (!/^[2-9]+$/.test(phoneNumber)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].INVALID_PHONE_NUMBER,
        status: HTTP_STATUS.BAD_REQUEST
    });
}

```

4. And lastly to return proper response in case of entering wrong method or wrong endpoint:


```
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

```

To implement phone number and letter mapping I used a simple mapping:

```
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
```

Then iterated through each of the numbers given through input:

```
let combinations = [''];
for (const digit of phoneNumber) {
    const letters = digitMap[digit];
    combinations = combinations.flatMap(combo => letters.map(letter => combo + letter));
}
```

To return a combinations for those letters.

# How to run the code
Prerequisites:
- Docker
- Linux system

All you have to do is to clone the repository in your Linux system then do:

```
cp .env.example .env
docker compose up -d --build --wait
```

After seeing that application is healthy you can test `/combinations` endpoint via the Postman collection in the postman directory.

>You can also set the `APP_PORT` in .env file to whatever you want then rebuild the app to bring it up on custom port. This will take care of the port on which app listens on.
>