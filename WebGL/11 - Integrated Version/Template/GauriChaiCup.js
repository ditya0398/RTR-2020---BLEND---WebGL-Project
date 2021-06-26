
var grvertexShaderObjectChai;
var grfragmentShaderObjectChai;
var grshaderProgramObjectChai;


var grgVaoChaiCup;
var grgVboMicPositionChaiCup;
var grglightSphereChaiCup;

var grfangleChaiCupX = 0.0;
var grfangleChaiCupY = 0.0;
var grtransChaiCupX = 1.8;
var grtransChaiCupY = -0.94;
var grtransChaiCupZ = -14.6;


// texture
var grgtextureCupSphere;
var grgtextureSamplerUniform;

var grgModelMatrixUniformChaiCup;
var grgViewMatrixUniformChaiCup;
var grgProjectionMatrixUniformChaiCup;

var grstackMatrix = [];
var grmatrixPosition = -1;
var grcircleCount = 0, i;
var grmodelMatrixChaiCup;
var grviewMatrixChaiCup;
var grprojectionMatrixChaiCup; 
var grscaleMatrixChaiCup;
var grtranslateMatrixChaiCup;
var grrotateMatrixChaiCup;


function GRInitChaiCup() 
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
        "out_texcoord = vPosition.xy;" +
        "}";

    grvertexShaderObjectChai = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(grvertexShaderObjectChai, grvertexShaderSourceCode);
    gl.compileShader(grvertexShaderObjectChai);
    if (gl.getShaderParameter(grvertexShaderObjectChai, gl.COMPILE_STATUS) == false) 
    {
        var error = gl.getShaderInfoLog(grvertexShaderObjectChai);
        if (error.length > 0) 
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
        "uniform highp int u_is_sphere;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "if(u_is_sphere == 1)" +
        "{" +
        "FragColor = texture(u_texture_sampler, out_texcoord);" +
        "}" +
        "else" +
        "{" +
        "FragColor = vec4(0.0, 0.0, 0.0, 1.0);" +
        "}" +
        "}";
       
    grfragmentShaderObjectChai = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(grfragmentShaderObjectChai, grfragmentShaderSourceCode);
  
    gl.compileShader(grfragmentShaderObjectChai);
    if (gl.getShaderParameter(grfragmentShaderObjectChai, gl.COMPILE_STATUS) == false) 
    {
        alert("in compile fragment shader error");
        var error = gl.getShaderInfoLog(grfragmentShaderObjectChai);
        if (error.length > 0) 
        {
            alert(error);
            uninitialize();
        }
       

    }
    alert("in init");
    // shader program
    grshaderProgramObjectChai = gl.createProgram();
    //attach shader object
    gl.attachShader(grshaderProgramObjectChai, grvertexShaderObjectChai);
    gl.attachShader(grshaderProgramObjectChai, grfragmentShaderObjectChai);
    // pre-linking
    gl.bindAttribLocation(grshaderProgramObjectChai, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(grshaderProgramObjectChai, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");

    // linking
    gl.linkProgram(grshaderProgramObjectChai);
    if (!gl.getProgramParameter(grshaderProgramObjectChai, gl.LINK_STATUS)) 
    {
        var err = gl.getProgramInfoLog(grshaderProgramObjectChai);
        if (err.length > 0) 
        {
            alert(err);

        }

        alert("in shader program object error");
        alert(err);
        uninitialize(); 
    }

    // mvp uniform binding
    grgModelMatrixUniformChaiCup = gl.getUniformLocation(grshaderProgramObjectChai, "u_model_matrix");
    grgViewMatrixUniformChaiCup = gl.getUniformLocation(grshaderProgramObjectChai, "u_view_matrix");
    grgProjectionMatrixUniformChaiCup = gl.getUniformLocation(grshaderProgramObjectChai, "u_projection_matrix");
    grtextureSamplerUniform = gl.getUniformLocation(grshaderProgramObjectChai, "u_texture_sampler");
    grgIsMicSphereUniform = gl.getUniformLocation(grshaderProgramObjectChai, "u_is_sphere");

    var circleVerts = new Float32Array(37704);

    var index = 0;
    for(i = 0.0; i < 2 * 3.142; i = i + 0.001)
    {
        circleVerts[index] = 0.3 * Math.cos(i);
        circleVerts[index + 1] = 0.3 * Math.sin(i);
        circleVerts[index + 2] = 0.0;

        circleVerts[index + 3] = 0.2 * Math.cos(i);
        circleVerts[index + 4] = 0.2 * Math.sin(i);
        circleVerts[index + 5] = 1.0;
        index = index + 6;

    }
    console.log("index : " + index);


    // lights (cylinder)
    grgVaoChaiCup = gl.createVertexArray();
    gl.bindVertexArray(grgVaoChaiCup);

    grgVboMicPositionChaiCup = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboMicPositionChaiCup);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    
    // texture
    grgtextureCupSphere = gl.createTexture();
    grgtextureCupSphere.image = new Image();
    grgtextureCupSphere.image.src = "GauriResources/cup.jpg";
    grgtextureCupSphere.image.onload = function () 
    {
        gl.bindTexture(gl.TEXTURE_2D, grgtextureCupSphere);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grgtextureCupSphere.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    grglightSphereChaiCup = new Mesh();
    makeSphere(grglightSphereChaiCup, 2.0, 30, 30);
}


function GRDisplayChaiCup() 
{
  
    gl.useProgram(grshaderProgramObjectChai);
    GRChaiCup();
    gl.useProgram(null);

}




function GRChaiCup() 
{

    grmodelMatrixChaiCup = mat4.create();
    grviewMatrixChaiCup = mat4.create();
    grprojectionMatrixChaiCup = mat4.create();
    grscaleMatrixChaiCup = mat4.create();
    grtranslateMatrixChaiCup = mat4.create();
    grrotateMatrixChaiCup = mat4.create();

    // push matrix for whole geometry
    mat4.translate(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, [grtransChaiCupX, grtransChaiCupY, grtransChaiCupZ]);
    //mat4.rotateX(grrotateMatrix, grrotateMatrix, deg2rad(180 + grfangleXMic));
    mat4.rotateY(grrotateMatrixChaiCup, grrotateMatrixChaiCup, deg2rad(grfangleChaiCupY));
    mat4.scale(grscaleMatrixChaiCup, grscaleMatrixChaiCup, [0.15, 0.125, 0.15]);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grrotateMatrixChaiCup);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grscaleMatrixChaiCup);
    GRPushToStackChaiCup(grmodelMatrixChaiCup);


    //********************************************* mic - handle ****************************************
    //********************************************************************************************
    grmodelMatrixChaiCup = mat4.create();
    grviewMatrixChaiCup = mat4.create();
    grprojectionMatrixChaiCup = mat4.create();
    grscaleMatrixChaiCup = mat4.create();
    grtranslateMatrixChaiCup = mat4.create();
    grrotateMatrixChaiCup = mat4.create();

    mat4.translate(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, [0.0, 0.0, 0.0]);
    mat4.rotateX(grrotateMatrixChaiCup, grrotateMatrixChaiCup, deg2rad(90.0));
    mat4.multiply(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, grrotateMatrixChaiCup);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grscaleMatrixChaiCup);
    grmodelMatrixChaiCup = GRPushToStackChaiCup(grmodelMatrixChaiCup);
    GRPopFromStackChaiCup();

    mat4.multiply(grprojectionMatrixChaiCup, grprojectionMatrixChaiCup, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformChaiCup, false, grmodelMatrixChaiCup);
    gl.uniformMatrix4fv(grgViewMatrixUniformChaiCup, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformChaiCup, false, grprojectionMatrixChaiCup);
    
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, grgtextureCupSphere);
   gl.uniform1i(grgIsMicSphereUniform, 1);
   gl.uniform1i(grtextureSamplerUniform, 0);
    
    gl.bindVertexArray(grgVaoChaiCup);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12568);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
    // cup top
    grmodelMatrixChaiCup = mat4.create();
    grviewMatrixChaiCup = mat4.create();
    grprojectionMatrixChaiCup = mat4.create();
    grscaleMatrixChaiCup = mat4.create();
    grtranslateMatrixChaiCup = mat4.create();
    grrotateMatrixChaiCup = mat4.create();

    mat4.translate(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, [0.0, 0.05, 0.0]);
    mat4.scale(grscaleMatrixChaiCup, grscaleMatrixChaiCup, [1.1, 0.5, 1.1]);
    mat4.rotateX(grrotateMatrixChaiCup, grrotateMatrixChaiCup, deg2rad(90.0));
    mat4.multiply(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, grscaleMatrixChaiCup);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grrotateMatrixChaiCup);
    grmodelMatrixChaiCup = GRPushToStackChaiCup(grmodelMatrixChaiCup);
    GRPopFromStackChaiCup();

    mat4.multiply(grprojectionMatrixChaiCup, grprojectionMatrixChaiCup, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformChaiCup, false, grmodelMatrixChaiCup);
    gl.uniformMatrix4fv(grgViewMatrixUniformChaiCup, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformChaiCup, false, grprojectionMatrixChaiCup);
    

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, grgtextureCupSphere);
   gl.uniform1i(grgIsMicSphereUniform, 1);
   gl.uniform1i(grtextureSamplerUniform, 0);
    
    gl.bindVertexArray(grgVaoChaiCup);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12568);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);

    // cup top - black 
    grmodelMatrixChaiCup = mat4.create();
    grviewMatrixChaiCup = mat4.create();
    grprojectionMatrixChaiCup = mat4.create();
    grscaleMatrixChaiCup = mat4.create();
    grtranslateMatrixChaiCup = mat4.create();
    grrotateMatrixChaiCup = mat4.create();

    mat4.translate(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, [0.0, 0.052, 0.0]);
    mat4.scale(grscaleMatrixChaiCup, grscaleMatrixChaiCup, [1.1, 0.5, 1.1]);
    mat4.rotateX(grrotateMatrixChaiCup, grrotateMatrixChaiCup, deg2rad(90.0));
    mat4.multiply(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, grscaleMatrixChaiCup);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grrotateMatrixChaiCup);
    grmodelMatrixChaiCup = GRPushToStackChaiCup(grmodelMatrixChaiCup);
    GRPopFromStackChaiCup();

    mat4.multiply(grprojectionMatrixChaiCup, grprojectionMatrixChaiCup, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformChaiCup, false, grmodelMatrixChaiCup);
    gl.uniformMatrix4fv(grgViewMatrixUniformChaiCup, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformChaiCup, false, grprojectionMatrixChaiCup);
    

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, grgtextureCupSphere);
   gl.uniform1i(grgIsMicSphereUniform, 0);
   gl.uniform1i(grtextureSamplerUniform, 0);
    
    gl.bindVertexArray(grgVaoChaiCup);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12568);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
    // cup middle
    grmodelMatrixChaiCup = mat4.create();
    grviewMatrixChaiCup = mat4.create();
    grprojectionMatrixChaiCup = mat4.create();
    grscaleMatrixChaiCup = mat4.create();
    grtranslateMatrixChaiCup = mat4.create();
    grrotateMatrixChaiCup = mat4.create();
  
    mat4.translate(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, [0.0, -0.15, 0.0]);
    mat4.scale(grscaleMatrixChaiCup, grscaleMatrixChaiCup, [1.0, 0.05, 1.0]);
    mat4.rotateX(grrotateMatrixChaiCup, grrotateMatrixChaiCup, deg2rad(90.0));
    mat4.multiply(grtranslateMatrixChaiCup, grtranslateMatrixChaiCup, grscaleMatrixChaiCup);
    mat4.multiply(grmodelMatrixChaiCup, grtranslateMatrixChaiCup, grrotateMatrixChaiCup);
    grmodelMatrixChaiCup = GRPushToStackChaiCup(grmodelMatrixChaiCup);
    GRPopFromStackChaiCup();
  
    mat4.multiply(grprojectionMatrixChaiCup, grprojectionMatrixChaiCup, perspectiveMatrix);
  
    gl.uniformMatrix4fv(grgModelMatrixUniformChaiCup, false, grmodelMatrixChaiCup);
    gl.uniformMatrix4fv(grgViewMatrixUniformChaiCup, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformChaiCup, false, grprojectionMatrixChaiCup);

    gl.uniform1i(grgIsMicSphereUniform, 0);
    gl.uniform1i(grtextureSamplerUniform, 0);
      
    gl.bindVertexArray(grgVaoChaiCup);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12568);
    gl.bindVertexArray(null);
  
    gl.bindTexture(gl.TEXTURE_2D, null);
      
    GRPopFromStackChaiCup();

}


function GRPushToStackChaiCup(matrix) 
{
    if (grmatrixPosition == -1) 
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

function GRPopFromStackChaiCup() 
{
    if (!grstackMatrix[0]) 
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


function GRUninitializeChaiCup() 
{
    if (grgVaoChaiCup) 
    {
        gl.deleteVertexArray(grgVaoChaiCup);
        grgVaoChaiCup = null;
    }
    if (grgVboMicPositionChaiCup) 
    {
        gl.deleteBuffer(grgVboMicPositionChaiCup);
        grgVboMicPositionChaiCup = null;
    }
      
    // delete textures

    if (grgtextureCupSphere) 
    {
        gl.deleteTexture(grgtextureCupSphere);
        grgtextureCupSphere = null;
    }
    
   
    if (grshaderProgramObjectChai) 
    {
        if (grvertexShaderObjectChai) 
        {
            gl.detachShader(grshaderProgramObjectChai, grfragmentShaderObjectChai);
            gl.deleteShader(grvertexShaderObjectChai);
            grvertexShaderObjectChai = null;
        }

        if (grvertexShaderObjectChai) 
        {
            gl.detachShader(grshaderProgramObjectChai, grvertexShaderObjectChai);
            gl.deleteShader(grvertexShaderObjectChai);
            grvertexShaderObjectChai = null;
        }

        gl.deleteProgram(grshaderProgramObjectChai);
        grshaderProgramObjectChai = null;
    }
}












