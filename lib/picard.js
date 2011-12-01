
function Picard(name, expected, received, timestamp){
	this.name = name;
	this.expected = expected;
	this.received = received;
	this.timestamp = timestamp;
}

exports.Picard = Picard;