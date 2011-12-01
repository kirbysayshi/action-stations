var  log4js = require('log4js')
	,_ = require('underscore')

	,Fetcher = require('./inputfetcher')
	,time = require('./time-utils')
	,conditions = {
		 biColor: require('./condition.bicolor')
		,ceiling: require('./condition.ceiling')
		,floor: require('./condition.floor')
	}
	,transports = {
		 email: require('./transport.email')
		,sms: require('./transport.sms')
		,graphite: require('./transport.graphite')
	}


function startup(checks, config){
	
	var  c, i
		,check
		,fetcher = new Fetcher
		,checkTimeouts = {};

	// mix in transport configs
	for(i in transports){
		if(config.transports[i]){
			console.debug('merging ' + i + ' transport config', transports[i].config, config.transports[i]);
			transports[i].config = _.extend(transports[i].config, config.transports[i]);
		}
	}

	// TODO: this needs to work based on passed-in config
	// log4js.configure(__dirname + '/../config.log.json');

	function queue(check){

		return function run(){
			var  data = fetcher.get(check.name, check.input)
				,checkResult
				,timeout;

			if(!data) {
				check.noDataCount = (check.noDataCount || 0) + 1;

				if(check.noDataCount > config.checks.failureThreshold){
					console.warn('Check ' + check.name + ' has not had fresh data for ' 
						+ check.noDataCount + ' iterations');
				}

				timeout = check.poll || config.checks.poll;
				console.debug('queueing check ' + check.name + ' to run in', timeout);

			} else {
				console.debug(check.name, 'has data');
				checkResult = check.condition(data);

				if(checkResult){
					console.info('a condition was met');

					if(check.transports.length){
						check.transports.forEach(function(t){
							t.execute(checkResult);
						})
					} else {
						check.transports.execute(checkResult);	
					}
					
					timeout = check.standby || config.checks.standby;
					console.debug('queueing check ' + check.name + ' to run (standby) in', timeout);
					
				} else {
					console.debug('a condition was not met');

					timeout = check.poll || config.checks.poll;
					console.debug('queueing check ' + check.name + ' to run in', timeout);
				}
			}

			checkTimeouts[check.name] = setTimeout(run, timeout);
		}
	}

	for(c in checks){
		check = checks[c];
		check.name = c;

		console.debug('queueing check ' + check.name + ' to run in', check.poll || config.checks.poll);
		checkTimeouts[check.name] = setTimeout(queue(check), check.poll || config.checks.poll);
	}

	return checkTimeouts;
}

exports.time = time;
exports.transports = transports;
exports.startup = startup;
exports.conditions = conditions;
