<h1>TEDi-request</h1>

<p>Tedi-request est un outil qui permet d&#39;alimenter facilement un projet en donn&eacute;es sur tedi.twistengine.com. TEDi se base sur un m&eacute;lange technologie&nbsp;Websocket et WebGL qui permet de connecter un projet 3D &agrave; des utilisateurs distants et des objets connect&eacute;s en temps r&eacute;el.</p>

<p>TEDi est d&eacute;velopp&eacute; par TWISTENGINE. Plus d&#39;infos sur : <a href="http://twistengine.com">http://twistengine.com</a></p>
#### Client side

```html
<script>
  var socket = io.connect('http://localhost');

  socket.on('connect', function () {
    socket.emit('set nickname', prompt('What is your nickname?'));
    socket.on('ready', function () {
      console.log('Connected !');
      socket.emit('msg', prompt('What is your message?'));
    });
  });
</script>
```
```js
var io = require('socket.io').listen(80);

var chat = io
  .of('/chat')
  .on('connection', function (socket) {
    socket.emit('a message', { that: 'only', '/chat': 'will get' });
    chat.emit('a message', { everyone: 'in', '/chat': 'will get' });
  });

var news = io
  .of('/news');
  .on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
  });
```
<h2>Documentation</h2>

<p>Toute la documentation sur TEDi et l&#39;API se trouve sur le site <a href="https://tedi.twistengine.com/documentation">https://tedi.twistengine.com/documentation</a>.</p>

<h2>Support</h2>

<p>Pour toute question relative &agrave; l&#39;utilisation de l&#39;outil, il faut se rendre sur la page r&eacute;serv&eacute;e aux utilisateurs inscrits :&nbsp;<a href="https://tedi.twistengine.com/support">https://tedi.twistengine.com/support</a>.</p>

<h2>Installation</h2>

<p>L&#39;API n&eacute;cessite l&#39;installation pr&eacute;alable de node.js</p>

<div class="highlight highlight-source-shell">
<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
$ npm install tedi-request</pre>
</div>

<h2>Utilisation</h2>

<p>Pour alimenter un projet, l&#39;API envoie sur le site une commande qui contient la cl&eacute; priv&eacute;e, l&#39;ID du projet &agrave; alimenter ainsi que la commande de modification. La cl&eacute; priv&eacute;e peut &ecirc;tre g&eacute;n&eacute;r&eacute;e dans l&#39;espace priv&eacute; de chaque utilisateur de TEDi.&nbsp;</p>

<p>C&ocirc;t&eacute; serveur :</p>

```js
var tedi = require('tedi-request');

tedi.setCredentials({
  email:'jon.doe@mail.com',
  secretAccessKey:'XXXXXX_XXXX_XXXXXX'
});

var projectId = 'XXXXXXXXX';
tedi.setProjectId( projectId );

//Exemple de commande
var command = {
  name: 'AddObjectCommand',
  value: {
    uuid: '12345678',
    type: 'Icon',
    name: 'Hello world',
    message: 'hello',
    position: {
      x: '1',
      y: '1',
      z: '1'
    }
  }
}

//Envoi de la commande
tedi.sendCommand( command, function(error, result){       
  if(error !== undefined){
    console.log(error);
  } else {
    console.log(result);
  }
});
```

<h3>C&ocirc;t&eacute; client :</h3>

<p>Afin de voir le r&eacute;sultat de vos actions vous pouvez int&eacute;grer une vue 3D &agrave; votre site web.</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
&lt;iframe width=&#39;600&#39; height=&#39;300&#39; src=&#39;https://tedi.twistengine.com/3d/embed/YOUR_PROJECT_ID?key=YOUR_PUBLIC_KEY&#39; frameborder=&#39;0&#39; allowfullscreen&gt;&lt;/iframe&gt;
</pre>

<h3>Les commandes&nbsp;:</h3>

<p>Set Object Value</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetValueCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         attributeName:&#39;xxxxx&#39;,
&nbsp;        value:&#39;xxxx&#39;,
    }
}</pre>

<p>Set Position</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetPositionCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         x:&#39;x.x&#39;,
         y:&#39;x.x&#39;,
         z:&#39;x.x&#39;
    }
}</pre>

<p>Set Rotation</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetRotationCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         x:&#39;x.x&#39;,
         y:&#39;x.x&#39;,
         z:&#39;x.x&#39;, 
&nbsp;        order:&#39;XYZ&#39;
    }
}</pre>

<p>Set Scale</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetScaleCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         x:&#39;x.x&#39;,
         y:&#39;x.x&#39;,
         z:&#39;x.x&#39;
    }
}
</pre>

<p>Set Uuid</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetUuidCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         newUuid:&#39;xxxxx&#39;
    }
}</pre>

<p>Set Material Map</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetMaterialValueCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         materialIndex: x,
         mapName:&#39;xxxxx&#39;,
         url:&#39;https://xxxxx&#39;
    }
}</pre>

<p>Set Material</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetMaterialCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         materialIndex: x,
         material:&#39;xxxxx&#39;
    }
}
</pre>

<p>Set Material Value</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetMaterialValueCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         materialIndex: x,
         attributeName:&#39;xxxxx&#39;,
         value:&#39;xxxxx&#39;
    }
}</pre>

<p>Set Material Color</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;SetMaterialValueCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;,
         materialIndex: x,
         attributeName:&#39;xxxxx&#39;,
         color:&#39;#666666&#39;
    }
}</pre>

<p>Remove Object</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;RemoveObjectCommand&#39;,
    values: {
         uuid:&#39;xxxxx&#39;
    }
}</pre>

<p>Add Preset</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;AddPresetCommand&#39;,
    values: {
         name:&#39;xxxxx&#39;
    }
}</pre>

<p>Add Object</p>

<pre style="background: rgb(238, 238, 238); border: 1px solid rgb(204, 204, 204); padding: 5px 10px;">
{
    name: &#39;AddObjectCommand&#39;,
    values: {
         object3d
    }
}</pre>

<h2>License</h2>

<p>Copyright (c) 2017&nbsp;Twist Engine &lt;<a href="mailto:contact@twistengine.com">contact@twistengine.com</a>&gt;</p>

<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &#39;Software&#39;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>

<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>

<p>THE SOFTWARE IS PROVIDED &#39;AS IS&#39;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
