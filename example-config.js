var  as = require('action-stations')
	,inputs = {}
	,checks = {}
	,users = {}
	,config = {}


///// CONFIG

config.logging = {};
config.transports = {};

config.transports.graphite = {
	 base: "http://yourgraphiteserver.com" // no trailing slash
	,user: ""
	,pass: ""
	,auth: "basic" // defaults to basic auth, remove this property if server is open

	,from: '-5minutes' 
	,until: 'now'
	,format: 'json'	
};

config.transports.twillio = {
	 apikey: ''
	,apisecret: ''
};

config.transports.email = {
	 server: ''
	,port: ''
};

config.checks = {
	 failureThreshold: 5 // if no data after 5 check runs, probably something wrong with the input
	,standby: 12000
	,poll: as.time.minToMs(0.1)
}


///// INPUTS

inputs['processlist DB::WRITE'] = as.transports.graphite(
	{ target: 'cumulative(stats_counts.mysql.BTWRITE.processlist.count)' }
	,as.time.minToMs(0.5)
);

inputs['processlist DB::READ'] = as.transports.graphite(
	{ target: 'cumulative(stats_counts.mysql.BTREAD.processlist.count)' }
	,as.time.minToMs(0.5)
);

///// USERS

users.drew = { sms: as.transports.sms('6666666666'), email: as.transports.email('myemail@yoursite.com') };
users.joe = { sms: as.transports.sms('5555555555'), email: as.transports.email('youremail@yoursite.com') };


///// CHECKS

// TODO: make condition(s) accept array of conditions?
// TODO: make input(s) accept an array of input names?

checks['mysql process list DB::READ'] = {
	 input: inputs['processlist DB::READ']
	,condition: as.conditions.biColor(5, 30) // can be either a custom function or defined in conditions
	,transports: [users.drew.sms, users.drew.email] // as many as you want
	,standby: 10000 // when the condition is met, wait this long until checking again
};

checks['mysql process list DB::WRITE'] = {
	 input: inputs['processlist DB::WRITE']
	,condition: as.conditions.biColor(5, 30) 
	,transports: [users.drew.sms, users.drew.email] 
};

///// STARTUP

as.startup(checks, config);

