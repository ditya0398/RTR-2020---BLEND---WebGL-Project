
var grvertexShaderObjectStage;
var grfragmentShaderObjectStage;
var grshaderProgramObjectStage;


var grgVaoStage;
var grgVboStagePosition;
var grgVboStageTexture;

var grgVaoStageWall;
var grgVboStageWallPosition;
var grgVboStageWallTexture;

var grfangleXStage = 0.0;
var grfangleYStage = 0.0;
var grtransStageX = 0.0;
var grtransStageY = 0.0;
var grtransStageZ = -10.0;

// texture
var grgtextureStageFloor;
var grgtextureStageWall;
var grgtextureWings;
var grgtextureSamplerUniformStage;
var grgtextureFloor;

var grgModelMatrixUniformStage;
var grgViewMatrixUniformStage;
var grgProjectionMatrixUniformStage;
var grgDistortionUniformStage;

var grColorUniform;
var grTexCoordPowerUnifrom;

var grstackMatrix = [];
var grmatrixPosition = -1;

function GRInitScene2()
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
     "uniform vec2 u_texCoordPower;" +
     "out vec2 out_texcoord;" +
     "void main(void)" +
     "{" +
     "gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;" +
     "out_texcoord = vTexCoord * u_texCoordPower;" +
     "}";
 
     grvertexShaderObjectStage = gl.createShader(gl.VERTEX_SHADER);
     gl.shaderSource(grvertexShaderObjectStage, grvertexShaderSourceCode);
     gl.compileShader(grvertexShaderObjectStage);
     if(gl.getShaderParameter(grvertexShaderObjectStage, gl.COMPILE_STATUS) == false)
     {
         var error = gl.getShaderInfoLog(grvertexShaderObjectStage);
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
     "uniform vec4 u_color;" +
     "uniform float distortion;" +
     "out vec4 FragColor;" +
     "void main(void)" +
     "{" +
     "FragColor = texture(u_texture_sampler, out_texcoord) * u_color;" +
     "vec3 gray = vec3(dot(vec3(FragColor), vec3(0.2126, 0.7152, 0.0722)));" +
     "FragColor = vec4(mix(vec3(FragColor), gray, distortion), 1.0);" +
     "}";
 
     grfragmentShaderObjectStage = gl.createShader(gl.FRAGMENT_SHADER);
     gl.shaderSource(grfragmentShaderObjectStage, grfragmentShaderSourceCode);
     gl.compileShader(grfragmentShaderObjectStage);
     if(gl.getShaderParameter(grfragmentShaderObjectStage, gl.COMPILE_STATUS) == false)
     {
         var error = gl.getShaderInfoLog(grfragmentShaderObjectStage);
         if(error.length > 0)
         {
             alert(error);
             uninitialize(); 
         }
         alert("in compile fragment shader error");
     }
 
     // shader program
     grshaderProgramObjectStage = gl.createProgram();
     //attach shader object
     gl.attachShader(grshaderProgramObjectStage, grvertexShaderObjectStage);
     gl.attachShader(grshaderProgramObjectStage, grfragmentShaderObjectStage);
     // pre-linking
     gl.bindAttribLocation(grshaderProgramObjectStage, macros.AMC_ATTRIB_POSITION, "vPosition");
     gl.bindAttribLocation(grshaderProgramObjectStage, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");
 
     // linking
     gl.linkProgram(grshaderProgramObjectStage);
     if(!gl.getProgramParameter(grshaderProgramObjectStage, gl.LINK_STATUS))
     {
         var err = gl.getProgramInfoLog(grshaderProgramObjectStage);
         if(err.length > 0)
         {
             alert(err);
             
         }
         
         alert("in shader program object error");
         alert(err);
        // uninitialize(); 
     }
 
     // mvp uniform binding
     grgModelMatrixUniformStage = gl.getUniformLocation(grshaderProgramObjectStage, "u_model_matrix");
     grgViewMatrixUniformStage = gl.getUniformLocation(grshaderProgramObjectStage, "u_view_matrix");
     grgProjectionMatrixUniformStage = gl.getUniformLocation(grshaderProgramObjectStage, "u_projection_matrix");
     grgtextureSamplerUniformStage = gl.getUniformLocation(grshaderProgramObjectStage, "u_texture_sampler");
     grColorUniform = gl.getUniformLocation(grshaderProgramObjectStage, "u_color");
     grTexCoordPowerUnifrom = gl.getUniformLocation(grshaderProgramObjectStage, "u_texCoordPower");
     grgDistortionUniformStage = gl.getUniformLocation(grshaderProgramObjectStage, "distortion");
     
 
     var grstageTexcoords = new Float32Array(
         [
            10.0, 0.0,
            0.0, 1.0,
            0.0, 0.0,
            10.0, 1.0,

             1.0, 0.0,
             1.0, 1.0,
             0.0, 1.0,
             0.0, 0.0,
     
             0.0, 1.0,
             0.0, 0.0,
             1.0, 0.0,
             1.0, 1.0,
     
             0.0, 0.0,
             1.0, 0.0,
             1.0, 1.0,
             0.0, 1.0,
     
             0.0, 1.0,
             0.0, 0.0,
             2.0, 0.0,
             2.0, 1.0,
     
             1.0, 0.0,
             0.0, 0.0,
             0.0, 1.0,
             1.0, 1.0
         ]
     );

     var grcubeTexcoords = new Float32Array(
        [
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,

            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
    
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
    
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
    
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
    
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
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
 
     // stage
     grgVaoStage = gl.createVertexArray();
     gl.bindVertexArray(grgVaoStage);
 
     grgVboStagePosition = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboStagePosition);
     gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
     grgVboStageTexture = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboStageTexture);
     gl.bufferData(gl.ARRAY_BUFFER, grstageTexcoords, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     
     gl.bindVertexArray(null);

     
     // stage wall
     grgVaoStageWall = gl.createVertexArray();
     gl.bindVertexArray(grgVaoStageWall);
 
     grgVboStagePositionWall = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboStagePositionWall);
     gl.bufferData(gl.ARRAY_BUFFER, grcubeVertices, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
     grgVboStageTextureWall = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, grgVboStageTextureWall);
     gl.bufferData(gl.ARRAY_BUFFER, grcubeTexcoords, gl.STATIC_DRAW);
     gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     
     gl.bindVertexArray(null);


     // texture for bench
     grgtextureStageFloor = gl.createTexture();
     grgtextureStageFloor.image = new Image();
     grgtextureStageFloor.image.src = "GauriResources/stage_floor.jpg";
     grgtextureStageFloor.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grgtextureStageFloor);
         //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
         //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grgtextureStageFloor.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     };
     // texture for radio
     grgtextureWings = gl.createTexture();
     grgtextureWings.image = new Image();
     grgtextureWings.image.src = "GauriResources/wing_cloth.jpg";
     grgtextureWings.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
         //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grgtextureWings.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     };

     grgtextureStageWall = gl.createTexture();
     grgtextureStageWall.image = new Image();
     grgtextureStageWall.image.src = "GauriResources/wall.jpg";
     grgtextureStageWall.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grgtextureStageWall);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grgtextureStageWall.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     };

     
     grgtextureFloor = gl.createTexture();
     grgtextureFloor.image = new Image();
     grgtextureFloor.image.src = "GauriResources/floor.jpg";
     grgtextureFloor.image.onload = function()
     {
         gl.bindTexture(gl.TEXTURE_2D, grgtextureFloor);
         //gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
         gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grgtextureFloor.image);
         gl.bindTexture(gl.TEXTURE_2D, null);
     }; 
}


function GRDisplayScene2()
{
  //  console.log("p matrix "+ perspectiveMatrix);
    gl.useProgram(grshaderProgramObjectStage);

   // stage and stage-wing
    GRStage();

    


    gl.useProgram(null);

}

function GRStage()
{
    gl.uniform1f(grgDistortionUniformStage, blackWhiteDistortion)

    var grmodelMatrix = mat4.create();
    var grviewMatrix = mat4.create();
    var grprojectionMatrix = mat4.create();
    var grscaleMatrix = mat4.create();
    var grtranslateMatrix = mat4.create();
    var grrotateMatrix = mat4.create();
    // push matrix for stage geometry
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [grtransStageX, grtransStageY, grtransStageZ]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grtranslateMatrix);
    GRPushToStackScene2(grmodelMatrix);


    //********************************************* stage ***************************************
    //********************************************************************************************
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, -2.7, -18.4]);
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(grfangleXStage));
    mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleYStage));
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grrotateMatrix);
    // push matrix for whole stage
    GRPushToStackScene2(grmodelMatrix);

    //*********************** stage
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, -2.2, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [24.0, 2.5, 12.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);
    gl.uniform4f(grColorUniform, 0.9, 0.4, 0.15, 1.0)
    gl.uniform2f(grTexCoordPowerUnifrom, 1.0, 1.0)

    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    
    gl.bindVertexArray(grgVaoStage);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, grgtextureStageFloor);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);
    gl.uniform4f(grColorUniform, 1.0, 1.0, 1.0, 1.0) 
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);



    //Floor
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, -4.0, 12.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [24.0, 1.2, 20.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);
    gl.uniform4f(grColorUniform, 1.0, 1.0, 1.0, 1.0)
    gl.uniform2f(grTexCoordPowerUnifrom, 10.0, 10.0)

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureFloor);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStage);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);



    //Stage roof
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, 19.2, 0.0]);
    mat4.rotateZ(grrotateMatrix, grrotateMatrix, Math.PI);
    mat4.scale(grscaleMatrix, grscaleMatrix, [24.0, 1.2, 12.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    mat4.multiply(grmodelMatrix, grmodelMatrix, grrotateMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);
    gl.uniform4f(grColorUniform, 0.7, 0.2, 0.15, 1.0)
    gl.uniform2f(grTexCoordPowerUnifrom, 1.0, 1.0)

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStage);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.uniform4f(grColorUniform, 1.0, 1.0, 1.0, 1.0)

    gl.bindTexture(gl.TEXTURE_2D, null);

    // Stage wall - right
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [25.0, 8.0, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [13.0, 0.5, 12.0]);
    mat4.rotateZ(grrotateMatrix, grrotateMatrix, deg2rad(-90.0));
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureStageWall);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // Stage wall left
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-25.0, 8.0, 0.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [13.0, 0.5, 12.0]);
    mat4.rotateZ(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureStageWall);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    // gl.bindTexture(gl.TEXTURE_2D, null);

    // stage wall back
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [0.0, 8.0, -10.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [24.0, 1.2, 10.0]);
    mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(90.0));
    mat4.multiply(grtranslateMatrix, grtranslateMatrix, grrotateMatrix);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);


    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    
    //****************************************************** Wing - 1 Right
    // right - 1
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [23.0, 4.2, 10.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // right - 2
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [23.0, 4.2, 6.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
    // right - 3
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [23.0, 4.2, 2.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //***  right - 4
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [23.0, 4.2, -4.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
   
    //********************** Wing - 1 Left
    // left - 1
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();

    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-23.0, 4.2, 10.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // left - 2
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-23.0, 4.2, 6.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
    // left - 3
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-23.0, 4.2, 2.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // left - 4
    grmodelMatrix = mat4.create();
    grviewMatrix = mat4.create();
    grprojectionMatrix = mat4.create();
    grscaleMatrix = mat4.create();
    grtranslateMatrix = mat4.create();
    grrotateMatrix = mat4.create();
    
    mat4.translate(grtranslateMatrix, grtranslateMatrix, [-23.0, 4.2, -4.0]);
    mat4.scale(grscaleMatrix, grscaleMatrix, [2.5, 15.0, 0.0]);
    mat4.multiply(grmodelMatrix, grtranslateMatrix, grscaleMatrix);
    grmodelMatrix = GRPushToStackScene2(grmodelMatrix);
    GRPopFromStackScene2();
    
    mat4.multiply(grprojectionMatrix, grprojectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformStage, false, grmodelMatrix);
    gl.uniformMatrix4fv(grgViewMatrixUniformStage, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformStage, false, grprojectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureWings);
    gl.uniform1i(grgtextureSamplerUniformStage, 0);

    gl.bindVertexArray(grgVaoStageWall);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
    GRPopFromStackScene2();
    GRPopFromStackScene2();
}


function GRPushToStackScene2(matrix)
{
    if(grmatrixPosition == -1)
    {
        grstackMatrix.push(matrix);
        grmatrixPosition++;
        return matrix;
    }
    else
    {
        var topMatrix = grstackMatrix[grmatrixPosition];
        mat4.multiply(matrix, topMatrix, matrix);
        grstackMatrix.push(matrix);
        grmatrixPosition++;
        return grstackMatrix[grmatrixPosition];
    }
  
}

function GRPopFromStackScene2()
{
    if(!grstackMatrix[0])
    {
        grstackMatrix[0] = mat4.create();
        return grstackMatrix[0];
    }
    else
    {
        grstackMatrix.pop();
        grmatrixPosition--;
        return grstackMatrix[grmatrixPosition];
    }
    
}


function GRUninitializeScene2()
{
    if(grgVaoStage)
    {
        gl.deleteVertexArray(grgVaoStage);
        grgVaoStage = null;
    }
    if(grgVboStagePosition)
    {
        gl.deleteBuffer(grgVboStagePosition);
        grgVboStagePosition = null;
    }
    if(grgVboStageTexture)
    {
        gl.deleteBuffer(grgVboStageTexture);
        grgVboStageTexture = null;
    }

    if(grgVaoStageWall)
    {
        gl.deleteVertexArray(grgVaoStageWall);
        grgVaoStageWall = null;
    }
    if(grgVboStageWallPosition)
    {
        gl.deleteBuffer(grgVboStageWallPosition);
        grgVboStageWallPosition = null;
    }
    if(grgVboStageWallTexture)
    {
        gl.deleteBuffer(grgVboStageWallTexture);
        grgVboStageWallTexture = null;
    }

    // delete textures
    if(grgtextureWings)
    {
        gl.deleteTexture(grgtextureWings);
    }
    if(grgtextureStageFloor)
    {
        gl.deleteTexture(grgtextureStageFloor);
    }
    if(grgtextureStageWall)
    {
        gl.deleteTexture(grgtextureStageWall);
    }

    if(grshaderProgramObject)
    {
        if(grfragmentShaderObject)
        {
            gl.detachShader(grshaderProgramObject, grfragmentShaderObject);
            gl.deleteShader(grfragmentShaderObject);
            grfragmentShaderObject = null;
        }

        if(grfragmentShaderObject)
        {
            gl.detachShader(grshaderProgramObject, grvertexShaderObject);
            gl.deleteShader(grvertexShaderObject);
            grvertexShaderObject = null;
        }

        gl.deleteProgram(grshaderProgramObject);
        grshaderProgramObject = null;
    }
}












