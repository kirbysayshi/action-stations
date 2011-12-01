
Action-Stations!
================

Action-Stations is a nodejs script that continually does the following:

	inputs --->			checks --->			alerts ---> 			transports ---> 		you
	get input data 		run data 			if checks are 			send that alert using
						through checks		met, create alert 		a transport

I planned to use it to monitor StatsD/Graphite statistics and send alerts if various metrics were unexpected, but then I discovered [hook.io](https://github.com/hookio/hook.io) and became somewhat... discouraged... from completing this. I'm putting it here so there is at least a record, in the event that I or someone else needs it.

To run: make a copy of `example-config.js`. Modify it to suit your needs, and then run:
	
	node your-copy-of-example.js

Verbose logging is turned on so you should see a ton of output.