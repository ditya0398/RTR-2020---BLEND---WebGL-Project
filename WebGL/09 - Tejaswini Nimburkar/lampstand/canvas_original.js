//global variable
var gl = null;  // webgl context
var bFullscreen = false;
var canvas_orignal_width;
var canvas_orignal_height;

const WebGLMacros =
{
    tvn_ATTRIBUTE_VERTEX: 0,
    tvn_ATTRIBUTE_COLOR: 1,
    tvn_ATTRIBUTE_NORMAL: 2,
    tvn_ATTRIBUTE_TEXTURE: 3
};


var tvn_vertexShaderObject;
var tvn_fragmentShaderObject;
var tvn_shaderProgramObject;

var tvn_vao;
var tvn_vbo;
var tvn_vbo_color;
var tvn_mvpUniform;
var angle1;
var vertices = new Float32Array(37680);
var radius = 0.04;
var i = 0;
var textureSamplerUniform;

var orthographicProjectionMatrix;
var pyramid_texture;

//To start animation: To have requestAnimation() to be called "cross-browser" compatible
var tvn_requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

//To stop animation : to have cancelAnimationFrame() to be called "cross-browser" compatible
var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame;

// onload function
function main() {
    // get canvas element
    canvas = document.getElementById("tvn");
    if (!canvas)
        console.log("Obtaining Canvas Failed\n");
    else
        console.log("Obtaining Canvas Succeeded\n");
    canvas_orignal_width = canvas.width;
    canvas_orignal_height = canvas.height;

    //register keyboard's keydown event handler
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("click", mouseDown, false);
    window.addEventListener("resize", resize, false);

    //initialize WebGL
    init();

    // start drawing here as warming-up
    resize();
    draw();
}

function toggleFullScreen() {
    //code 
    var fullscreen_element =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement ||
        null;

    //if not fullscreen
    if (fullscreen_element == null) {
        if (canvas.requestFullScree)
            canvas.requestFullScree();
        else if (canvas.mozRequestFullScreen)
            canvas.mozRequestFullScreen();
        else if (canvas.webkitRequestFullscreen)
            canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen)
            canvas.msRequestFullscreen();
        bFullscreen = true;
    }
    else // if already fullscreen
    {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        bFullscreen = false;
    }
}

function init() {
    // code 
    // get WebGL 2.0 context 
    gl = canvas.getContext("webgl2");
    if (gl == null) // failed to get context
    {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    /*************Cylinder **********************/
    for (angle1 = 0.0; angle1 < 2 * 3.14; angle1 = angle1 + 0.001) {
        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = (1.0);
        vertices[i++] = (Math.sin(angle1) * radius);

        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = -2.0;
        vertices[i++] = (Math.sin(angle1) * radius);

    }

    console.log("vertices " + vertices.length);
    console.log("vertices[i] " + i);
    //vertex shade
   var vertexShaderSourcedCode =
    "#version 300 es" +
    "\n" +
       "in vec4 vPosition;" +
       "in vec2 vtexCoord;" +
       "uniform mat4 u_mvp_matrix;" +
       "out vec2 out_tex_coord;" +

    "void main(void)" +
    "{" +
       "gl_Position = u_mvp_matrix * vPosition;" +  
       
        "out_tex_coord.x = vPosition.x;" +
    "out_tex_coord.y = vPosition.y;" +

    "}";

    tvn_vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(tvn_vertexShaderObject, vertexShaderSourcedCode);
    gl.compileShader(tvn_vertexShaderObject);
    if (gl.getShaderParameter(tvn_vertexShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_vertexShaderObject);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //fragemnt shader
    var fragmentShaderSourceCode =
    "#version 300 es" +
    "\n" +
        "precision highp float;" +
        "in vec2 out_tex_coord;" +
        "uniform sampler2D u_texture_sampler;" +
    "out vec4 fragColor;" +
    "void main(void)" +
    "{" +
        "fragColor =  texture(u_texture_sampler, out_tex_coord);" +
        
    "}";

    tvn_fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(tvn_fragmentShaderObject, fragmentShaderSourceCode);
    gl.compileShader(tvn_fragmentShaderObject);
    if (gl.getShaderParameter(tvn_fragmentShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(tvn_fragmentShaderObject);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //shader program 
    tvn_shaderProgramObject = gl.createProgram();
    gl.attachShader(tvn_shaderProgramObject, tvn_vertexShaderObject);
    gl.attachShader(tvn_shaderProgramObject, tvn_fragmentShaderObject);

    //pre-link binding of shader program object with vertex shader attributes
    gl.bindAttribLocation(tvn_shaderProgramObject, WebGLMacros.tvn_ATTRIBUTE_VERTEX, "vPosition");
  

    //linking 
    gl.linkProgram(tvn_shaderProgramObject);
    if (!gl.getProgramParameter(tvn_shaderProgramObject, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(tvn_shaderProgramObject);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //get MVP uniform location
    tvn_mvpUniform = gl.getUniformLocation(tvn_shaderProgramObject, "u_mvp_matrix");
    textureSamplerUniform = gl.getUniformLocation(tvn_shaderProgramObject, "u_texture_sampler");

    // ** vertices , color , shader attribs, vbo initialization***
    var triangleVertices = new Float32Array([
        0.0, 1.0, 0.0,  //appex
        -1.0, -1.0, 0.0,   //left-bottom
        1.0, -1.0, 0.0  // right-bottom
    ]);

    var triangleColor = new Float32Array([1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ]);

    tvn_vao = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao);

    /*************position*****************************/
    tvn_vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.tvn_ATTRIBUTE_VERTEX,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(WebGLMacros.tvn_ATTRIBUTE_VERTEX); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);

    pyramid_texture = gl.createTexture();
    pyramid_texture.image = new Image();
    pyramid_texture.image.src = "stone.png";

    pyramid_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, pyramid_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pyramid_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }//lambda, closure


    /*********************************************************/
    //set clear color 
    gl.clearColor(0.0, 0.0, 0.0, 1.0); //blue 

    //inidialize projection matrix
    perspectiveProjectionMatrix = mat4.create();
}

function resize() {
    //code 
    if (bFullscreen == true) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else {
        canvas.width = canvas_orignal_width;
        canvas.height = canvas_orignal_height;
    }

    //set the viewport to match
    gl.viewport(0, 0, canvas.width, canvas.height);


    mat4.perspective(perspectiveProjectionMatrix, 45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 100.0);

}

function draw() {
    //code 
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(tvn_shaderProgramObject);

    var modelViewMatrix = mat4.create();
    
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -4.0]);//resulting matrix, act on the matrix, open square bracket

    var modelViewProjectionMatrix = mat4.create(); // tayar hi honar and indentity matrix la inidilization pan karnar  
    mat4.multiply
        (modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(tvn_mvpUniform, false, modelViewProjectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pyramid_texture);
    gl.uniform1i(textureSamplerUniform, 0);
    

    gl.bindVertexArray(tvn_vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);
    

        
    gl.bindVertexArray(null);



    gl.useProgram(null);
    //animation loop
    requestAnimationFrame(draw, canvas);
}

function uninitialize() {
    //code
    if (tvn_vao) {
        gl.deleteVertexArary(tvn_vao);
        tvn_vao = null;
    }

    if (tvn_vbo) {
        gl.deleteBuffer(tvn_vbo);
        tvn_vbo = null;
    }

    if (tvn_shaderProgramObject) {
        if (tvn_fragmentShaderObject) {
            gl.detachShader(tvn_shaderProgramObject, tvn_fragmentShaderObject);
            gl.deleteShader(tvn_fragmentShaderObject);
            tvn_fragmentShaderObject = null;
        }

        if (tvn_vertexShaderObject) {
            gl.detachShader(tvn_shaderProgramObject, tvn_vertexShaderObject);
            gl.deleteShader(tvn_vertexShaderObject);
            tvn_vertexShaderObject = null;
        }

        gl.deleteProgram(tvn_shaderProgramObject);
        tvn_shaderProgramObject = null;
    }
}

function keyDown(event) {
    //code
    switch (event.keyCode) {
        case 27: // escape 
            //unitialize
            uninitialize();
            //close our application's tab
            window.close(); // may not work in firefox but work in safari and chrome 
            break;
        case 70: // for 'F' or 'f'
            toggleFullScreen();
            break;
    }
}

function mouseDown() {
    //code
}