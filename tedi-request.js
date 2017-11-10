var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

exports.object3d = Command;
exports.object3d = Object3d;

var USER, SECRET_ACCESS_KEY, PROJECT_ID;
var COMMANDS = [{
      title:'Set Object Value',
      command:'SetValueCommand',
      values:['uuid','attributeName','value']
    },{
      title:'Set Position',
      command:'SetPositionCommand',
      values:['uuid','x','y','z']
    },{
    title:'Set Rotation',
      command:'SetRotationCommand',
      values:['uuid','x','y','z','order']
    },{
    title:'Set Scale',
      command:'SetScaleCommand',
      values:['uuid','x','y','z']
    },{
    title:'Set Uuid',
      command:'SetUuidCommand',
      values:['uuid','uuid','newUuid']
    },{
    title:'Set Material Map',
      command:'SetMaterialMapCommand',
      values:['uuid','materialIndex','mapName','url']
    },{
    title:'Set Material',
      command:'SetMaterialCommand',
      values:['uuid','materialIndex','material']
    },{
    title:'Set Material Value',
      command:'SetMaterialValueCommand',
      values:['uuid','materialIndex','attributeName','value']
    },{
    title:'Set Material Color',
      command:'SetMaterialColorCommand',
      values:['uuid','materialIndex','attributeName','color']
    },{
    title:'Remove Object',
      command:'RemoveObjectCommand',
      values:['uuid']
    },{
    title:'Add Object',
      command:'AddObjectCommand',
      values:[]
    },{
    title:'Add Preset',
      command:'AddPresetCommand',
      values:['name']
    }];

exports.setCredentials = function( credentials ){
    
    USER = credentials.email;
    SECRET_ACCESS_KEY = credentials.secretAccessKey;
    
    if( credentials.projectId !== undefined ) PROJECT_ID = credentials.projectId; 
    
};

exports.setProjectId = function( id ){
    
    PROJECT_ID = id;
    
};

exports.sendData = function( data, callback ){
    
    if( data == undefined ) return;

    if( data.name !== undefined && data.name.includes('Command') ) exports.sendCommand( data );
        
    // if( callback !== undefined ){
    //     var error;
    //     if( command.error.length ) {
    //         error = command.error;
    //         callback(error);
    //     } else {
    //         callback( undefined, command.toJSON());
    //     }
    // }
    
};

exports.sendCommand = function( cmd, callback ){
    
    var command = new Command( cmd.name, cmd.value );
    
    if( !command.error.length )
        command.send();
        
    if( callback !== undefined ){
        var error;
        if( command.error.length ) {
            error = command.error;
            callback(error);
        } else {
            callback( undefined, command.toJSON());
        }
    }
    
};

exports.addObject = function( object, projectId ){
        
    PROJECT_ID = projectId;
    
    if(object.type !== 'Object3d')
        object = new Object3d( object );
    
    if( object.isValid() ){
        var command = new Command({name: "AddObjectCommand", value: JSON.stringify(object.toJSON())});
        console.log(command.toJSON());
        post(command);
        
    } else {
        
        console.error("ERROR : Object has error. Impossible to send it.");
        
    }
    
};

exports.updateProject = function( data, projectId ){
    check('project', data);
    
};

exports.tween = function( data, projectId ){
    check('tween', data);
};

function generateUuid(){

	// http://www.broofa.com/Tools/Math.uuid.htm

	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
	var uuid = new Array( 36 );
	var rnd = 0, r;

	for ( var i = 0; i < 36; i ++ ) {

		if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

			uuid[ i ] = '-';

		} else if ( i === 14 ) {

			uuid[ i ] = '4';

		} else {

			if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
			r = rnd & 0xf;
			rnd = rnd >> 4;
			uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

		}

	}
	
	return uuid.join( '' );
}

function post( data ){
    
    var post_data = querystring.stringify({
        email: USER,
        secretAccessKey: SECRET_ACCESS_KEY,
        projectId: PROJECT_ID,
        data: JSON.stringify( data )
    });
    
    console.log(post_data);
    // An object of options to indicate where to post to
    var post_options = {
        host: 'tedi-twistengine.c9users.io',
        port: '8080',
        path: '/api/command',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var str = '';
        res.on('data', function (chunk) {
            str += chunk;
            console.log('Response: ' + chunk);
        });
        
        res.on('end', function () {
            console.log('End: ' + str);
        });
    });
    
    // post the data
    post_req.write(post_data);
    post_req.end();
}


var Command = function( name, value ){
    
    this.commands = {
            SetValueCommand:['uuid','attributeName','value'],
            SetPositionCommand:['uuid','x','y','z'],
            SetRotationCommand:['uuid','x','y','z','order'],
            SetScaleCommand:['uuid','x','y','z'],
            SetUuidCommand:['uuid','uuid','newUuid'],
            SetMaterialMapCommand:['uuid','materialIndex','mapName','url'],
            SetMaterialCommand:['uuid','materialIndex','material'],
            SetMaterialValueCommand:['uuid','materialIndex','attributeName','value'],
            SetMaterialColorCommand:['uuid','materialIndex','attributeName','color'],
            RemoveObjectCommand:['uuid'],
            AddObjectCommand:['object3d'],
            AddPresetCommand:['name']
        };
	
	this.name = name;
	this.value = value;
	this.isValid = true;
	this.error = [];
	
	this.validate(name, value);	
};

Command.prototype = {
    
    validate: function( commandName, value ){
        
        this.error = [];
        var self = this;
        
        if( commandName == "AddObjectCommand") {
            
            var object = new Object3d( value );
            
            this.value = object.object;
            console.log("value", this.value);
        } else {
            
            this.commands[commandName].forEach(function(v){
                
                if( value[v] === undefined || value[v] === '' ){
                    
                    var error = new Error("Value "+ v +" must be defined for "+ commandName +" command.");
                    self.error.push( error.toString() );
                    self.isValid  = false;
                    
                }
                
            });
        }
        return this.isValid;
        
    },
    
    toJSON: function(){
        
        return { name: this.name, value: this.value }  ;
        
    },
    
    send: function(){
        
        if(this.isValid)
            post({name: this.name, value: this.value});
        else
            console.error('ERROR: Cannot send invalid command.');
        
    }
}

var Object3d = function( object ){
    var positionAttributes = [
        { name: 'x', defaultValue: 0, type: 'number' },
        { name: 'y', defaultValue: 0, type: 'number' },
        { name: 'z', defaultValue: 0, type: 'number' }];
        
    var rotationAttributes = [
        { name: 'x', defaultValue: 0, type: 'number' },
        { name: 'y', defaultValue: 0, type: 'number' },
        { name: 'z', defaultValue: 0, type: 'number' },
        { name: 'order', defaultValue: 'XYZ', type: 'string' }];
        
    var scaleAttributes = [
        { name: 'x', defaultValue: 0, type: 'number' },
        { name: 'y', defaultValue: 0, type: 'number' },
        { name: 'z', defaultValue: 0, type: 'number' }];
        
    var geometryAttributes = [
        { name: 'type', defaultValue: 'Box', type: 'string' },
        { name: 'width', defaultValue: null, type: 'number' },
        { name: 'height', defaultValue: null, type: 'number' },
        { name: 'depth', defaultValue: null, type: 'number' },
        { name: 'radius', defaultValue: null, type: 'number' },
        { name: 'segments', defaultValue: null, type: 'number' },
        { name: 'radiusTop', defaultValue: null, type: 'number' },
        { name: 'radiusBottom', defaultValue: null, type: 'number' },
        { name: 'radiusSegments', defaultValue: null, type: 'number' },
        { name: 'openEnded', defaultValue: null, type: 'number' },
        { name: 'widthSegments', defaultValue: null, type: 'number' },
        { name: 'heightSegments', defaultValue: null, type: 'number' },
        { name: 'phiStart', defaultValue: null, type: 'number' },
        { name: 'phiLength', defaultValue: null, type: 'number' },
        { name: 'thetaStart', defaultValue: null, type: 'number' },
        { name: 'thetaLength', defaultValue: null, type: 'number' }];
        
    var materialAttributes = [
        { name: 'type', defaultValue: 'Standard', type: 'string' },
        { name: 'color', defaultValue: null, type: 'string' },
        { name: 'emissive', defaultValue: null, type: 'string' },
        { name: 'roughness', defaultValue: null, type: 'number' },
        { name: 'metalness', defaultValue: null, type: 'number' }];
        
    this.attributes = [
        { name: 'uuid', defaultValue: generateUuid(), type: 'string' },//Required universal unique identifier.
        { name: 'type', defaultValue: 'Mesh', type: 'string' },//Mesh, Light, Comment, Event or Alert, Icon
        { name: 'url', defaultValue: null, type: 'string' },
        { name: 'parentUuid', defaultValue: null, type: 'string' },//object type.
        { name: 'name', defaultValue: 'No name', type: 'string' },//object name.
        { name: 'color', defaultValue: null, type: 'string' },//object name.
        { name: 'icon', defaultValue: null, type: 'string' },//
        { name: 'message', defaultValue: null, type: 'string' },//
        { name: 'matrix', defaultValue: null, type: 'object' },//Object matrix. Attention si elle est définie, la position, la rotation et l’échelle ne seront pas prises en compte.
        { name: 'position', defaultValue: null, type: 'object', attributes: positionAttributes },//Position x, y, z. if null, it will be set to 0, 0, 0.
        { name: 'rotation', defaultValue: null, type: 'object', attributes: rotationAttributes },//Rotation x, y, z. if null, it will be set to 0, 0, 0. De l’objet en radians dans l’ordre défini par "order" ("XYZ" par défaut).
        { name: 'scale', defaultValue: null, type: 'object', attributes: scaleAttributes },//Scale x, y, z. if null, it will be set to 0, 0, 0.
        { name: 'geometry', defaultValue: null, type: 'object', attributes: geometryAttributes },//Définition de la géométrie. Pour éviter les temps de chargement, il est conseillé d’utiliser les primitives ("Box", "Sphere", "Cylinder", etc). Voir la doc Threejs.
        { name: 'material', defaultValue: null, type: 'object', attributes: materialAttributes }
    ];
    
    this.object = {};
    
    this.type = 'Object3d';
    
    if( object !== undefined ) this.load(object);
};

Object3d.prototype = {
    
    isValid: function(){
        
        if( this.object == null ) return false;
        if( this.object.uuid == undefined ) return false;
        
        return true;
        
    },
    parse: function( string ){
        
        try {
            
            var object = JSON.parse( string );
            this.object = this.load( object );
            
        } catch ( e ){
            
            if( e ) console.error( e );
            return null;
            
        }
        
    },
    load: function( object ){
        
        var self = this;
        
        function traverse( object, attr ){
            
            var value;
            
            if( object[attr.name] === undefined ){
                
                if( attr.defaultValue ){
                    
                    object[attr.name] = attr.defaultValue;
                    
                }
                
            } else {
                
                if( attr.attributes !== undefined ){
                    value = {};
                    
                    attr.attributes.forEach(function(subAttr){
                        
                        value[subAttr.name] = traverse(object[attr.name], subAttr);
                        
                    });
                    
                    console.log("subAttr", object[attr.name], attr.attributes, value);
                } else {
                    
                    value = object[attr.name];
                    
                    if(attr.name == 'color') value = value.replace('#','0x');
                    
                }
            }
            return value;
        }
        
        this.attributes.forEach(function(attr){
            
            var value = traverse( object, attr );
            
            if( value !== undefined )
                self.object[attr.name] = value;
            
            console.log("attr", attr.name, value );
        });
        
        return this.object;
    },
    
    toJSON: function(){
        
        var obj = {};
        
        for(var key in this.object){
            
            if( this.object[key] ) obj[key] = this.object[key];
            
        }
        
        return obj;
        
    }
}