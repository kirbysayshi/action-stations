function InputFetcher(){

	this.datas = {};
	this.times = {}; // when the data was fetched
	this.waiting = {}; // inputName as key set to truish indicates a call in progress
	this.timeouts = {};
}

InputFetcher.prototype = {
	
	get: function(inputName, input){

		var  now = new Date()
			,self = this;

		if(!this.timeouts[inputName]){
			console.debug('creating fetcher entry for ' + inputName);

			(function fetch(){
				
				if(!self.waiting[inputName]){
					self.waiting[inputName] = true;

					console.debug('fetching', inputName, input);
					input.fetch(function(data){ 
						// TODO: make cb accept error, and if not null do not add to datas

						self.datas[inputName] = data;
						self.times[inputName] = new Date();
						delete self.waiting[inputName];
						console.debug('fetched', inputName, data.length);
					});	
				}

				self.timeouts[inputName] = setTimeout(fetch, input.poll);

			})();
		}

		console.debug('getting input', inputName);
		console.debug('input expires in', input.poll - (now - this.times[inputName]) );

		return this.datas[inputName] || null;
	}
};

module.exports = InputFetcher;