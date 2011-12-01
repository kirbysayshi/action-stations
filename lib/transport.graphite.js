var  request = require('request')
	,url = require('url')
	,config = {}
	,time = require('../lib/time-utils');

function makeGraphiteUrl(params){
	var  base = config.base + '/render?'
		,p
		,all;

	for(p in params){
		if(params.hasOwnProperty(p)){
			base += p + '=' + params[p] + '&'	;
		}
	}

	// remove trailing &
	all = base.substring( 0, base.length - 1 );
	console.debug('created graphite url', all);

	return all;
}

function graphiteRequest(params, cb){
	console.debug('graphite config', config);

	params.from = params.from || config.from;
	params.until = params.until || config.until;
	params.format = params.format ||  config.format;

	var reqUrl = url.parse(makeGraphiteUrl(params))

	if(config.auth === 'basic'){
		reqUrl.auth = config.user + ':' + config.pass;	
	}

	console.debug('making graphite request', reqUrl);
	request({
		 uri: reqUrl
	}, function(err, res, body){
		if(err){
			console.error('graphite request failed', err, res, body);
		}
		console.debug('received graphite response', err, body.length, body);
		cb( JSON.parse(body) );
	})
}

function graphite(opts, poll){
	
	return {

		 poll: poll	
		
		,fetch: function(callback){
			console.debug('transport.graphite asked to fetch');

			graphiteRequest(opts, function(data){
				console.debug('communicator received data');
				callback(data) // TODO: extra processing?
			});
		}
	}

}

graphite.config = config;
module.exports = graphite;