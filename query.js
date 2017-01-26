const getLedgerByDeptDate = `
SELECT    TOP 2
  sequence_no
  ,ledger_date
  ,fin_department_code
  
FROM  dbo.fin_gl_detail

where 1=1
      and ledger_date = @ledgerDate
      and fin_department_code = @dept
`

module.exports = {
  getLedgerByDeptDate
}
