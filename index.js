const epxress = require('express')
const app = epxress()

require('./dbconnection/studentdetails')
require('./dbconnection/studentassignment')

// routes
const studentdetails = require('./route/studentdetails')
const assginmentdetails = require('./route/studentassignment')

app.use(epxress.json())
app.use('/', studentdetails)
app.use('/', assginmentdetails)

app.get('/', (req, res) => {
    res.send('root page')
})

const port = 8100
app.listen(port, () => {
    console.log(`server is running fine ${port}`)
})