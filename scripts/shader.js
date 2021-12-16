const vertexData = [
  -1,1,0,
  1,1,0,
  1,-1,0,
  -1,-1,0
];
const indices = [0,1,2,2,3,0];

var program;
var gl;

function InitShader()
{
  var canvas;


  canvas = document.getElementById('renderer');
  gl = canvas. getContext('webgl');

   if (!gl){
     gl = canvas.getContext('experimental-webgl');
     alert('WebGl not supported, falling back to experimental');
   }
   if (!gl) {
     alert('Your browser doesn not support WebGL');
   }

   gl.clearColor(0.2,0.8,0.8,1.0);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   const vertsBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER,vertsBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData),gl.STATIC_DRAW);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW);

   const vertexShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource (vertexShader,document.getElementById("vertex-shader").text);
   gl.compileShader(vertexShader);

   const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragmentShader,document.getElementById("fragment-shader").text);

   gl.compileShader (fragmentShader);

   program = gl.createProgram();
   gl.attachShader(program,vertexShader);
   gl.attachShader(program, fragmentShader);
   gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program,'vertPosition');
    gl.enableVertexAttribArray (positionLocation);
    gl.vertexAttribPointer (positionLocation,3,gl.FLOAT,false,0,0);
    gl.useProgram(program);

    gl.drawElements(gl.TRIANGLES,indices.length, gl.UNSIGNED_SHORT,0);

}

function UpdateShader(param0,param1,param2,param3,param4,param5,param6,param7,param8,param9)
{
  if (program!=null && gl != null)
  {

    gl.uniform1f(gl.getUniformLocation (program,"cell_density"),param0);
    gl.uniform1f(gl.getUniformLocation (program,"blend"),param1);
    gl.uniform1f(gl.getUniformLocation (program,"edge_one"),param2);
    gl.uniform1f(gl.getUniformLocation (program,"edge_two"),param3);
    gl.uniform1f(gl.getUniformLocation (program,"global_displace_multiplier"),param4);
    gl.uniform1f(gl.getUniformLocation (program,"displacementMapX"),param5);
    gl.uniform1f(gl.getUniformLocation (program,"circle_distortion_factor"),param6);
    gl.uniform1f(gl.getUniformLocation (program,"subdivisions"),param7);
    gl.uniform1f(gl.getUniformLocation (program,"RB_seperation_scale"),param8);
    gl.uniform1f(gl.getUniformLocation (program,"noise_weight"),param9);

    gl.drawElements(gl.TRIANGLES,indices.length, gl.UNSIGNED_SHORT,0);

  }

}
