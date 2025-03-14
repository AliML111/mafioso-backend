# Phone Number to Letter Combinations API

This API takes a phone number (string of digits 2-9) and returns all possible letter combinations based on a phone keypad. The response is a list of valid letter sequences.

1️⃣ How the API Works

The API has a single endpoint:

POST `/combinations`

Request Body (JSON):

```
{ "phoneNumber": "23" }
```

Response (JSON):

```
{ "combinations": ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"] }
```

2️⃣ Input Validation Steps

The request goes through multiple validation stages:

    Check if the request is in JSON format:

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

Ensure phoneNumber exists and is a string:

```
if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].MISSING_PHONE_NUMBER,
        status: HTTP_STATUS.BAD_REQUEST
    });
}
```

Ensure phoneNumber only contains digits between 2-9:

```
if (!/^[2-9]+$/.test(phoneNumber)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES[HTTP_STATUS.BAD_REQUEST].INVALID_PHONE_NUMBER,
        status: HTTP_STATUS.BAD_REQUEST
    });
}
```

Handle wrong methods and endpoints gracefully:

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

3️⃣ Letter Mapping Logic

The API uses a digit-to-letters mapping, just like a phone keypad:

```
const digitMap = {
    '2': ['a', 'b', 'c'],  '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],  '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],  '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],  '9': ['w', 'x', 'y', 'z']
};
```

To generate combinations:

```
let combinations = [''];
for (const digit of phoneNumber) {
    const letters = digitMap[digit];
    combinations = combinations.flatMap(combo => letters.map(letter => combo + letter));
}
```

4️⃣ How to Run the Code

📌 Prerequisites

    Docker
    Linux system

🚀 Run the API with Docker

    Clone the repository:

```
git clone https://github.com/AliML111/mafioso-backend.git
cd mafioso-backend
```

Copy environment file:

```
cp .env.example .env
```

Build and start the application:

```
docker compose up -d --build --wait
```

Check if the application is running:

```
docker ps
```

Check health status:

```
docker inspect --format='{{json .State.Health}}' node
```

5️⃣ Testing the API

📌 Using curl

```
curl -X POST http://localhost:3000/combinations \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "23"}'
```

📌 Using Postman

You can also import the Postman collection from the `postman` directory.

6️⃣ Custom Port Configuration

You can set the port number in the .env file:

`APP_PORT=8080`

Then rebuild the app:

```
docker compose up -d --build
```

7️⃣ Docker Health Check

This app includes a Docker health check to ensure the service is running:

```
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/healthz"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 10s
```

If the health check fails 3 times, Docker marks the container as unhealthy.
