
function email(){
	var outs = [].slice.call(arguments);

	return {
		execute: function(pcard){
			console.debug('transport.email', outs, pcard);
		}
	}

}

email.config = {};
module.exports = email;

