var Picard = require('../lib/picard').Picard;

module.exports = function floor(flr){
	
	function hasLessThan(data, val){
		var  i
			,result = 0;

		for(i = 0; i < data.length; i++){
			if(data[i][0] < val){
				result = Math.min(result, data[i][0]);
			}
		}

		return result;
	}

	return function(input){
		
		// TODO: graphite can send back multiple targets in an array
		var val = hasLessThan(input[0].datapoints, ceil)

		console.debug('condition: floor result',val);

		return new Picard('floor', flr, val, new Date());
	}
}