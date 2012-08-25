var tas10core = require('tas10core')
  , Model = tas10core.getModel()
  , Tas10Array = tas10core.propDefinitions.Tas10Array
  , Tas10Boolean = tas10core.propDefinitions.Tas10Boolean
  , Tas10String = tas10core.propDefinitions.Tas10String;

function Label(){};
Label.inherits( Model );
Label.schema(
	{
		template: {type: Tas10Array, default: function(){ return []; } },
		color: {type: Tas10String },
		labelable: {type: Tas10Boolean, default: function(){ return true; } }
	} 
);

module.exports = Label;