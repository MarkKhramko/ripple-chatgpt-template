const moduleAlias = require('module-alias');


moduleAlias.addAliases({
	'#configs':     __dirname + '/configs',
	'#controllers': __dirname + '/src/controllers',
	'#factories':   __dirname + '/src/factories',
	'#middlewares': __dirname + '/src/middlewares',
	'#mixins':      __dirname + '/src/mixins',
	'#services':    __dirname + '/src/services',
	'#utils':       __dirname + '/src/utils'
});
