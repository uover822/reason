const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics

let Promise = require('bluebird')
let Wreck = require('wreck')
let ip = require('ip')

const registry = new client.Registry()

module.exports = function reason(options) {

  let Seneca = this
  let senact = Promise.promisify(Seneca.act, {context: Seneca})

  options = Seneca.util.deepextend({
    expert: {
      host: 'context',
      port: 4567,
      base: 'reason'
    }
  },options)

  client.collectDefaultMetrics({registry})

  let gauges = {}

  function pack (begin_ts, end_ts) {
    // pack begin_ts with 1/ e_tm
    let pe_tm = 1 / (end_ts - begin_ts)
    return begin_ts + pe_tm
  }

  Seneca.add('role:reason,cmd:metrics.collect', async (msg, reply) => {

    try {
      let Seneca = this
      // Enable the collection of default metrics

      let r = (await registry.metrics())

      return reply(null,{result:r})
    } catch(e) {
      console.dir(e)
    }
  })

  Seneca.add('role:reason,cmd:reason', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.reason.ts'])
      gauges['reason.reason.ts'] = new client.Gauge({
        name: 'perf_reason_reason_ts',
        help: 'ts when reasoning a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let descriptor = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/reason/'+encodeURIComponent(descriptor.id)+'/'+encodeURIComponent(msg.cid)
      //console.dir('REASON URL: '+url)
      let r = await Wreck.get(url,
                              {headers:{'content-type':'application/json'}
                              })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-r:'+d)
      gauges['reason.reason.ts'].set({event:'reason.reason', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.reason.ts'].set({event:'reason.reason', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  /*
  Seneca.add('role:reason,cmd:addRule', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.rule.add.ts'])
      gauges['reason.rule.add.ts'] = new client.Gauge({
        name: 'perf_reason_rule_add_ts',
        help: 'ts when adding a rule to a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let rule = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/rule'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.post(url,{payload:JSON.stringify(rule),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ar:'+d)
      gauges['reason.rule.add.ts'].set({event:'reason.rule.add', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.add.rule.ts'].set({event:'reason.rule.add', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:updRule', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.rule.upd.ts'])
      gauges['reason.rule.upd.ts'] = new client.Gauge({
        name: 'perf_reason_rule_upd_ts',
        help: 'ts when updating a rule for a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let rule = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/rule'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.put(url,{payload:JSON.stringify(rule),
                                   headers:{'content-type':'application/json'}
                                  })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ur:'+d)
      gauges['reason.rule.upd.ts'].set({event:'reason.rule.upd', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      gauges['reason.rule.upd.ts'].set({event:'reason.rule.upd', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:drpRule', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.rule.drp.ts'])
      gauges['reason.rule.drp.ts'] = new client.Gauge({
        name: 'perf_reason_rule_drp_ts',
        help: 'ts when dropping a rule from a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let rule = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/rule/'+encodeURIComponent(rule.id)
      //console.dir('REASON URL: '+url)
      let r = await Wreck.delete(url,
                                 {headers:{'content-type':'application/json'}
                                 })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-dr:'+d)
      gauges['reason.rule.drp.ts'].set({event:'reason.rule.drp', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.rule.drp.ts'].set({event:'reason.rule.drp', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })
  */

  Seneca.add('role:reason,cmd:addDescriptor', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.descriptor.add.ts'])
      gauges['reason.descriptor.add.ts'] = new client.Gauge({
        name: 'perf_reason_descriptor_add_ts',
        help: 'ts when adding a descriptor to a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let descriptor = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/descriptor'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.post(url,{payload:JSON.stringify(descriptor),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ad:'+d)
      gauges['reason.descriptor.add.ts'].set({event:'reason.descriptor.add', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.descriptor.add.ts'].set({event:'reason.descriptor.add', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:updDescriptor', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.descriptor.upd.ts'])
      gauges['reason.descriptor.upd.ts'] = new client.Gauge({
        name: 'perf_reason_descriptor_upd_ts',
        help: 'ts when updating a descriptor in a reason session',
          labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let descriptor = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/descriptor'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.put(url,{payload:JSON.stringify(descriptor),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ud:'+d)
      gauges['reason.descriptor.upd.ts'].set({event:'reason.descriptor.upd', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.descriptor.upd.ts'].set({event:'reason.descriptor.upd', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:drpDescriptor', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.descriptor.drp.ts'])
      gauges['reason.descriptor.drp.ts'] = new client.Gauge({
        name: 'perf_reason_descriptor_drp_ts',
        help: 'ts when dropping a descriptor in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let descriptor = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/descriptor/'+encodeURIComponent(descriptor.id)
      //console.dir('REASON URL: '+url)
      let r = await Wreck.delete(url,
                                 {headers:{'content-type':'application/json'}
                                 })
      let p = JSON.parse(JSON.stringify(r.payload))
      let d = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-dd:'+d)
      gauges['reason.descriptor.drp.ts'].set({event:'reason.descriptor.drp', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:d})
    } catch(e) {
      console.dir(e)
      gauges['reason.descriptor.drp.ts'].set({event:'reason.descriptor.drp', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:addAssociate', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.associate.add.ts'])
      gauges['reason.associate.add.ts'] = new client.Gauge({
        name: 'perf_reason_associate_add_ts',
        help: 'ts when adding a associate to a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let associate = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/associate'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.post(url,{payload:JSON.stringify(associate),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      let a = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-aa:'+a)
      gauges['reason.associate.add.ts'].set({event:'reason.associate.add', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:a})
    } catch(e) {
      console.dir(e)
      gauges['reason.associate.add.ts'].set({event:'reason.associate.add', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:updAssociate', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.associate.upd.ts'])
      gauges['reason.associate.upd.ts'] = new client.Gauge({
        name: 'perf_reason_associate_upd_ts',
        help: 'ts when updating an associate in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let associate = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/associate'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.put(url,{payload:JSON.stringify(associate),
                                   headers:{'content-type':'application/json'}
                                  })
      let p = JSON.parse(JSON.stringify(r.payload))
      let a = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ua:'+a)
      gauges['reason.associate.upd.ts'].set({event:'reason.associate.upd', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:a})
    } catch(e) {
      console.dir(e)
      gauges['reason.associate.upd.ts'].set({event:'reason.associate.upd', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:drpAssociate', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.associate.drp.ts'])
      gauges['reason.associate.drp.ts'] = new client.Gauge({
        name: 'perf_reason_associate_drp_ts',
        help: 'ts when dropping an associate in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let associate = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/associate/'+encodeURIComponent(associate.id)
      //console.dir('REASON URL: '+url)
      let r = await Wreck.delete(url,
                                 {headers:{'content-type':'application/json'}
                                 })
      let p = JSON.parse(JSON.stringify(r.payload))
      let a = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-da:'+a)
      gauges['reason.associate.drp.ts'].set({event:'reason.associate.drp', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:a})
    } catch(e) {
      console.dir(e)
      gauges['reason.associate.drp.ts'].set({event:'reason.associate.drp', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:addRelation', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.relation.add.ts'])
      gauges['reason.relation.add.ts'] = new client.Gauge({
        name: 'perf_reason_relation_add_ts',
        help: 'ts when adding a relation in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip', 'cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let relation = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/relation'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.post(url,{payload:JSON.stringify(relation),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      r = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ar:'+r)
      gauges['reason.relation.add.ts'].set({event:'reason.relation.add', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:r})
    } catch(e) {
      console.dir(e)
      gauges['reason.relation.add.ts'].set({event:'reason.relation.add', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address()}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:updRelation', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.relation.upd.ts'])
      gauges['reason.relation.upd.ts'] = new client.Gauge({
        name: 'perf_reason_relation_upd_ts',
        help: 'ts when updating a relation in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let relation = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/relation'
      //console.dir('REASON URL: '+url)
      let r = await Wreck.put(url,{payload:JSON.stringify(relation),
                                    headers:{'content-type':'application/json'}
                                   })
      let p = JSON.parse(JSON.stringify(r.payload))
      r = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-ur:'+r)
      gauges['reason.relation.upd.ts'].set({event:'reason.relation.upd', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:r})
    } catch(e) {
      console.dir(e)
      gauges['reason.relation.upd.ts'].set({event:'reason.relation.upd', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add('role:reason,cmd:drpRelation', async (msg, reply) => {

    let begin_ts = Date.now()

    if (!gauges['reason.relation.drp.ts'])
      gauges['reason.relation.drp.ts'] = new client.Gauge({
        name: 'perf_reason_relation_drp_ts',
        help: 'ts when dropping a relation in a reason session',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let Seneca = this
      let expert = options.expert
      let relation = msg
      let url = 'http://'+expert.host+':'+expert.port+
          '/'+expert.base+'/relation/'+encodeURIComponent(relation.id)
      //console.dir('REASON URL: '+url)
      let r = await Wreck.delete(url,
                                 {headers:{'content-type':'application/json'}
                                 })
      let p = JSON.parse(JSON.stringify(r.payload))
      r = p.data.map(c => String.fromCharCode(c)).join('')
      //console.dir('r.r-dr:'+r)
      gauges['reason.relation.drp.ts'].set({event:'reason.relation.drp', return_code:'200', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      reply(null,{id:r})
    } catch(e) {
      console.dir(e)
      gauges['reason.relation.drp.ts'].set({event:'reason.relation.drp', return_code:'500', service:'reason', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })
}
