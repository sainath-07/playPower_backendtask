const { Router } = require('express');
const verifyToken = require('../Token/verifyToken');
const router = Router();
const { updateuserAssignment, deleteuserAssignment,userAssignment, addAssignment } = require('../controller.js/studentassignments')


router.post('/addAssignment', verifyToken, addAssignment)
    .get('/userAssignment', verifyToken, userAssignment)
    .delete('/deleteuserAssignment/:id', verifyToken, deleteuserAssignment)
    .put('/updateuserAssignment/:id', verifyToken, updateuserAssignment)

module.exports=router