
var canvas = null;
var gl = null;

var original_width;
var original_height;

var angle = 0.05;

var bfullscreen;

const WebGLMicros =
{
    AMC_ATTRIBUTE_VERTEX : 0,
    AMC_ATTRIBUTE_NORMAL : 1,
    AMC_ATTRIBUTE_COLOR : 2,
    AMC_ATTRIBUTE_TEXTURE : 3,

}

var vertexShaderObject;
var fragmentShaderObject;

var perspectiveProjectionMatrix;


var requestAnimation = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    windows.mozRequestAnimationFrame ||
    windows.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var cancleAnimationFrame =
    window.cancleAnimationFrame ||
    window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame ||
    window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||
    window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame ||
    window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame;


function main() {

    canvas = document.getElementById("DVM");

    if (!canvas) {
        console.log("obtaining canvas faild.");
    }
    else {
        console.log("obtaining canvas succeded.");
    }

    original_width = canvas.width;
    original_height = canvas.height;


    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("resize", resize, false);

    init();
    resize();//warm up
    Display_CubeMap();//warm up cause repaint nahi hot.


}

function keyDown(event) {
    switch (event.keyCode) {
        case 70:
            ToggleFullscreen();
            break;
        case 27:
            unInitilize();
            window.close();
            break;
    }
}

function ToggleFullscreen(params) {

    //variable dec
    var fullscreen_element =
        document.fullscreenElement || // chrome, opera mini
        document.webkitFullscreenElement || // (apple)safari
        document.mozFullScreenElement || //modzilla fire fox
        document.msFullscreenElement || //MS edge
        null;

    // aapan screen la full screen aata kartoy.
    if (fullscreen_element == null) {

        if (canvas.requestFullscreen) {
            console.log("Inside the Chrome.");
            canvas.requestFullscreen();
            bfullscreen = true;
        }
        else if (canvas.mozRequestFullScreen) {
            console.log("Inside the Moz.");
            canvas.mozRequestFullScreen();
            fullscreen = true;
        }
        else if (canvas.webkitRequestFullscreen) {
            console.log("Inside the MacOS.");
            canvas.webkitRequestFullscreen();
            bfullscreen = true;
        }
        else if (canvas.msRequestFullscreen) {
            console.log("Inside the MS.");
            canvas.msRequestFullscreen();
            bfullscreen = true;
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            bfullscreen = false;
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            bfullscreen = false;
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
            bfullscreen = false;
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
            bfullscreen = false;
        }
        bfullscreen = false;
    }

}

function init() {

    //this is the most imp change 2d to webgl2
    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("obtaining WebGL2 faild.");
    }
    else {
        console.log("obtaining WebGL2 succeded.");
    }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    // /* VertexShaderObject */
    // var VertexShaderSourceCode =
    //     "#version 300 es                \n" +
    //     "in vec3 vPosition;             \n" +
	// 	"out vec3 out_TexCoord;         \n" +
	// 	"uniform mat4 u_mvp_matrix;     \n" +
	// 	"void main(void){               \n" +
	// 	"gl_Position = u_mvp_matrix * vec4(vPosition, 1.0f);\n" +
	// 	"out_TexCoord = normalize(vPosition);             \n" +
    //     "}";

    // vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vertexShaderObject, VertexShaderSourceCode);
    // gl.compileShader(vertexShaderObject);

    // if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
    //     var error = gl.getShaderInfoLog(vertexShaderObject);
    //     if (error.length > 0) {
    //         console.log("after vertex shader code compile.");

    //         alert(error)
    //         unInitilize();
    //     }
    // }
    // /* Fragment shader code */

    // var fragmentShaderSourceCode =
    //     "#version 300 es                \n" +
    //     "precision highp float;         \n" +
    //     "uniform highp samplerCube u_Texture_Sampler;\n" +
    //     "in vec3 out_TexCoord;          \n" +
	// 	"out vec4 FragColor;            \n" +
	// 	"void main(void){               \n" +
	// 	"FragColor = texture(u_Texture_Sampler, normalize(out_TexCoord));\n" +
    //     "}";

    // fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
    // gl.compileShader(fragmentShaderObject);

    // if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
    //     var error = gl.getShaderInfoLog(fragmentShaderObject);
    //     if (error.length > 0) {
    //         alert(error)
    //         unInitilize();
    //     }
    // }

    // /* Shader Linking  */

    // CubeMapShaderProgramObject = gl.createProgram();
    // gl.attachShader(CubeMapShaderProgramObject, vertexShaderObject);
    // gl.attachShader(CubeMapShaderProgramObject, fragmentShaderObject);

    // gl.bindAttribLocation(CubeMapShaderProgramObject, WebGLMicros.DVM_ATTTRIBUTE_VERTEX, "vPosition");


    // gl.linkProgram(CubeMapShaderProgramObject);
    // if (!gl.getProgramParameter(CubeMapShaderProgramObject, gl.LINK_STATUS)) {
    //     var error = gl.getProgramInfoLog(CubeMapShaderProgramObject);
    //     if (error.length > 0) {
    //         alert(error);
    //         unInitilize();
    //     }
    // }

    // mvpUniform_DM = gl.getUniformLocation(CubeMapShaderProgramObject, "u_mvp_matrix");
    // CubeMap_texture_Sampler_Uniform = gl.getUniformLocation(CubeMapShaderProgramObject,"u_Texture_Sampler");

    // var CubeVertices = new Float32Array([
    //     -4.0,  4.0, -4.0,
    //     -4.0, -4.0, -4.0,
    //      4.0, -4.0, -4.0,
    //      4.0, -4.0, -4.0,
    //      4.0,  4.0, -4.0,
    //     -4.0,  4.0, -4.0,
    
    //     -4.0, -4.0,  4.0,
    //     -4.0, -4.0, -4.0,
    //     -4.0,  4.0, -4.0,
    //     -4.0,  4.0, -4.0,
    //     -4.0,  4.0,  4.0,
    //     -4.0, -4.0,  4.0,
    
    //      4.0, -4.0, -4.0,
    //      4.0, -4.0,  4.0,
    //      4.0,  4.0,  4.0,
    //      4.0,  4.0,  4.0,
    //      4.0,  4.0, -4.0,
    //      4.0, -4.0, -4.0,
    
    //     -4.0, -4.0,  4.0,
    //     -4.0,  4.0,  4.0,
    //      4.0,  4.0,  4.0,
    //      4.0,  4.0,  4.0,
    //      4.0, -4.0,  4.0,
    //     -4.0, -4.0,  4.0,
    
    //     -4.0,  4.0, -4.0,
    //      4.0,  4.0, -4.0,
    //      4.0,  4.0,  4.0,
    //      4.0,  4.0,  4.0,
    //     -4.0,  4.0,  4.0,
    //     -4.0,  4.0, -4.0,
    
    //     -4.0, -4.0, -4.0,
    //     -4.0, -4.0,  4.0,
    //      4.0, -4.0, -4.0,
    //      4.0, -4.0, -4.0,
    //     -4.0, -4.0,  4.0,
    //      4.0, -4.0,  4.0
    //     ]);


    // vao_DM = gl.createVertexArray();
    // gl.bindVertexArray(vao_DM);

    // Vertices_Vbo_DM = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, Vertices_Vbo_DM);
    // gl.bufferData(gl.ARRAY_BUFFER, CubeVertices, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(WebGLMicros.DVM_ATTTRIBUTE_VERTEX,
    //     3,
    //     gl.FLOAT,
    //     false, 0, 0);

    // gl.enableVertexAttribArray(WebGLMicros.DVM_ATTTRIBUTE_VERTEX);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // gl.bindVertexArray(null);

    //gl.enable(gl.CULL_FACE);

    initCubeMap();
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque

    perspectiveProjectionMatrix = mat4.create();
    mat4.identity(perspectiveProjectionMatrix);
    
  //  LoadCubeMapTextures();

    resize();
}

function LoadCubeMapTextures() {

    CubeMap_Texture_ID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);

if(1)
{
    hFront = new Image();
    hFront.src = "Resources/pz.jpg";
    hFront.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hFront);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    } 

    hBack = new Image();
    hBack.src = "Resources/nz.jpg";
    hBack.onload = function (){

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hBack);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    }   

    hLeft = new Image();
    hLeft.src = "Resources/nx.jpg";
    hLeft.onload = function (){

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hLeft);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    } 

    hRight = new Image();
    hRight.src = "Resources/px.jpg";
    hRight.onload = function (){

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hRight);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    }

    hTop = new Image();
    hTop.src = "Resources/py.jpg";
    hTop.onload = function (){

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hTop);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    }

    hBottom = new Image();
    hBottom.src = "Resources/ny.jpg";
    hBottom.onload = function (){

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hBottom);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    }
}
    //gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

}

function resize() {

    if (bfullscreen == true) {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    else {
        canvas.width = original_width;
        canvas.height = original_height;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    
    mat4.perspective(perspectiveProjectionMatrix, 
        45.0, 
        parseFloat(canvas.width) / parseFloat(canvas.height), 
        0.1, 
        100.0);
}

function display()
{
    Display_CubeMap();
    requestAnimationFrame(Display_CubeMap, canvas);
}

function degToRad(Degrees)
{
    return (Degrees * Math.PI / 180.0);
}

function update()
{
    angle += 0.01;
    if(angle > 360.0)
    {
        angle = 0.0;
    }
}

function unInitilize() {
    if (vao_DM) {
        gl.deleteVertexArray(vao_DM);
        vao_DM = 0;
    }

    if (Vertices_Vbo_DM) {
        gl.deleteBuffer(Vertices_Vbo_DM);
        Vertices_Vbo_DM = 0;
    }
    if (Texture_Vbo_DM) {
        gl.deleteBuffer(Texture_Vbo_DM);
        Texture_Vbo_DM = 0;
    }

    if (CubeMapShaderProgramObject) {
        if (fragmentShaderObject) {
            gl.detachShader(CubeMapShaderProgramObject, fragmentShaderObject);
            gl.deleteShader(fragmentShaderObject);
            fragmentShaderObject = null;

        }

        if (vertexShaderObject) {
            gl.detachShader(CubeMapShaderProgramObject, vertexShaderObject);
            gl.deleteShader(vertexShaderObject);
            vertexShaderObject = null;
        }
        gl.deleteProgram(CubeMapShaderProgramObject);
        CubeMapShaderProgramObject = null;
    }
}
