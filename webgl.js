console.log('loaded webgl.js')

// Shader Source
const vsSource = document.getElementById('vsSource').textContent
const fsSource = document.getElementById('fsSource').textContent

// Canvas
const canvas = document.createElement('canvas')
document.body.append(canvas)
canvas.width = 300
canvas.height = 300	

// gl
let gl = canvas.getContext('webgl')
if(!gl){
	gl = canvas.getContext('experimental-webgl')
}
if(!gl){
	alert('ERROR all versions of webgl are not supported on your browser, please use a browser which supports webgl')
}

// Viewport &
gl.viewport(0,0,300,300	)
gl.clearColor(0.4,0.6,0.8,1)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// program
// vertexshader
const program = buildProgram()
gl.useProgram(program)

// Attribute Locations
let attribLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);i++){
	const attribName = gl.getActiveAttrib(program,i).name
	attribLocations[attribName] = gl.getAttribLocation(program,attribName)
}
console.log('attribLocations',attribLocations)

// VERTICES
// Vertices
const vertices = new Float32Array([
//	X		Y			
		-0.5, 0.0,
		0.5, 0.0,	
		0.0, 0.5
])

// Vertex Buffer
const vertexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW)

// Vertex Attribute Pointer
gl.vertexAttribPointer(
	attribLocations.a_VertexPositions,
	2,
	gl.FLOAT,
	false,
	2*Float32Array.BYTES_PER_ELEMENT,
	0
)
gl.enableVertexAttribArray(attribLocations.a_VertexPositions)

// textures

// Uniform Locations
let uniformLocations = []
for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){
	const uniformName = gl.getActiveUniform(program,i).name
	console.log('asd',gl.getActiveUniform(program,i))
	uniformLocations[uniformName] = gl.getUniformLocation(program,uniformName)
}


// TEXTURES
const texture = gl.createTexture()
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D,texture)
gl.uniform1i(uniformLocations.u_TileSheet,0)
var pixel = new Uint8Array([
	255,0,0,255, 
	0,255,0,255,
	0,0,255,255, 
	0,100,0,255
]);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2,2,0,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)	
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)



const shadowTexture = gl.createTexture()
gl.activeTexture(gl.TEXTURE1)
gl.bindTexture(gl.TEXTURE_2D,shadowTexture)
gl.uniform1i(uniformLocations.u_ShadowTiles,1)

const diameter = 8
var pixel = []
for(let i=0;i<diameter;i++){
	for(let j=0;j<diameter;j++){
		const val = (i*(14*16)/diameter) 
		pixel.push(val)
		pixel.push(val)
		pixel.push(val)
		pixel.push(255)
	}
}
pixel = new Uint8Array(pixel)
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,diameter,diameter,0,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)	
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)



gl.drawArrays(gl.POINTS,0,vertices.length/2)
// gl.drawArrays(gl.TRIANGLES,0,vertices.length/2)




function buildShader(type,shaderSource){
	const shader = gl.createShader(type)
	gl.shaderSource(shader,shaderSource)
	gl.compileShader(shader)

	// Check shader
	if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error('ERROR compiling shader type:',type,'Info:',gl.getShaderInfoLog(shader))
	return shader
}

function buildProgram(){
	const program = gl.createProgram()
	gl.attachShader(program,buildShader(gl.VERTEX_SHADER,vsSource))
	gl.attachShader(program,buildShader(gl.FRAGMENT_SHADER,fsSource))
	gl.linkProgram(program)

	// Check program
	if(!gl.getProgramParameter(program,gl.LINK_STATUS)) 
		throw new Error('ERROR linking program. Info:',gl.getProgramInfoLog(program))

	gl.validateProgram(program)	
	if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS))
		throw new Error('ERROR validating program. Info:',gl.getProgramInfoLog(program))

	return program
}