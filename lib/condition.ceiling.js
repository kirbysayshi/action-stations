var Picard = require('../lib/picard').Picard;

module.exports = function ceiling(ceil){
	
	function hasGreaterThan(data, val){
		var  i
			,result = 0;

		for(i = 0; i < data.length; i++){
			if(data[i][0] > val){
				result = Math.max(result, data[i][0]);
			}
		}

		return result;
	}

	return function(input){
		
		// TODO: graphite can send back multiple targets in an array
		var val = hasGreaterThan(input[0].datapoints, ceil)

		console.debug('condition: ceiling result',val);

		return new Picard('ceiling', ceil, val, new Date());
	}
}