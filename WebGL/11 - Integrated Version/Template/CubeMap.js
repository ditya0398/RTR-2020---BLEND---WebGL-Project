var CubeMapShaderProgramObject;

var vao_DM;
var Vertices_Vbo_DM;
var Texture_Vbo_DM;
var mvpUniform_DM;

var kundali_Texture;
var hFront;
var hBack;
var hLeft;
var hRight;
var hTop;
var hBottom;

var CubeMap_Texture_ID;

var CubeMap_texture_Sampler_Uniform;



function initCubeMap()
{

    var vertexShaderObject;
    var fragmentShaderObject;
    
    /* VertexShaderObject */
    var VertexShaderSourceCode =
        "#version 300 es                \n" +
        "in vec3 vPosition;             \n" +
		"out vec3 out_TexCoord;         \n" +
		"uniform mat4 u_mvp_matrix;     \n" +
		"void main(void){               \n" +
		"gl_Position = u_mvp_matrix * vec4(vPosition, 1.0f);\n" +
		"out_TexCoord = normalize(vPosition);             \n" +
        "out_TexCoord = vec3(clamp(out_TexCoord.x, -1.0, 1.0), clamp(out_TexCoord.y, -1.0, 1.0), clamp(out_TexCoord.z, -1.0, 1.0));\n"+
        "}";

    vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, VertexShaderSourceCode);
    gl.compileShader(vertexShaderObject);

    if (gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(vertexShaderObject);
        if (error.length > 0) {
            console.log("after vertex shader code compile.");

            alert(error)
            unInitilize();
        }
    }
    /* Fragment shader code */

    var fragmentShaderSourceCode =
        "#version 300 es                \n" +
        "precision highp float;         \n" +
        "uniform highp samplerCube u_Texture_Sampler;\n" +
        "in vec3 out_TexCoord;          \n" +
		"out vec4 FragColor;            \n" +
		"void main(void){               \n" +
		"FragColor = texture(u_Texture_Sampler, normalize(out_TexCoord));\n" +
        "}";

    fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderSourceCode);
    gl.compileShader(fragmentShaderObject);

    if (gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(fragmentShaderObject);
        if (error.length > 0) {
            alert(error)
            unInitilize();
        }
    }

    /* Shader Linking  */

    CubeMapShaderProgramObject = gl.createProgram();
    gl.attachShader(CubeMapShaderProgramObject, vertexShaderObject);
    gl.attachShader(CubeMapShaderProgramObject, fragmentShaderObject);

    gl.bindAttribLocation(CubeMapShaderProgramObject, macros.AMC_ATTRIB_POSITION, "vPosition");


    gl.linkProgram(CubeMapShaderProgramObject);
    if (!gl.getProgramParameter(CubeMapShaderProgramObject, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(CubeMapShaderProgramObject);
        if (error.length > 0) {
            alert(error);
            unInitilize();
        }
    }

    mvpUniform_DM = gl.getUniformLocation(CubeMapShaderProgramObject, "u_mvp_matrix");
    CubeMap_texture_Sampler_Uniform = gl.getUniformLocation(CubeMapShaderProgramObject,"u_Texture_Sampler");

    var CubeVertices = new Float32Array([
        -30.0,  30.0, -30.0,
        -30.0, -30.0, -30.0,
         30.0, -30.0, -30.0,
         30.0, -30.0, -30.0,
         30.0,  30.0, -30.0,
        -30.0,  30.0, -30.0,
    
        -30.0, -30.0,  30.0,
        -30.0, -30.0, -30.0,
        -30.0,  30.0, -30.0,
        -30.0,  30.0, -30.0,
        -30.0,  30.0,  30.0,
        -30.0, -30.0,  30.0,
    
         30.0, -30.0, -30.0,
         30.0, -30.0,  30.0,
         30.0,  30.0,  30.0,
         30.0,  30.0,  30.0,
         30.0,  30.0, -30.0,
         30.0, -30.0, -30.0,
    
        -30.0, -30.0,  30.0,
        -30.0,  30.0,  30.0,
         30.0,  30.0,  30.0,
         30.0,  30.0,  30.0,
         30.0, -30.0,  30.0,
        -30.0, -30.0,  30.0,
    
        -30.0,  30.0, -30.0,
         30.0,  30.0, -30.0,
         30.0,  30.0,  30.0,
         30.0,  30.0,  30.0,
        -30.0,  30.0,  30.0,
        -30.0,  30.0, -30.0,
    
        -30.0, -30.0, -30.0,
        -30.0, -30.0,  30.0,
         30.0, -30.0, -30.0,
         30.0, -30.0, -30.0,
        -30.0, -30.0,  30.0,
         30.0, -30.0,  30.0
        ]);


    vao_DM = gl.createVertexArray();
    gl.bindVertexArray(vao_DM);

    Vertices_Vbo_DM = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, Vertices_Vbo_DM);
    gl.bufferData(gl.ARRAY_BUFFER, CubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,3,gl.FLOAT,false, 0, 0);

    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);    
    LoadCubeMapTextures();
}

var angle = 0.0
function Display_CubeMap() {
    
    gl.useProgram(CubeMapShaderProgramObject);

    var modelViewMatrix = viewMatrix_Scene3
    var modelViewProjectionMatrix = mat4.create();
    var XRotationMatrix = mat4.create();

    mat4.identity(modelViewMatrix);
    mat4.identity(modelViewProjectionMatrix);
    mat4.identity(XRotationMatrix);

    mat4.rotateX(XRotationMatrix, XRotationMatrix, Math.PI)
    mat4.rotateY(XRotationMatrix, XRotationMatrix, angle);

    mat4.multiply(modelViewMatrix, modelViewMatrix, XRotationMatrix);
    
    mat4.multiply(modelViewProjectionMatrix, perspectiveMatrix, modelViewMatrix);
    
    gl.uniformMatrix4fv(mvpUniform_DM, false, modelViewProjectionMatrix);
    
    gl.activeTexture(gl.TEXTURE0);
    
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);

    gl.uniform1i(CubeMap_texture_Sampler_Uniform, 0);

    gl.bindVertexArray(vao_DM);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawArrays(gl.TRIANGLES, 6, 6);
    gl.drawArrays(gl.TRIANGLES, 12, 6);
    gl.drawArrays(gl.TRIANGLES, 18, 6);
    gl.drawArrays(gl.TRIANGLES, 24, 6);
    gl.drawArrays(gl.TRIANGLES, 30, 6);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    gl.bindVertexArray(null);
    gl.useProgram(null);

    // update();
    if(gbAnim) {
        angle += 0.01
    }

}
function LoadCubeMapTextures() {

    CubeMap_Texture_ID = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_BASE_LEVEL, 0); 
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LEVEL, 0); 
        
if(1)
{
    hFront = new Image();
    hFront.src = "DarshanResources/pz.png";
    hFront.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hFront);
    
    } 

    hBack = new Image();
    hBack.src = "DarshanResources/nz.png";
    hBack.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hBack);
    }   

    hLeft = new Image();
    hLeft.src = "DarshanResources/nx.png";
    hLeft.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hLeft);
    } 

    hRight = new Image();
    hRight.src = "DarshanResources/px.png";
    hRight.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hRight);

    }

    hTop = new Image();
    hTop.src = "DarshanResources/py.png";
    hTop.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hTop);
    }

    hBottom = new Image();
    hBottom.src = "DarshanResources/ny.png";
    hBottom.onload = function (){
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, CubeMap_Texture_ID);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, hBottom);
    }
}   gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

}