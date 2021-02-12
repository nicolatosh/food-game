export default  {
    PORT:  80,
    HOSTNAME: '0.0.0.0',
    BACKEND: process.env.BACKEND || "localhost",
    MATCH_SERVICE_URL: `http://${process.env.BACKEND}:8080`,
    USER_SERVICE_URL: `http://${process.env.BACKEND}:5001`,
}



