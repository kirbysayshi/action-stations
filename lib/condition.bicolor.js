var Picard = require('../lib/picard').Picard;

// yellow can be greater than red to indicate a reverse
module.exports = function biColor(yellow, red){
	
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
		
		// returning Picard triggers transport

		var  yellowVal
			,redVal

		// graphite can send back multiple targets in an array
		input = input[0].datapoints;

		if(yellow > red){
			yellowVal = hasLessThan(input, yellow);
			redVal = hasLessThan(input, red);

		} else {
			yellowVal = hasGreaterThan(input, yellow);
			redVal = hasGreaterThan(input, red);
		}

		console.debug('biColor result', 'yellow', yellowVal, 'red', redVal);

		if(redVal > 0){
			return new Picard('red', red, redVal, new Date()); // type of alert, expected val, found val, timestamp
		} else if(yellowVal > 0){
			return new Picard('yellow', yellow, yellowVal, new Date());
		}
	}
}