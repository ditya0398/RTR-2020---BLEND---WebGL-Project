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


var vertices = new Float32Array(37680);
var radius = 0.08;
var i = 0;
var stack = [];
var index = -1;
var angle1;


var degrees;
var tvn_vertexShaderObject;
var tvn_fragmentShaderObject;
var tvn_shaderProgramObject;

var tvn_vao;
var tvn_vao_rectangle;
var tvn_vbo;
var tvn_vbo_rectangle;
var tvn_vbo_rectangle_color;
var tvn_vbo_color;
var tvn_vbo_tex_coord;
var tvn_mvpUniform;
var rangle = 0.0;
var tvn_projectionMatrix;
var tvn_modelMatrix;
var tvn_viewMatrix;

function tejswini_hut_init() {

    /*************Cylinder **********************/
    for (angle1 = 0.0; angle1 < 2 * 3.14; angle1 = angle1 + 0.001) {
        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = (1.0);
        vertices[i++] = (Math.sin(angle1) * radius);

        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = -1.0;
        vertices[i++] = (Math.sin(angle1) * radius);

    }


    //vertex shader 
    var vertexShaderSourcedCode =
        "#version 300 es" +
        "\n" +
        "in vec4 vPosition;" +
        "in vec2 vtexcoord;" +
        "uniform mat4 model_matrix;" +
        "uniform mat4 view_matrix;" +
        "uniform mat4 projection_matrix;" +
        "out vec2 out_tex_coord;" +
        "void main(void)" +
        "{" +
        "gl_Position = projection_matrix * view_matrix * model_matrix * vPosition;" +
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
        "out vec4 FragColor;" +
        "void main(void)" +
        "{" +
        "FragColor = texture(u_texture_sampler, out_tex_coord);" +
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
    gl.bindAttribLocation(tvn_shaderProgramObject, WebGLMacros.tvn_ATTRIBUTE_TEXTURE, "vtexcoord");


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
    tvn_projectionMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "projection_matrix");
    tvn_viewMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "view_matrix");
    tvn_modelMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "model_matrix");
    textureSamplerUniform = gl.getUniformLocation(tvn_shaderProgramObject, "u_texture_sampler");

    // ** vertices , color , shader attribs, vbo initialization***

    var squareVertices = new Float32Array([
        1.8, 1.8, -1.0,
        1.8, 1.8, 1.0,
        1.8, -1.8, 1.0,
        1.8, -1.8, -1.0,

        // left face
        -1.8, 1.8, 1.0,
        -1.8, 1.8, -1.0,
        -1.8, -1.8, -1.0,
        -1.8, -1.8, 1.0,



        // bottom face
        1.8, -1.8, -1.0,
        -1.8, -1.8, -1.0,
        -1.8, -1.8, 1.0,
        1.8, -1.8, 1.0,

        // top face
        //3
        1.8, 1.8, -1.0,
        -1.8, 1.8, -1.0,
        -2.0, 2.0, 1.0,
        2.0, 2.0, 1.0,

    ]);

    var cubeTexCoord = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0

    ]);

    /***********************rectangle position**********************************/
    tvn_vao_rectangle = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao_rectangle);

    tvn_vbo_rectangle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_rectangle);
    gl.bufferData(gl.ARRAY_BUFFER, squareVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.tvn_ATTRIBUTE_VERTEX,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(WebGLMacros.tvn_ATTRIBUTE_VERTEX); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    /**************************************************************/
    tvn_vbo_tex_coord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo_tex_coord);
    gl.bufferData(gl.ARRAY_BUFFER, cubeTexCoord, gl.STATIC_DRAW);
    gl.vertexAttribPointer(WebGLMacros.tvn_ATTRIBUTE_TEXTURE, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(WebGLMacros.tvn_ATTRIBUTE_TEXTURE);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindVertexArray(null);

    /*******************************************************************/
    tvn_vao = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao);


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


    /*****************************************/
    tin_texture = gl.createTexture();
    tin_texture.image = new Image();
    tin_texture.image.src = "tin.png";

    tin_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, tin_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, tin_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    wood_texture = gl.createTexture();
    wood_texture.image = new Image();
    wood_texture.image.src = "wood.png";

    wood_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, wood_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, wood_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

    hut_texture = gl.createTexture();
    hut_texture.image = new Image();
    hut_texture.image.src = "hut.png";

    hut_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, hut_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, hut_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }


}

function tejswini_init_draw() {
    gl.useProgram(tvn_shaderProgramObject);

    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotateMatrix = mat4.create();

    modelMatrix = stackpush(modelMatrix);
    mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, -6.0]);
    //mat4.rotateY(rotateMatrix, rotateMatrix, deg2rad(45));



    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    modelMatrix = stackpush(modelMatrix);
    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveProjectionMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, hut_texture);

    gl.uniform1i(textureSamplerUniform, 0);


    gl.bindVertexArray(tvn_vao_rectangle);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.bindTexture(gl.TEXTURE_2D, tin_texture);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.bindVertexArray(null);

    /********************************************************************/
    gl.bindTexture(gl.TEXTURE_2D, wood_texture);
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [1.9, -3.0, 0.0]);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    modelMatrix = stackpush(modelMatrix);
    stackpop();
    

    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveProjectionMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);

    // *** unbind vao ***
    gl.bindVertexArray(tvn_vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /*********************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [1.9, -3.0, -1.0]);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveProjectionMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);
    /********************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [-1.9, -3.0, 0.0]);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveProjectionMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /**************************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [-1.9, -3.0, -1.0]);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.multiply(projectionMatrix, projectionMatrix, perspectiveProjectionMatrix);

    modelMatrix = stackpush(modelMatrix);
    stackpop();

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);



    stackpop();
    stackpop();
    gl.bindVertexArray(null);
    gl.useProgram(null);

}

function stackpush(matrix) {
    var prevMatrix;
    console.log("push" + matrix);
    if (index < 0) {
        stack.push(matrix);
        index++;
        return matrix;
    }
    else {
        prevMatrix = stack[index];
        stack.push(mat4.multiply(matrix, prevMatrix, matrix));
        index++;
        return matrix;
    }

}

function stackpop() {
    if (!stack[0]) {
        stack[0] = mat4.create();
        return stack[0];
    }

    else {
        stack.pop(index--);
        return stack[index];
    }

}



function tejswini_hut_uninit() {
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