

var grgVertexShaderObjectCamera;
var grgFragmentShadeerObjectCamera;
var grgShaderProgramObjectCamera;

var grgVaoCamera;
var grgVboCamera;
var grgVboTextureCamera;

var grtransCameraX = 6.9;
var grtransCameraY = 0.84;
var grtransCameraZ = -14.9;
var grfangleCameraX = 0.0;
var grfangleCameraY = 0.0;
var grfangleCameraZ = 0.0;


// texture
var grtextureCameraFront;
var grtextureCameraBack;
var grgtextureSamplerUniformCamera;

var grgModelMatrixUniform;
var grgViewMatrixUniform;
var grgProjectionMatrixUniformCamera;
var grgDistortionUniformCamera;

var grstackMatrixCamera = [];
var grmatrixPositionCamera = -1;

function GRInitCamera()
{





     // vertex shader
     var grvertexShaderSourceCode = 
     "#version 300 es" +
     "\n" +
     "in vec4 vPosition;" +
     "in vec2 vTexCoord;" +
     "uniform mat4 u_model_matrix;" +
     "uniform mat4 u_view_matrix;" +
     "uniform mat4 u_projection_matrix;" +
     "out vec2 out_texcoord;" +
     "void main(void)" +
     "{" +
     "gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;" +
     "out_texcoord = vTexCoord;" +
     "}";
 
     grgVertexShaderObjectCamera = gl.createShader(gl.VERTEX_SHADER);
     gl.shaderSource(grgVertexShaderObjectCamera, grvertexShaderSourceCode);
     gl.compileShader(grgVertexShaderObjectCamera);
     if(gl.getShaderParameter(grgVertexShaderObjectCamera, gl.COMPILE_STATUS) == false)
     {
         var error = gl.getShaderInfoLog(grgVertexShaderObjectCamera);
         if(error.length > 0)
         {
             alert(error);
             uninitialize();
         }
         alert("in compile vertex shader error");
 
     }
 
     var grfragmentShaderSourceCode = 
     "#version 300 es" +
     "\n" +
     "precision highp float;" +
     "in vec2 out_texcoord;" +
     "uniform highp sampler2D u_texture_sampler;" +
     "uniform float distortion;" +
     "out vec4 FragColor;" +
     "void main(void)" +
     "{" +
     "FragColor = texture(u_texture_sampler, out_texcoord);" +
     "vec3 gray = vec3(dot(vec3(FragColor), vec3(0.2126, 0.7152, 0.0722)));" +
     "FragColor = vec4(mix(vec3(FragColor), gray, distortion), 1.0);" +
     "}";
 
     grgFragmentShaderObjectCamera = gl.createShader(gl.FRAGMENT_SHADER);
     gl.shaderSource(grgFragmentShaderObjectCamera, grfragmentShaderSourceCode);
     gl.compileShader(grgFragmentShaderObjectCamera);
     if(gl.getShaderParameter(grgFragmentShaderObjectCamera, gl.COMPILE_STATUS) == false)
     {
         var error = gl.getShaderInfoLog(grgFragmentShaderObjectCamera);
         if(error.length > 0)
         {
             alert(error);
             uninitialize(); 
         }
         alert("in compile fragment shader error");
         
     }
 
     // shader program
     grgShaderProgramObjectCamera = gl.createProgram();
     //attach shader object
     gl.attachShader(grgShaderProgramObjectCamera, grgVertexShaderObjectCamera);
     gl.attachShader(grgShaderProgramObjectCamera, grgFragmentShaderObjectCamera);
     // pre-linking
     gl.bindAttribLocation(grgShaderProgramObjectCamera, macros.AMC_ATTRIB_POSITION, "vPosition");
     gl.bindAttribLocation(grgShaderProgramObjectCamera, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");
 
     // linking
     gl.linkProgram(grgShaderProgramObjectCamera);
     if(!gl.getProgramParameter(grgShaderProgramObjectCamera, gl.LINK_STATUS))
     {
         var err = gl.getProgramInfoLog(grgShaderProgramObjectCamera);
         if(err.length > 0)
         {
             alert(err);
             
         }
         
         alert("in shader program object error");
         alert(err);
        // uninitialize(); 
     }
 
     // mvp uniform binding
     grgModelMatrixUniform = gl.getUniformLocation(grgShaderProgramObjectCamera, "u_model_matrix");
     grgViewMatrixUniform = gl.getUniformLocation(grgShaderProgramObjectCamera, "u_view_matrix");
     grgProjectionMatrixUniformCamera = gl.getUniformLocation(grgShaderProgramObjectCamera, "u_projection_matrix");
     grgtextureSamplerUniformCamera = gl.getUniformLocation(grgShaderProgramObjectCamera, "u_texture_sampler");
     grgDistortionUniformCamera = gl.getUniformLocation(grgShaderProgramObjectCamera, "distortion");
 
   
 
     var grcubeTexcoords = new Float32Array(
         [
             0.0, 0.0,		// right		
             1.0, 0.0,
             1.0, 1.0,
             0.0, 1.0,

             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
     
             1.0, 0.0,  // left
             0.0, 0.0,
             0.0, 1.0,
             1.0, 1.0,
     
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,

             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
     
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
             0.3, 0.5,
         ]
     );
 
     var grcubeVertices = new Float32Array(
         [
             1.0, 1.0, 1.0,
             -1.0, 1.0, 1.0,
             -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
                                                 // right face
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0, -1.0, -1.0,
                                                 // back face
             -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, -1.0, -1.0,
             -1.0, -1.0, -1.0,
                                                 // left face
             -1.0, 1.0, 1.0,
             -1.0, 1.0, -1.0,
             -1.0, -1.0, -1.0,
             -1.0, -1.0, 1.0,
                                                 // top face
             1.0, 1.0, -1.0,
             -1.0, 1.0, -1.0,
             -1.0, 1.0, 1.0,
             1.0, 1.0, 1.0,
                                                 // bottom face
             1.0, -1.0, -1.0,
             -1.0, -1.0, -1.0,
             -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0
         ]
     );
 
     // radio
     grgVaoCamera = gl.createVertexArray();
     gl.bindVertexArray(grgVaoCamera);
 
     grgVboCamera = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboCamera);
     gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
     grgVboTextureCamera = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboTextureCamera);
     gl.bufferData(gl.ARRAY_BUFFER, grcubeTexcoords, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     
     gl.bindVertexArray(null);
 

     // texture for radio
     grtextureCameraFront = gl.createTexture();
     grtextureCameraFront.image = new Image();
     grtextureCameraFront.image.src = "GauriResources/camera_front.jpg";
     grtextureCameraFront.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grtextureCameraFront);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grtextureCameraFront.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     };
     grtextureCameraBack = gl.createTexture();
     grtextureCameraBack.image = new Image();
     grtextureCameraBack.image.src = "GauriResources/camera_back.jpg";
     grtextureCameraBack.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grtextureCameraBack);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grtextureCameraBack.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     };
}


function GRDisplayCamera()
{
    // variables
    var grmodelMatrix = mat4.create();
    var grviewMatrix = mat4.create();
    var grprojectionMatrix = mat4.create();
    var grscaleMatrix = mat4.create();
    var grtranslateMatrix = mat4.create();
    var grrotateMatrix = mat4.create();

   

    gl.useProgram(grgShaderProgramObjectCamera);

    gl.uniform1f(grgDistortionUniformCamera, blackWhiteDistortion)
    //************************************************************************************************ roadside ********************************************************
    //***************************************************************************************************************************************************************
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grtransCameraX, grtransCameraY, grtransCameraZ]);
   mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleCameraY));
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleCameraX));
    mat4.scale(grscaleMatrix, grscaleMatrix, [1.0, 0.5, 0.2]);
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);

    GRPushToStack(grmodelMatrix);

    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);
    
    gl.uniformMatrix4fv(grgModelMatrixUniform, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniform, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformCamera, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureCameraFront);
    gl.uniform1i(grgtextureSamplerUniformCamera, 0);

    gl.bindVertexArray(grgVaoCamera);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grtextureCameraBack);
    gl.uniform1i(grgtextureSamplerUniformCamera, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    GRPopFromStack();

    gl.useProgram(null);

}

function GRPushToStack(matrix)
{
    if(grmatrixPositionCamera == -1)
    {
        grstackMatrixCamera.push(matrix);
        grmatrixPositionCamera++;
        return matrix;
    }
    else
    {
        var topMatrix = grstackMatrixCamera[grmatrixPositionCamera];
        mat4.multiply(matrix, topMatrix, matrix);
        grstackMatrixCamera.push(matrix);
        grmatrixPositionCamera++;
        return grstackMatrixCamera[grmatrixPositionCamera];
    }
  
}

function GRPopFromStack()
{
    if(!grstackMatrixCamera[0])
    {
        grstackMatrixCamera[0] = mat4.create();
        return grstackMatrixCamera[0];
    }
    else
    {
        grstackMatrixCamera.pop();
        grmatrixPositionCamera--;
        return grstackMatrixCamera[grmatrixPositionCamera];
    }
    
}


function GRUninitializeCamera()
{
    if(grgVaoCamera)
    {
        gl.deleteVertexArray(grgVaoCamera);
        grgVaoCamera = null;
    }
    if(grgVboCamera)
    {
        gl.deleteBuffer(grgVboCamera);
        grgVboCamera = null;
    }
    if(grtextureCameraFront)
    {
        gl.deleteTexture(grtextureCameraFront);
        grtextureCameraFront = null;
    }
    if(grtextureCameraBack)
    {
        gl.deleteTexture(grtextureCameraBack);
        grtextureCameraBack = null;
    }

    if(grgShaderProgramObjectCamera)
    {
        if(grgFragmentShaderObjectCamera)
        {
            gl.detachShader(grgShaderProgramObjectCamera, grgFragmentShaderObjectCamera);
            gl.deleteShader(grgFragmentShaderObjectCamera);
            grgFragmentShaderObjectCamera = null;
        }

        if(grgFragmentShaderObjectCamera)
        {
            gl.detachShader(grgShaderProgramObjectCamera, grgVertexShaderObjectCamera);
            gl.deleteShader(grgVertexShaderObjectCamera);
            grgVertexShaderObjectCamera = null;
        }

        gl.deleteProgram(grgShaderProgramObjectCamera);
        grshaderProgramObject = null;
    }
}












