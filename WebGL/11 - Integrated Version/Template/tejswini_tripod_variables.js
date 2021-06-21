var gl = null;  // webgl context
var bFullscreen = false;
var canvas_orignal_width;
var canvas_orignal_height;


var tvn_vertexShaderObject;
var tvn_fragmentShaderObject;
var tvn_shaderProgramObject;
var textureSamplerUniform;

var tvn_vao;
var tvn_vbo;
var tvn_vbo_color;
var tvn_mvpUniform;
var angle1;
var vertices = new Float32Array(37680);
var radius = 0.04;
var i = 0;
var stack = [];
var index = -1;
var tvn_modelMatrix;
var tvn_viewMatrix;
var tvn_projectionMatrix;




function tvn_init_tripod() {
    /*************Cylinder **********************/
    for (angle1 = 0.0; angle1 < 2 * 3.14; angle1 = angle1 + 0.001) {
        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = (1.0);
        vertices[i++] = (Math.sin(angle1) * radius);

        vertices[i++] = (Math.cos(angle1) * radius);
        vertices[i++] = -1.0;
        vertices[i++] = (Math.sin(angle1) * radius);

    }

    console.log("vertices " + vertices.length);
    console.log("vertices[i] " + i);
    //vertex shade
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
        "out_tex_coord = vtexcoord;" +
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
    gl.bindAttribLocation(tvn_shaderProgramObject, macros.AMC_ATTRIB_POSITION, "vPosition");


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

    textureSamplerUniform = gl.getUniformLocation(tvn_shaderProgramObject, "u_texture_sampler");
    tvn_modelMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "model_matrix");
    tvn_viewMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "view_matrix");
    tvn_projectionMatrix = gl.getUniformLocation(tvn_shaderProgramObject, "projection_matrix");

    tvn_vao = gl.createVertexArray();
    gl.bindVertexArray(tvn_vao);

    /*************position*****************************/
    tvn_vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tvn_vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION,
        3, // 3 is for x,y,z co-cordinates is our triangle Verteices array
        gl.FLOAT,
        false,
        0, 0);
    gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION); // 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    gl.bindVertexArray(null);


    pyramid_texture = gl.createTexture();
    pyramid_texture.image = new Image();
    pyramid_texture.image.src = "Tejswini_Resources/tripod.png";

    pyramid_texture.image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, pyramid_texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pyramid_texture.image);
        gl.bindTexture(gl.TEXTURE_2D, null);

    }

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


function tvn_tripod_draw() {
    var rCylinderx = 0.38;
    var rCylindery = 1.0;


    gl.useProgram(tvn_shaderProgramObject);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pyramid_texture);
    gl.uniform1i(textureSamplerUniform, 0);


    var modelMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var translateMatrix = mat4.create();
    var rotateMatrix = mat4.create();


    //console.log("draww" + modelMatrix);
    modelMatrix = stackpush(modelMatrix);

    mat4.translate(translateMatrix, translateMatrix, [0.0, 0.0, -4.0]);//resulting matrix, act on the matrix, open square bracket

    //console.log("second" + modelMatrix);
    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    modelMatrix = stackpush(modelMatrix); // -4
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);
    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);


    gl.bindVertexArray(tvn_vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);



    /***********************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();

    mat4.translate(translateMatrix, translateMatrix, [rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    //console.log("second cyl " + modelViewMatrix);
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(20));


    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);



    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);

    /*******************************************************************/
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    translateMatrix = mat4.create();
    rotateMatrix = mat4.create();
    modelViewMatrix = mat4.create();


    mat4.translate(translateMatrix, translateMatrix, [-rCylinderx, -rCylindery, 0.0]);//resulting matrix, act on the matrix, open square bracket
    mat4.rotateZ(rotateMatrix, rotateMatrix, deg2rad(-20));

    mat4.multiply
        (modelMatrix, translateMatrix, rotateMatrix);
    mat4.multiply
        (projectionMatrix, projectionMatrix, perspectiveMatrix);


    modelMatrix = stackpush(modelMatrix);
    stackpop();

    gl.uniformMatrix4fv(tvn_modelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(tvn_viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(tvn_projectionMatrix, false, projectionMatrix);


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 12560);


    // modelViewMatrix = stack.pop();

    stackpop();
    stackpop();



    //   gl.bindVertexArray(null);
    gl.bindVertexArray(null);
    gl.useProgram(null);



}


function tvn_tripod_uninit() {
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