let Seneca = require('seneca')

Seneca({tag: 'reason', timeout: 5000})
  //.test()
  //.test('print')
  //.use('monitor')
  .use('../reason.js')
  .listen(9035)
  .client({pin:'role:store', port:9045})
  .use('mesh')
