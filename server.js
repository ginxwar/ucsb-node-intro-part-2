// express
const express = require('express')
const app = express()

// db connections
const sql = require('mssql')
const { DATA_WAREHOUSE_URI } = require('./secrets')
const getLedgerByDeptDate = require('./query').getLedgerByDeptDate

// query wrapper
const getLedgerDept = (ledgerDate, dept) => () => {
  const request = new sql.Request()
  request.input('ledgerDate', sql.Char, ledgerDate)
  request.input('dept', sql.Char, dept)
  return request.query(getLedgerByDeptDate)
}


app.set('views', './views')

// sets templating engine
app.set('view engine', 'pug')

// static route
app.get('/', (req, res) => {
  res.send('hello there')
})

// basic render for a non-static page
app.get('/a', (req, res) => {
  res.render('index', {
    title: 'Hey',
    message: 'hello world!'
  })
})

// render from a call to database
app.get('/ledger/', (req, res) => {

  // fetch data from sql server
  sql.connect(DATA_WAREHOUSE_URI)
    // run the query
    .then(getLedgerDept('201612', 'ERTH'))
    // now we have the result
    .then(ledger => {
      console.log(ledger)
      // render the result with the data pug template
      res.render('data', {
        ledger: ledger
      })
    })

    //uh oh, one of our promises from above broke
    .catch(err => {
      res.status(500).send('something really bad happened', err)
    })
})


// start the server and run on port 1111
app.listen(1111, () => {
  console.log('listening on port 1111');
})
