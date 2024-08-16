const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const database = require('../dbconnection/studentdetails');


const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const query = "SELECT * FROM register WHERE username=?";
        database.query(query, [username], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong while reading the user details" });
            }

            if (result.length > 0) {
                return res.status(422).json({ message: "User details already exist in the database" });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertQuery = 'INSERT INTO register SET ?';
                database.query(insertQuery, { username, password: hashedPassword }, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Error while inserting data", error: err });
                    } else {
                        return res.status(201).json({ message: "Registered successfully", result });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const query = "SELECT * FROM register WHERE username=?";
        database.query(query, [username], async (err, data) => {
            if (err) {
                return res.status(500).json({ message: "Error while logging in", error: err });
            }

            if (data.length > 0) {
                const user = data[0];
                console.log(user)
                const isMatch = await bcrypt.compare(password, user.password);

                const token = jwt.sign({ userId: user.username }, "secretkey", { expiresIn: "1h" });

                if (isMatch) {
                    return res.status(200).json({ message: "Login successful", token, user });
                } else {
                    return res.status(400).json({ message: "Invalid username or password" });
                }
            } else {
                return res.status(400).json({ message: "Invalid username or password" });
            }
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    login, register
}