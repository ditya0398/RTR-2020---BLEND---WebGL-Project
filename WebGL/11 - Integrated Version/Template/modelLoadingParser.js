var materials_ModelLoading;

var material_modelLoading;
var samplerUniform_modelLoading;

var gParts_Table;

var gParts_Teapot;


var vertexShaderObject_modelLoading;
var fragmentShaderObject_modelLoading;



var gAngleTriangle_modelLoading=0.0;
var gAngleSquare_modelLoading=0.0;
var perspectiveProjectionMatrix_modelLoading;


var modelUniform_modelLoading, viewUniform_modelLoading, projectionUniform_modelLoading;
var LightPositionUniform_modelLoading, LKeyPressed_modelLoading ;
var LAUniform_modelLoading, LDUniform_modelLoading, LSUniform_modelLoading;
var KAUniform_modelLoading, KDUniform_modelLoading, KSUniform_modelLoading, MaterialShininessUniform_modelLoading;
var gbLighting_modelLoading=true;
var perspectiveProjectionMatrix_modelLoading;
var light_ambient_modelLoading = [0.0, 0.0, 0.0];
var light_diffuse_modelLoading = [1.0, 1.0, 1.0];
var light_specular_modelLoading = [1.0, 1.0, 1.0];
var light_position_modelLoading = [100.0, 100.0, 100.0,1.0];
	
var material_ambient_modelLoading = [0.0, 0.0, 0.0];
var material_diffuse_modelLoading = [1.0, 1.0, 1.0];
var material_specular_modelLoading = [1.0, 1.0, 1.0];
	
var material_shininess_modelLoading = 50.0;
var sphere_modelLoading=null;




var numElements_Teapot = [];
var numElements_table = [];

var vao_cube_modelLoading = [];
var vao_mercedes_modelLoading = [];
var vbo_mercedes_modelLoading = [];


var vao_teapot = [];
var vbo_teapot = [];



var vbo_cube_tp_modelLoading ;
    

var modelLoadingProgramObject;

var TeapotTransX = 2.0500000000000007;
var TeapotTransY = 0.9000000000000002;
var TeapotTransZ = -16.100000000000016;

var TeapotScale = 0.1199999999999994;


function initializeModel(){
	//Get OpenGL context
	gl=canvas.getContext("webgl2");
	if(gl == null)
		console.log("Obtaining 2D webgl2 failed\n");
	else
		console.log("Obtaining 2D webgl2 succeeded\n");
	
	gl.viewportWidth  = canvas.width;
	gl.viewportHeight  = canvas.height;
	

	var modelLoadingProgramObject;
	//vertex shaderProgramObject
	var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
  "     layout(location  = 0)in vec4 vPosition;" +
		"layout(location  = 1)in vec3 vNormal;" +
		"layout(location = 2)in vec2 vTexCoord;" +
		"out vec2 out_TexCoord;" +
		"uniform mat4 u_modelMatrix;" +
		"uniform mat4 u_viewMatrix;" +
		"uniform mat4 u_projectionMatrix;" +
		"uniform mediump int u_LKeyPressed;" +
		"out vec3 tNorm;" +
		"out vec3 light_direction;" +
		"out vec3 viewVector;" +
		"uniform vec4 u_LightPosition;" +
		

		"void main(void)" +
		"{" +
		"if(u_LKeyPressed == 1)" +
		"{" +
		"vec4 eye_coordinates = u_viewMatrix * u_modelMatrix *  vPosition;" +
		"tNorm = mat3(u_viewMatrix * u_modelMatrix) * vNormal;" +
		"light_direction = vec3(u_LightPosition - eye_coordinates);" +
		"viewVector = vec3(-eye_coordinates.xyz);" +
		"}" +
		"gl_Position = u_projectionMatrix * u_viewMatrix *u_modelMatrix * vPosition;" +
		"out_TexCoord = vTexCoord;" +
		"}";
	vertexShaderObject_modelLoading=gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShaderObject_modelLoading, vertexShaderSourceCode);
	gl.compileShader(vertexShaderObject_modelLoading);
	if(gl.getShaderParameter(vertexShaderObject_modelLoading,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(vertexShaderObject_modelLoading);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	
	//fragmentShader
	var fragmentShaderSource =
	"#version 300 es"+
	"\n"+
	"precision highp  float;" +
	"in vec2 out_TexCoord;" +
		"in vec3 tNorm;" +
		"in vec3 light_direction;" +
		"in vec3 viewVector;" +
		"vec3 phongADSLight;" +
		"uniform vec3 u_LDUniform;" +
		"uniform vec3 u_LAUniform;" +
		"uniform vec3 u_LSUniform;" +
		"uniform vec3 u_KDUniform;" +
		"uniform vec3 u_KAUniform;" +
		"uniform vec3 u_KSUniform;" +
		"uniform float u_MaterialShininess;" +
		"out vec4 FragColor;" +
		"uniform mediump int u_LKeyPressed;" +
		"uniform highp sampler2D diffuseMap; " +
		"void main(void)" +
		"{" +
		
		"if(u_LKeyPressed == 1)" +
		"{" +
		"vec3 normalizedTNorm = normalize(tNorm);" +
		"vec3 normalizedLightDirection = normalize(light_direction);" +
		"vec3 normalizedViewVector = normalize(viewVector);" +
		"float tNormal_dot_lightDirection = max(dot(normalizedLightDirection,normalizedTNorm),0.0);" +
		"vec3 reflectionVector = reflect(-normalizedLightDirection,normalizedTNorm);" +
		"vec3 ambient = u_LAUniform * u_KAUniform;" +
		"vec3 diffuse = u_LDUniform * u_KDUniform * tNormal_dot_lightDirection;" +
		"vec3 specular = u_LSUniform * u_KSUniform * pow(max(dot(reflectionVector,normalizedViewVector),0.0),u_MaterialShininess);" +
		"phongADSLight = ambient + diffuse + specular;" +
		"}" +
		"else" +
		"{" +
		"phongADSLight = vec3(1.0,1.0,1.0);" +
		"}" +
		"vec4 color = texture(diffuseMap, out_TexCoord);" +
		"FragColor =  vec4((vec3(color) * phongADSLight) , 1.0);;" +
		"}";
	fragmentShaderObject_modelLoading = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShaderObject_modelLoading,fragmentShaderSource);
	gl.compileShader(fragmentShaderObject_modelLoading);
	if(gl.getShaderParameter(fragmentShaderObject_modelLoading,gl.COMPILE_STATUS) == false)
	{
		var error=gl.getShaderInfoLog(fragmentShaderObject_modelLoading);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//shader program
	modelLoadingProgramObject=gl.createProgram();
	gl.attachShader(modelLoadingProgramObject, vertexShaderObject_modelLoading);
	gl.attachShader(modelLoadingProgramObject, fragmentShaderObject_modelLoading);
	
	//pre-link binidng of shader program object with vertex shader attributes
	// gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_VERTEX, "vPosition");
	// gl.bindAttribLocation(shaderProgramObject, WebGLMacros.VDG_ATTRIBUTE_NORMAL, "vNormal");
	
	//linking
	gl.linkProgram(modelLoadingProgramObject);
	if(!gl.getProgramParameter(modelLoadingProgramObject, gl.LINK_STATUS))
	{
		var error = gl.getProgramInfoLog(modelLoadingProgramObject);
		if(error.length > 0)
		{
			alert(error);
			uninitialize();
		}
	}
	//get MVP uniform
	modelUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_modelMatrix");
	viewUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_viewMatrix");
	projectionUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_projectionMatrix");
	LKeyPressed_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LKeyPressed");
	LAUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LAUniform");		
	LDUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LDUniform");
	LSUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LSUniform");
	
	KAUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KAUniform");
	KDUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KDUniform");
	KSUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_KSUniform");
	
	LightPositionUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_LightPosition");
	MaterialShininessUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "u_MaterialShininess");
	samplerUniform_modelLoading = gl.getUniformLocation(modelLoadingProgramObject, "diffuseMap");



	// sphere = new Mesh();
	// makeSphere(sphere,2.0,30,30);
	


	return modelLoadingProgramObject;
}

function parseOBJ(text) {
    // because indices are base 1 let's just fill in the 0th data
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];
    const objColors = [[0, 0, 0]];
  
    // same order as `f` indices
    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
      objColors,
    ];
  
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
      [],   // colors
    ];
  
    const materialLibs = [];
    const geometries = [];
    let geometry;
    let groups = ['default'];
    let material = 'default';
    let object = 'default';
  
    const noop = () => {};
  
    function newGeometry() {
      // If there is an existing geometry and it's
      // not empty then start a new one.
      if (geometry && geometry.data.position.length) {
        geometry = undefined;
      }
    }
  
    function setGeometry() {
      if (!geometry) {
        const position = [];
        const texcoord = [];
        const normal = [];
        const color = [];
        webglVertexData = [
          position,
          texcoord,
          normal,
          color,
        ];
        geometry = {
          object,
          groups,
          material,
          data: {
            position,
            texcoord,
            normal,
            color,
          },
        };
        geometries.push(geometry);
      }
    }
  
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
        // if this is the position index (index 0) and we parsed
        // vertex colors then copy the vertex colors to the webgl vertex color data
        if (i === 0 && objColors.length > 1) {
          geometry.data.color.push(...objColors[index]);
        }
      });
    }
  
    const keywords = {
      v(parts) {
        // if there are more than 3 values here they are vertex colors
        if (parts.length > 3) {
          objPositions.push(parts.slice(0, 3).map(parseFloat));
          objColors.push(parts.slice(3).map(parseFloat));
        } else {
          objPositions.push(parts.map(parseFloat));
        }
      },
      vn(parts) {
        objNormals.push(parts.map(parseFloat));
      },
      vt(parts) {
        // should check for missing v and extra w?
        objTexcoords.push(parts.map(parseFloat));
      },
      f(parts) {
        setGeometry();
        const numTriangles = parts.length - 2;
        for (let tri = 0; tri < numTriangles; ++tri) {
          addVertex(parts[0]);
          addVertex(parts[tri + 1]);
          addVertex(parts[tri + 2]);
        }
      },
      s: noop,    // smoothing group
      mtllib(parts, unparsedArgs) {
        // the spec says there can be multiple filenames here
        // but many exist with spaces in a single filename
        materialLibs.push(unparsedArgs);
      },
      usemtl(parts, unparsedArgs) {
        material = unparsedArgs;
        newGeometry();
      },
      g(parts) {
        groups = parts;
        newGeometry();
      },
      o(parts, unparsedArgs) {
        object = unparsedArgs;
        newGeometry();
      },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    // remove any arrays that have no entries.
    for (const geometry of geometries) {
      geometry.data = Object.fromEntries(
          Object.entries(geometry.data).filter(([, array]) => array.length > 0));
    }
  console.log("no of geometries" +geometries);
    return {
      geometries,
      materialLibs,
    };
}			

function parseMapArgs(unparsedArgs) {
// TODO: handle options
return unparsedArgs;
}

function parseMTL(text) {
const materials = {};
let material;

const keywords = {
newmtl(parts, unparsedArgs) {
material = {};
materials[unparsedArgs] = material;
},
/* eslint brace-style:0 */
Ns(parts)       { material.shininess      = parseFloat(parts[0]); },
Ka(parts)       { material.ambient        = parts.map(parseFloat); },
Kd(parts)       { material.diffuse        = parts.map(parseFloat); },
Ks(parts)       { material.specular       = parts.map(parseFloat); },
Ke(parts)       { material.emissive       = parts.map(parseFloat); },
map_Kd(parts, unparsedArgs)   { material.diffuseMap = parseMapArgs(unparsedArgs); },
map_Ns(parts, unparsedArgs)   { material.specularMap = parseMapArgs(unparsedArgs); },
map_Bump(parts, unparsedArgs) { material.normalMap = parseMapArgs(unparsedArgs); },
Ni(parts)       { material.opticalDensity = parseFloat(parts[0]); },
d(parts)        { material.opacity        = parseFloat(parts[0]); },
illum(parts)    { material.illum          = parseInt(parts[0]); },
};

const keywordRE = /(\w*)(?: )*(.*)/;
const lines = text.split('\n');
for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
const line = lines[lineNo].trim();
if (line === '' || line.startsWith('#')) {
continue;
}
const m = keywordRE.exec(line);
if (!m) {
    continue;
}
const [, keyword, unparsedArgs] = m;
const parts = line.split(/\s+/).slice(1);
const handler = keywords[keyword];
if (!handler) {
    console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
    continue;
}
    handler(parts, unparsedArgs);
}

return materials;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function create1PixelTexture(gl, pixel) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array(pixel));
        return texture;
}

function createTexture(gl, url) {
        const texture = create1PixelTexture(gl, [128, 192, 255, 255]);
        // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
        } else {
        // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
});
return texture;
}


async function loadModel(modelName,vao_cube,vbo_cube,callback)
{
  var parts_modelLoading;
  
  let numElements_modelLoading = [];
  numElements_modelLoading.length = 0;
  var numElementsCounter_modelLoading = 0;

                const objHref = modelName;  /* webglfundamentals: url */
                const response = await fetch(objHref);
                const text = await response.text();
                const obj = parseOBJ(text);
                console.log(obj.geometries.length);
                const baseHref = new URL(objHref, window.location.href);
                const matTexts = await Promise.all(obj.materialLibs.map(async filename => {
                const matHref = new URL(filename, baseHref).href;
                const response = await fetch(matHref);
                return await response.text();
                }));

                materials_ModelLoading = parseMTL(matTexts.join('\n'));

                const textures = {
                defaultWhite: create1PixelTexture(gl, [255, 255, 255, 255]),
                };

                // load texture for materials
                for (material_modelLoading of Object.values(materials_ModelLoading)) {
                    Object.entries(material_modelLoading)
                    .filter(([key]) => key.endsWith('Map'))
                    .forEach(([key, filename]) => {
                    let texture = textures[filename];
                    if (!texture) {
                    const textureHref = new URL(filename, baseHref).href;
                    texture = createTexture(gl, textureHref);
                    textures[filename] = texture;
                    }
                    material_modelLoading[key] = texture;
                });
                }

                const defaultMaterial = {
                diffuse: [1, 1, 1],
                diffuseMap: textures.defaultWhite,
                ambient: [0, 0, 0],
                specular: [1, 1, 1],
                shininess: 400,
                opacity: 1,
                };

                //diffuseMap: textures.defaultWhite,

                parts_modelLoading = obj.geometries.map(({material, data}) => {
                if (data.color) {
                if (data.position.length === data.color.length) {
                // it's 3. The our helper library assumes 4 so we need
                // to tell it there are only 3.
                data.color = { numComponents: 3, data: data.color };
                }
                } else {
                // there are no vertex colors so just use constant white
                data.color = { value: [1, 1, 1, 1] };
                }

                // create a buffer for each array by calling
                // gl.createBuffer, gl.bindBuffer, gl.bufferData
                const bufferInfo = null; //webglUtils.createBufferInfoFromArrays(gl, data);


                var length = vao_cube.length + 1;
                var vboLength = vbo_cube.length + 4;
                for(var i = vao_cube.length; i < length;i ++)
                {        
                vao_cube[i]=gl.createVertexArray();

                gl.bindVertexArray(vao_cube[i]);

                var j = vbo_cube.length;
                {

                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.position), gl.STATIC_DRAW);
                gl.vertexAttribPointer(0,
                        3,
                        gl.FLOAT,
                        false, 0, 0);
                gl.enableVertexAttribArray(0);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                if(obj.geometries[i].data.normal != null)
                {
                j +=1;
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.normal), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1,3,gl.FLOAT,false, 0, 0);
                gl.enableVertexAttribArray(1);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                }
                if(obj.geometries[i].data.texcoord != null)
                {
                j +=1;
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER,  vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.texcoord), gl.STATIC_DRAW);
                gl.vertexAttribPointer(2,
                            2,
                            gl.FLOAT,
                            false, 0, 0);

                gl.enableVertexAttribArray(2);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);

                }

               
                if(obj.geometries[i].data.color != null)
                {
                j += 1;        
                vbo_cube[j] =  gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo_cube[j]);
                gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(obj.geometries[i].data.color), gl.STATIC_DRAW);
                gl.vertexAttribPointer(3,
                            4,
                            gl.FLOAT,
                            false, 0, 0);
                // gl.enableVertexAttribArray(3);
                }
                gl.bindVertexArray(null);
                }
                }
                vbo_cube_tp_modelLoading = gl.createBuffer();
                // vbo_Normal_cube =  gl.createBuffer();
                // vbo_TexCoord_cube =  gl.createBuffer();
                // vbo_color_cube =  gl.createBuffer();
                GetIndicesAndElements(gl,data);

                return {
                material: {
                ...defaultMaterial,
                ...materials_ModelLoading[material],
                }
                };
                });




                function GetIndicesAndElements(gl,arrays)
                {

                let indices = arrays.indices;
                if (indices) {
                //  indices = makeTypedArray(indices, 'indices');
                //  bufferInfo.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
                //  bufferInfo.numElements = indices.length;
                } else {
                numElements_modelLoading[numElementsCounter_modelLoading] = getNumElementsFromNonIndexedArrays(arrays);
                console.log(numElementsCounter_modelLoading);
                numElementsCounter_modelLoading += 1;
             
                }
                }

                function getNumElementsFromNonIndexedArrays(arrays) {

                const positionKeys = ['position', 'positions', 'a_position'];
                let key;
                for (const k of positionKeys) {
                if (k in arrays) {
                key = k;
                break;
                }
                }
                key = key || Object.keys(arrays)[0];
                const array = arrays[key];
                const length = getArray(array).length;
                const numComponents = getNumComponents(array, key);
                const numElements = length / numComponents;
                if (length % numComponents > 0) {
                throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
                }
                return numElements;
                }

                function getArray(array) {
                return array.length ? array : array.data;
                }


                function guessNumComponentsFromName(name, length) {
                const texcoordRE = /coord|texture/i;
                const colorRE = /color|colour/i;
                let numComponents;
                if (texcoordRE.test(name)) {
                numComponents = 2;
                } else if (colorRE.test(name)) {
                numComponents = 4;
                } else {
                numComponents = 3;  // position, normals, indices ...
                }

                if (length % numComponents > 0) {
                throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
                }

                return numComponents;
                }

                function getNumComponents(array, arrayName) {
                return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
                }

                if(parts_modelLoading.length > 0)
                  callback(parts_modelLoading,numElements_modelLoading)                  
                else
                  console.log("did not succeeed");

}


function drawModel()
{



	gl.useProgram(modelLoadingProgramObject);
	//lighting details
	
// if(gParts_Table)
//   console.log(gParts_Table.length);


	var modelMatrix = mat4.create();
	var viewMatrix = mat4.create();
	
	//var angleInRadian = degreeToRadian(gAngle);
	mat4.translate(modelMatrix, modelMatrix, [TeapotTransX,-TeapotTransY,TeapotTransZ]);
  mat4.scale(modelMatrix,modelMatrix,[TeapotScale,TeapotScale,TeapotScale]);
	//mat4.rotateY(modelMatrix,modelMatrix,deg2rad(gAngleTriangle_modelLoading));
	
	gAngleTriangle_modelLoading += 0.02;
	//mat4.rotateY(modelMatrix,modelMatrix,degreeToRadian(gAngleTriangle));
	//mat4.multiply(modelViewMatrix, modelViewMatrix, modelMatrix);
	gl.uniformMatrix4fv(modelUniform_modelLoading,false,modelMatrix);
	gl.uniformMatrix4fv(viewUniform_modelLoading,false,gViewMatrix);
	gl.uniformMatrix4fv(projectionUniform_modelLoading,false,perspectiveMatrix);
	
/************ TEAPOT ************************ */


  if(gParts_Teapot)
	{
		

		for(var i = 0; i < gParts_Teapot.length;i++)
		{

			if(gbLighting_modelLoading){
				gl.uniform1i(LKeyPressed_modelLoading, 1);
				gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
				gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
				gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
				gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
				//set material properties
				gl.uniform3fv(KAUniform_modelLoading, gParts_Teapot[i].material.ambient);
				gl.uniform3fv(KDUniform_modelLoading, gParts_Teapot[i].material.diffuse);
				gl.uniform3fv(KSUniform_modelLoading, gParts_Teapot[i].material.specular);
				gl.uniform1f(MaterialShininessUniform_modelLoading,gParts_Teapot[i].material.shininess);
				
				}
				else
				{
						gl.uniform1i(LKeyPressed_modelLoading, 0);
				}
			gl.bindTexture(gl.TEXTURE_2D, gParts_Teapot[i].material.diffuseMap);

				gl.bindVertexArray(vao_teapot[i]);
		
				gl.drawArrays(gl.TRIANGLES,0,numElements_Teapot[i]);
		}
        
	}



/*****************************************    -------------------------        ************************** */







	// if(gParts_Table)
	// {
		

	// 	for(var i = 0; i < gParts_Table.length;i++)
	// 	{

	// 		if(gbLighting_modelLoading){
	// 			gl.uniform1i(LKeyPressed_modelLoading, 1);
	// 			gl.uniform3fv(LAUniform_modelLoading, light_ambient_modelLoading);
	// 			gl.uniform3fv(LDUniform_modelLoading, light_diffuse_modelLoading);
	// 			gl.uniform3fv(LSUniform_modelLoading, light_specular_modelLoading);
				
	// 			gl.uniform4fv(LightPositionUniform_modelLoading, light_position_modelLoading);
				
	// 			//set material properties
	// 			gl.uniform3fv(KAUniform_modelLoading, gParts_Table[i].material.ambient);
	// 			gl.uniform3fv(KDUniform_modelLoading, gParts_Table[i].material.diffuse);
	// 			gl.uniform3fv(KSUniform_modelLoading, gParts_Table[i].material.specular);
	// 			gl.uniform1f(MaterialShininessUniform_modelLoading,gParts_Table[i].material.shininess);
				
	// 			}
	// 			else
	// 			{
	// 					gl.uniform1i(LKeyPressed_modelLoading, 0);
	// 			}
	// 		gl.bindTexture(gl.TEXTURE_2D, gParts_Table[i].material.diffuseMap);

	// 			gl.bindVertexArray(vao_mercedes_modelLoading[i]);
		
	// 			gl.drawArrays(gl.TRIANGLES,0,numElements_Teapot[i]);
	// 	}
        
	// }


  
	
	
	gl.useProgram(null);





	console.log(i);
	
	// if( gAngleTriangle_modelLoading >= 360.0)
	// 		gAngleTriangle_modelLoading = 0.0;
	// 	else
	// 		gAngleTriangle_modelLoading = gAngleTriangle_modelLoading + 1.0;
	
	// if( gAngleSquare_modelLoading >= 360.0)
	// 		gAngleSquare_modelLoading = 0.0;
	// 	else
	// 		gAngleSquare_modelLoading = gAngleSquare_modelLoading + 1.0;
}