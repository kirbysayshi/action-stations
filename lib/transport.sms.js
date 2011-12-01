
function sms(){
	var outs = [].slice.call(arguments)

	return {
		execute: function(pcard){
			console.debug('transport.sms', outs, pcard);
		}
	}
}

sms.config = {};
module.exports = sms;