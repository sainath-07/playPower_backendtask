const jwt = require('jsonwebtoken');
const database = require('../dbconnection/studentdetails');

const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    console.log("Token received in headers:", token);

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "secretkey");
        console.log("Decoded token:", decoded);

        // Fetch the user from the database using the decoded userId (in this case, username)
        const query = "SELECT * FROM register WHERE username=?";
        database.query(query, [decoded.userId], (err, data) => {
            if (err) {
                console.error("Database Query Error:", err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (data.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Attach the userId to the request object for later use
            req.userId = data[0].username;
            next();
        });

    } catch (e) {
        console.error("JWT Verification Error:", e);
        res.status(401).json({ errorMessage: 'Invalid token' });
    }
};

module.exports = verifyToken;
