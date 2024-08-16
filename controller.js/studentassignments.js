const assignmentdatabase = require('../dbconnection/studentassignment');
const database = require('../dbconnection/studentdetails')

const addAssignment = async (req, res) => {
    const { title, descripition } = req.body;

    if (!title || !descripition) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        // Use the user ID extracted from the verified token
        const username = req.userId;

        const query = "SELECT * FROM Assignment WHERE title=? AND username=?";
        assignmentdatabase.query(query, [title, username], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong", err });
            }

            if (result.length) {
                return res.status(422).json({ message: "Assignment with this title already exists in the database" });
            } else {
                const insertQuery = 'INSERT INTO Assignment SET ?';
                const assignmentData = { title, descripition, username };
                assignmentdatabase.query(insertQuery, assignmentData, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: "Error while inserting data", error: err });
                    } else {
                        return res.status(201).json({ message: "Assignment added successfully", result });
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const userAssignment = async (req, res) => {
    try {
        // Assuming req.userId contains the user ID extracted from the token
        const username = req.userId;

        // SQL query to retrieve assignments for the specific user
        const query = "SELECT title, descripition FROM Assignment WHERE username = ?";

        assignmentdatabase.query(query, [username], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error retrieving assignments", error: err });
            }

            return res.status(200).json({
                message: "Assignments retrieved successfully",
                no_of_assignments: results.length,
                assignments: results
            });
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteuserAssignment = async (req, res) => {
    const { id } = req.params;
    const username = req.userId;

    try {
        const query = "DELETE FROM assignment WHERE id = ? AND username = ?";

        assignmentdatabase.query(query, [id, username], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error while deleting assignments", error: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Assignment not found or not authorized to delete" });
            }

            return res.status(200).json({
                message: "Deleted the assignment successfully",
                result
            });
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const updateuserAssignment = async (req, res) => {
    try {
        const { title, descripition } = req.body; // Correct typo: 'descripition' to 'description'
        const { id } = req.params; // Assignment ID from URL params
        console.log(id, 'id')
        const username = req.userId; // User ID from JWT token
        console.log(username, 'username')
        // First, check if the assignment exists and belongs to the user
        const selectQuery = "SELECT * FROM assignment WHERE id = ? AND username = ?";
        assignmentdatabase.query(selectQuery, [id, username], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error while retrieving the assignment",
                    error: err
                });
            }

            // Check if the assignment was found
            // console.log(result, 'result')
            if (result.length === 0) {
                return res.status(404).json({
                    message: "Assignment not found or not authorized to update"
                });
            }

            // Proceed with updating the assignment
            const updateQuery = "UPDATE assignment SET title = ?, descripition = ? WHERE id = ? AND username = ?";
            assignmentdatabase.query(updateQuery, [title, descripition, id, username], (updateErr, updateResult) => {
                if (updateErr) {
                    return res.status(500).json({
                        message: "Error while updating the assignment",
                        error: updateErr
                    });
                }

                return res.status(200).json({
                    message: "Assignment updated successfully",
                    result: updateResult
                });
            });
        });
    } catch (error) {
        console.error("Error from catch block:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    updateuserAssignment,
    deleteuserAssignment,
    userAssignment,
    addAssignment
};
