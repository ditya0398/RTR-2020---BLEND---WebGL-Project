
var grvertexShaderObjectMic;
var grfragmentShaderObjectMic;
var grshaderProgramObjectMic;

var grgPerspectiveProjectionMatrix;

var grgVaoMic;
var grgVboMicPosition;
var grglightSphereMic;

var grfangleXMic = -50.0;
var grfangleYMic = 0.0;
var grfangleXHandle = 0.0;
var grtransMicX = 0.0;
var grtransMicY = 0.7;
var grtransMicZ = -11.0;
var grscale = 1.44

// texture
var grgtextureMicSphere;
var grgtextureSamplerUniformMic;

var grgModelMatrixUniformMic;
var grgViewMatrixUniformMic;
var grgProjectionMatrixUniformMic;
var grgIsMicSphereUniform;
var grgIsMicSphere = 0;
var grgDistortionUniformMic;

var grstackMatrixMic = [];
var grmatrixPositionMic = -1;
var grcircleCountMic = 0, i;
var grmodelMatrixMic;
var grviewMatrixMic;
var grprojectionMatrixMic; 
var grscaleMatrixMic;
var grtranslateMatrixMic;
var grrotateMatrixMic;


function GRInitMic() 
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

    grvertexShaderObjectMic = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(grvertexShaderObjectMic, grvertexShaderSourceCode);
    gl.compileShader(grvertexShaderObjectMic);
    if (gl.getShaderParameter(grvertexShaderObjectMic, gl.COMPILE_STATUS) == false) 
    {
        var error = gl.getShaderInfoLog(grvertexShaderObjectMic);
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
        "uniform float distortion;" +
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "if(u_is_sphere == 1)" +
        "{" +
        "FragColor = texture(u_texture_sampler, out_texcoord);" +
        "}" +
        "else" +
        "{" +
        "FragColor = vec4(0.2, 0.2, 0.2, 1.0);" +
        "}" +
        "vec3 gray = vec3(dot(vec3(FragColor), vec3(0.2126, 0.7152, 0.0722)));" +
        "FragColor = vec4(mix(vec3(FragColor), gray, distortion), 1.0);" +
        "}";
       
    grfragmentShaderObjectMic = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(grfragmentShaderObjectMic, grfragmentShaderSourceCode);
  
    gl.compileShader(grfragmentShaderObjectMic);
    if (gl.getShaderParameter(grfragmentShaderObjectMic, gl.COMPILE_STATUS) == false) 
    {
        alert("in compile fragment shader error");
        var error = gl.getShaderInfoLog(grfragmentShaderObjectMic);
        if (error.length > 0) 
        {
            alert(error);
            uninitialize();
        }
       

    }
    // shader program
    grshaderProgramObjectMic = gl.createProgram();
    //attach shader object
    gl.attachShader(grshaderProgramObjectMic, grvertexShaderObjectMic);
    gl.attachShader(grshaderProgramObjectMic, grfragmentShaderObjectMic);
    // pre-linking
    gl.bindAttribLocation(grshaderProgramObjectMic, macros.AMC_ATTRIB_POSITION, "vPosition");
    gl.bindAttribLocation(grshaderProgramObjectMic, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord");

    // linking
    gl.linkProgram(grshaderProgramObjectMic);
    if (!gl.getProgramParameter(grshaderProgramObjectMic, gl.LINK_STATUS)) 
    {
        var err = gl.getProgramInfoLog(grshaderProgramObjectMic);
        if (err.length > 0) 
        {
            alert(err);

        }

        alert("in shader program object error");
        alert(err);
        uninitialize(); 
    }

    // mvp uniform binding
    grgModelMatrixUniformMic = gl.getUniformLocation(grshaderProgramObjectMic, "u_model_matrix");
    grgViewMatrixUniformMic = gl.getUniformLocation(grshaderProgramObjectMic, "u_view_matrix");
    grgProjectionMatrixUniformMic = gl.getUniformLocation(grshaderProgramObjectMic, "u_projection_matrix");
    grgtextureSamplerUniformMic = gl.getUniformLocation(grshaderProgramObjectMic, "u_texture_sampler");
    grgIsMicSphereUniform = gl.getUniformLocation(grshaderProgramObjectMic, "u_is_sphere");
    grgDistortionUniformMic = gl.getUniformLocation(grshaderProgramObjectMic, "distortion");

    var circleVerts = new Float32Array(37704);

    var index = 0;
    for(i = 0.0; i < 2 * 3.142; i = i + 0.001)
    {
        circleVerts[index] = 0.3 * Math.cos(i);
        circleVerts[index + 1] = 0.3 * Math.sin(i);
        circleVerts[index + 2] = 0.0;

        circleVerts[index + 3] = 0.1 * Math.cos(i);
        circleVerts[index + 4] = 0.1 * Math.sin(i);
        circleVerts[index + 5] = 1.2;
        index = index + 6;

    }
    console.log("index : " + index);


    // lights (cylinder)
    grgVaoMic = gl.createVertexArray();
    gl.bindVertexArray(grgVaoMic);

    grgVboMicPosition = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboMicPosition);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    grgVboCylinderTexture = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, grgVboCylinderTexture);
    gl.bufferData(gl.ARRAY_BUFFER, circleVerts, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    
    // texture
    grgtextureMicSphere = gl.createTexture();
    grgtextureMicSphere.image = new Image();
    grgtextureMicSphere.image.src = "GauriResources/mic_cloth.jpg";
    grgtextureMicSphere.image.onload = function () 
    {
        gl.bindTexture(gl.TEXTURE_2D, grgtextureMicSphere);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, grgtextureMicSphere.image);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    
    grglightSphereMic = new Mesh();
    makeSphere(grglightSphereMic, 2.0, 30, 30);
}


function GRDisplayMic() 
{
  
    gl.useProgram(grshaderProgramObjectMic);
    GRMic();
    gl.useProgram(null);

}


var temp1 = 1.0, temp2 = 0.0

function GRMic() 
{

    gl.uniform1f(grgDistortionUniformMic, blackWhiteDistortion)
    gl.bindTexture(gl.TEXTURE_2D, null)

    grmodelMatrixMic = mat4.create();
    grviewMatrixMic = mat4.create();
    grprojectionMatrixMic = mat4.create();
    grscaleMatrixMic = mat4.create();
    grtranslateMatrixMic = mat4.create();
    grrotateMatrixMic = mat4.create();

    // push matrix for stage - light geometry
    mat4.translate(grtranslateMatrixMic, grtranslateMatrixMic, [grtransMicX, grtransMicY + 3.4, grtransMicZ - 16.3]);
    mat4.rotateX(grrotateMatrixMic, grrotateMatrixMic, deg2rad(grfangleXMic));
    mat4.scale(grscaleMatrixMic, grscaleMatrixMic, [grscale * 0.7, grscale * 0.7, grscale * 0.7])
    // mat4.rotateY(grrotateMatrix, grrotateMatrix, deg2rad(grfangleYMic));
    mat4.multiply(grmodelMatrixMic, grtranslateMatrixMic, grrotateMatrixMic);
    mat4.multiply(grmodelMatrixMic, grmodelMatrixMic, grscaleMatrixMic)
    GRPushToStack(grmodelMatrixMic);


    //********************************************* mic - handle ****************************************
    //********************************************************************************************
    grmodelMatrixMic = mat4.create();
    grviewMatrixMic = mat4.create();
    grprojectionMatrixMic = mat4.create();
    grscaleMatrixMic = mat4.create();
    grtranslateMatrixMic = mat4.create();
    grrotateMatrixMic = mat4.create();

    mat4.translate(grtranslateMatrixMic, grtranslateMatrixMic, [0.0, 0.0, 0.0]);
    mat4.rotateX(grrotateMatrixMic, grrotateMatrixMic, deg2rad(90.0));
    mat4.multiply(grtranslateMatrixMic, grtranslateMatrixMic, grrotateMatrixMic);
    mat4.multiply(grmodelMatrixMic, grtranslateMatrixMic, grscaleMatrixMic);
    grmodelMatrixMic = GRPushToStack(grmodelMatrixMic);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrixMic, grprojectionMatrixMic, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformMic, false, grmodelMatrixMic);
    gl.uniformMatrix4fv(grgViewMatrixUniformMic, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformMic, false, grprojectionMatrixMic);
    

    gl.uniform1i(grgIsMicSphereUniform, 0);
    
    gl.bindVertexArray(grgVaoMic);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 12568);
    gl.bindVertexArray(null);

    gl.bindTexture(gl.TEXTURE_2D, null);
    
   
    //********************************************* mic - sphere ****************************************
    //********************************************************************************************
    grmodelMatrixMic = mat4.create();
    grviewMatrixMic = mat4.create();
    grprojectionMatrixMic = mat4.create();
    grscaleMatrixMic = mat4.create();
    grtranslateMatrixMic = mat4.create();
    grrotateMatrixMic = mat4.create();

    mat4.translate(grtranslateMatrixMic, grtranslateMatrixMic, [0.0, 0.12, 0.0]);
    mat4.scale(grscaleMatrixMic, grscaleMatrixMic, [0.18, 0.18, 0.18]);
    mat4.multiply(grmodelMatrixMic, grtranslateMatrixMic, grscaleMatrixMic);
    grmodelMatrixMic = GRPushToStack(grmodelMatrixMic);
    GRPopFromStack();

    mat4.multiply(grprojectionMatrixMic, grprojectionMatrixMic, perspectiveMatrix);

    gl.uniformMatrix4fv(grgModelMatrixUniformMic, false, grmodelMatrixMic);
    gl.uniformMatrix4fv(grgViewMatrixUniformMic, false, gViewMatrix);
    gl.uniformMatrix4fv(grgProjectionMatrixUniformMic, false, grprojectionMatrixMic);
    
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, grgtextureMicSphere);
    gl.uniform1i(grgIsMicSphereUniform, 1);
    gl.uniform1i(grgtextureSamplerUniformMic, 0);
    
    grglightSphereMic.draw();

    gl.bindTexture(gl.TEXTURE_2D, null);
    

    GRPopFromStack();

}


function GRPushToStack(matrix) 
{
    if (grmatrixPositionMic == -1) 
    {
        grstackMatrixMic.push(matrix);
        grmatrixPositionMic++;
        return matrix;
    }
    else 
    {
        var topMatrix = grstackMatrixMic[grmatrixPositionMic];
        mat4.multiply(matrix, topMatrix, matrix);
        grstackMatrixMic.push(matrix);
        grmatrixPositionMic++;
        return grstackMatrixMic[grmatrixPositionMic];
    }

}

function GRPopFromStack() 
{
    if (!grstackMatrixMic[0]) 
    {
        grstackMatrixMic[0] = mat4.create();
        return grstackMatrixMic[0];
    }
    else 
    {
        grstackMatrixMic.pop();
        grmatrixPositionMic--;
        return grstackMatrixMic[grmatrixPositionMic];
    }

}


function GRUninitializeMic() 
{
    if (grgVaoMic) 
    {
        gl.deleteVertexArray(grgVaoMic);
        grgVaoMic = null;
    }
    if (grgVboMicPosition) 
    {
        gl.deleteBuffer(grgVboMicPosition);
        grgVboMicPosition = null;
    }
    if(grgVboCylinderTexture)
    {
        gl.deleteBuffer(grgVboMicPosition);
        grgVboMicPosition = null;
    }
   
    if(grglightSphereMic)
    {
        grglightSphereMic.deallocate();
    }
    
    
    // delete textures
    if (grgtextureLightMaterial) 
    {
        gl.deleteTexture(grgtextureLightMaterial);
        grgtextureLightMaterial = null;
    }
    if (grgtextureMicSphere) 
    {
        gl.deleteTexture(grgtextureMicSphere);
        grgtextureMicSphere = null;
    }
    
   

    if (grshaderProgramObjectMic) 
    {
        if (grfragmentShaderObjectMic) 
        {
            gl.detachShader(grshaderProgramObjectMic, grfragmentShaderObjectMic);
            gl.deleteShader(grfragmentShaderObjectMic);
            grfragmentShaderObjectMic = null;
        }

        if (grfragmentShaderObjectMic) 
        {
            gl.detachShader(grshaderProgramObjectMic, grvertexShaderObjectMic);
            gl.deleteShader(grvertexShaderObjectMic);
            grvertexShaderObjectMic = null;
        }

        gl.deleteProgram(grshaderProgramObjectMic);
        grshaderProgramObjectMic = null;
    }
}












