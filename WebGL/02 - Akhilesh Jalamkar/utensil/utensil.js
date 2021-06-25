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


var ASJ_vertexShaderObject_utensil;
var ASJ_fragmentShaderObject_utensil;
var ASJ_shaderProgramObject_utensil;

var ASJ_vao_utensil;
var ASJ_vbo_utensil;
var ASJ_vbo_color_utensil;
var ASJ_modelMatrixUniform_utensil;
var angle1_utensil;
var vertices_utensil = new Float32Array(37680);
var radius_utensil = 0.04;
var i = 0;
var asj_textureSamplerUniform_utensil;
var vao_cube_utensil;
var vbo_position_cube_utensil;
var vbo_texture_cube_utensil;

var utensil_texture;

var viewMatrixUniform_utensil;
var projectionMatrixUniform_utensil;

function utensil_init()
{
    for (angle1_utensil = 0.0; angle1_utensil < 2 * 3.14; angle1_utensil = angle1_utensil + 0.001) {
        vertices_utensil[i++] = (Math.cos(angle1_utensil) * radius_utensil);
        vertices_utensil[i++] = (1.0);
        vertices_utensil[i++] = (Math.sin(angle1_utensil) * radius_utensil);

        vertices_utensil[i++] = (Math.cos(angle1_utensil) * radius_utensil);
        vertices_utensil[i++] = -2.0;
        vertices_utensil[i++] = (Math.sin(angle1_utensil) * radius_utensil);

    }

    var cubeVertices = new Float32Array([1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,

        //RIGHT FACE
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        //BACK FACE
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,

        //LEFT FACE
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,

        //TOP FACE
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,

        //BOTTOM FACE
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0]);

    var cubeTexCord = new Float32Array([
        //FRONT FACE

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0]);

    


    gl.bindVertexArray(null);

    var vertexShaderSourcedCode =
        "#version 300 es" +
        "\n" +
        "layout(location = 0)in vec4 vPosition;" +
        "in vec2 vtexCoord;" +
        "uniform mat4 u_model_matrix;" +
        "uniform mat4 u_view_matrix;" +
        "uniform mat4 u_projection_matrix;"+
        "out vec2 out_tex_coord;" +

        "void main(void)" +
        "{" +
        "gl_Position =u_projection_matrix * u_view_matrix *u_model_matrix* vPosition;" +

        "out_tex_coord.x = vPosition.x;" +
        "out_tex_coord.y = vPosition.y;" +

        "}";

    ASJ_vertexShaderObject_utensil = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(ASJ_vertexShaderObject_utensil, vertexShaderSourcedCode);
    gl.compileShader(ASJ_vertexShaderObject_utensil);
    if (gl.getShaderParameter(ASJ_vertexShaderObject_utensil, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(ASJ_vertexShaderObject_utensil);
        if (error.length > 0) {
            alert("vertex patela"+error);
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
       "fragColor =  texture(u_texture_sampler, out_tex_coord+0.5);" +
       // "fragColor=vec4(0.650, 0.670, 0.690,1.0);"+
        "}";

    ASJ_fragmentShaderObject_utensil = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(ASJ_fragmentShaderObject_utensil, fragmentShaderSourceCode);
    gl.compileShader(ASJ_fragmentShaderObject_utensil);
    if (gl.getShaderParameter(ASJ_fragmentShaderObject_utensil, gl.COMPILE_STATUS) == false) {
        var error = gl.getShaderInfoLog(ASJ_fragmentShaderObject_utensil);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //shader program 
    ASJ_shaderProgramObject_utensil = gl.createProgram();
    gl.attachShader(ASJ_shaderProgramObject_utensil, ASJ_vertexShaderObject_utensil);
    gl.attachShader(ASJ_shaderProgramObject_utensil, ASJ_fragmentShaderObject_utensil);

    //pre-link binding of shader program object with vertex shader attributes
  


    //linking 
    gl.linkProgram(ASJ_shaderProgramObject_utensil);
    if (!gl.getProgramParameter(ASJ_shaderProgramObject_utensil, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(ASJ_shaderProgramObject_utensil);
        if (error.length > 0) {
            alert(error);
            uninitialize();
        }
    }

    //get MVP uniform location
    ASJ_modelMatrixUniform_utensil = gl.getUniformLocation(ASJ_shaderProgramObject_utensil, "u_model_matrix");
    viewMatrixUniform_utensil = gl.getUniformLocation(ASJ_shaderProgramObject_utensil, "u_view_matrix");
    projectionMatrixUniform_utensil = gl.getUniformLocation(ASJ_shaderProgramObject_utensil, "u_projection_matrix");
    asj_textureSamplerUniform_utensil = gl.getUniformLocation(ASJ_shaderProgramObject_utensil, "u_texture_sampler");
    console.log(vertices_utensil);

    ASJ_vao_utensil = gl.createVertexArray();
    gl.bindVertexArray(ASJ_vao_utensil);

    /*************position*****************************/
    ASJ_vbo_utensil = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ASJ_vbo_utensil);
    gl.bufferData(gl.ARRAY_BUFFER, vertices_utensil, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.tvn_ATTRIBUTE_VERTEX,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(WebGLMacros.tvn_ATTRIBUTE_VERTEX); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);


    //handle
    vao_cube_utensil = gl.createVertexArray();
    gl.bindVertexArray(vao_cube_utensil);
    vbo_position_cube_utensil = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo_position_cube_utensil);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // vbo_texture_cube_utensil = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vbo_texture_cube_utensil);
    // gl.bufferData(gl.ARRAY_BUFFER, cubeTexCord, gl.STATIC_DRAW);
    // gl.vertexAttribPointer(WebGLMacros.tvn_ATTRIBUTE_TEXTURE, 2, gl.FLOAT,
    //     false, 0, 0);
    // gl.enableVertexAttribArray(WebGLMacros.tvn_ATTRIBUTE_TEXTURE);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    utensil_texture = gl.createTexture();
    utensil_texture.image = new Image();
    utensil_texture.image.src = "Tejswini_Resources/steel.png";

    utensil_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, utensil_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, utensil_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }//lambda, closure
}

var stack_utensils=[];
function utensil_display()
{
    gl.useProgram(ASJ_shaderProgramObject_utensil);
    var tempMatrix = mat4.create();
    var modelViewMatrix = mat4.create();
    //var modelViewProjectionMatrix = mat4.create(); // tayar hi honar and indentity matrix la inidilization pan karnar  

    var viewMatrix = mat4.create();
    //var projectionMatrix = mat4.create();


    gl.uniformMatrix4fv(viewMatrixUniform_utensil, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixUniform_utensil, false, perspectiveProjectionMatrix);


    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -2.0]);//resulting matrix, act on the matrix, open square bracket
    
//    mat4.multiply(modelViewProjectionMatrix, perspectiveProjectionMatrix, modelViewMatrix);

    tempMatrix = modelViewMatrix;

    stack_utensils.push(modelViewMatrix);

    mat4.rotateX(tempMatrix, tempMatrix, degTwoRadians(spin));
    mat4.scale(tempMatrix, tempMatrix, [6, 0.1, 6]);
    gl.uniformMatrix4fv(ASJ_modelMatrixUniform_utensil, false, tempMatrix);
    

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, utensil_texture);
    gl.uniform1i(asj_textureSamplerUniform_utensil, 0);

    gl.bindVertexArray(ASJ_vao_utensil);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);
    gl.bindVertexArray(null);

    //handle
    
    temp = stack_utensils.pop();
    
    mat4.translate(temp, temp, [0.1, 0.5, 0]);
    mat4.scale(temp, temp, [0.06, 0.2, 0.005]);
    
    gl.uniformMatrix4fv(ASJ_modelMatrixUniform_utensil, false, temp);
    gl.bindVertexArray(vao_cube_utensil);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    mat4.scale(temp, temp, [0.5, 1.5, 1]);
    mat4.translate(temp, temp, [1,0,0]);
    gl.uniformMatrix4fv(ASJ_modelMatrixUniform_utensil, false, temp);
    gl.bindVertexArray(vao_cube_utensil);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    gl.useProgram(null);

}

function degTwoRadians(degree) {
    return (degree * Math.PI) / 180;
}

function tvn_uninitialize() {
    //code
    if (ASJ_vao_utensil) {
        gl.deleteVertexArary(ASJ_vao_utensil);
        ASJ_vao_utensil = null;
    }

    if (ASJ_vbo_utensil) {
        gl.deleteBuffer(ASJ_vbo_utensil);
        ASJ_vbo_utensil = null;
    }

    if (ASJ_shaderProgramObject_utensil) {
        if (ASJ_fragmentShaderObject_utensil) {
            gl.detachShader(ASJ_shaderProgramObject_utensil, ASJ_fragmentShaderObject_utensil);
            gl.deleteShader(ASJ_fragmentShaderObject_utensil);
            ASJ_fragmentShaderObject_utensil = null;
        }

        if (ASJ_vertexShaderObject_utensil) {
            gl.detachShader(ASJ_shaderProgramObject_utensil, ASJ_vertexShaderObject_utensil);
            gl.deleteShader(ASJ_vertexShaderObject_utensil);
            ASJ_vertexShaderObject_utensil = null;
        }

        gl.deleteProgram(ASJ_shaderProgramObject_utensil);
        ASJ_shaderProgramObject_utensil = null;
    }

}