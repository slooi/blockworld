console.log('loaded webgl.js')

function loadTextures(){
	return new Promise((resolve)=>{
		imageTexture = new Image()
		imageTexture.onload = function(){
			resolve(imageTexture)
		}
		imageTexture.src = "tileSheet.png"
	})
}

function createWebglObj(imageTexture){
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

	// Viewport & clear
	gl.viewport(0,0,canvas.width,canvas.height)
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

	// Vertices
	var vertices = [
	//	X		Y			
			0, 0.0,
			1, 0.0,	
			0.0, 1
	]

	// Vertex Buffer
	const vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)

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


	// lightDirection
	var lightDirections = [
		//	TL TR BL BR
				0,	1,	1,	1,
				1,	1,	1,	1,
				1,	1,	1,	1
		]
	
	// Vertex Buffer
	const lightDirectionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER,lightDirectionBuffer)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lightDirections),gl.STATIC_DRAW)

	// Vertex Attribute Pointer
	gl.vertexAttribPointer(
		attribLocations.a_LightDirection,
		4,
		gl.FLOAT,
		false,
		4*Float32Array.BYTES_PER_ELEMENT,
		0
	)
	gl.enableVertexAttribArray(attribLocations.a_LightDirection)



	// blockIndexes
	var blockIndexes = [
		//	blockIndex
				1,
				1,
				1
		]
	
	// Vertex Buffer
	const blockIndexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER,blockIndexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(blockIndexes),gl.STATIC_DRAW)

	// Vertex Attribute Pointer
	gl.vertexAttribPointer(
		attribLocations.a_BlockIndex,
		1,
		gl.FLOAT,
		false,
		1*Float32Array.BYTES_PER_ELEMENT,
		0
	)
	gl.enableVertexAttribArray(attribLocations.a_BlockIndex)



	// Uniform Locations
	let uniformLocations = []
	for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){
		const uniformName = gl.getActiveUniform(program,i).name
		uniformLocations[uniformName] = gl.getUniformLocation(program,uniformName)
	}


	gl.uniform2fv(uniformLocations.u_CamPosition,[0,0])

	// TEXTURES
	// Use image for texture
	const texture = gl.createTexture()
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D,texture)
	gl.uniform1f(uniformLocations.u_TileSheet,0)
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imageTexture)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)	
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)

	// Create texture manually
	// const texture = gl.createTexture()
	// gl.activeTexture(gl.TEXTURE0)
	// gl.bindTexture(gl.TEXTURE_2D,texture)
	// gl.uniform1i(uniformLocations.u_TileSheet,0)
	// var pixel = new Uint8Array([
	// 	255,0,0,255, 
	// 	0,255,0,255,
	// 	0,0,255,255, 
	// 	0,100,0,255
	// ]);
	// gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2,2,0,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
	// gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)	
	// gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
	// gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
	// gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)

	buildAllLightTextures()




	// gl.drawArrays(gl.TRIANGLES,0,vertices.length/2)

	// FUNCTIONS

	function buildAllLightTextures(){
		const diameter = 2
		const TLLight = generateTLLight(diameter)
		buildLightTexture(TLLight,diameter,1,'u_LightTileTL')
		const TRLight = horizontalFlipArray(TLLight)
		buildLightTexture(TRLight,diameter,2,'u_LightTileTR')
		buildLightTexture(verticalFlipArray(TLLight),diameter,3,'u_LightTileBL')
		buildLightTexture(verticalFlipArray(TRLight),diameter,4,'u_LightTileBR')
	}

	function buildLightTexture(lightArray,diameter,textureNum,textureName){
		const lightTexture = gl.createTexture()
		gl.activeTexture(gl.TEXTURE0+textureNum)
		gl.bindTexture(gl.TEXTURE_2D,lightTexture)
		gl.uniform1i(uniformLocations[textureName],textureNum)
	
		const pixel = new Uint8Array(lightArray)
		gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,diameter,diameter,0,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)	
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
	}

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

	function bindAndBuffer(){
		gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER,lightDirectionBuffer)
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(lightDirections),gl.STATIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER,blockIndexBuffer)
		gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(blockIndexes),gl.STATIC_DRAW)
	}


	// Exposed Functions

	function addBlocks(newVertices,newLightDirections,newBlockIndexes){
		vertices.push(...newVertices)
		lightDirections.push(...newLightDirections)
		blockIndexes.push(...newBlockIndexes)

		bindAndBuffer()
	}

	function setBlocks(newVertices,newLightDirections,newBlockIndexes){
		vertices = newVertices
		lightDirections = newLightDirections
		blockIndexes = newBlockIndexes

		bindAndBuffer()
	}

	function render(){
		gl.drawArrays(gl.POINTS,0,vertices.length/2)
	}

	function showStats(){
		console.log('vertices',vertices)
		console.log('lightDirections',lightDirections)
	}

	return {
		render,
		setBlocks,
		addBlocks,
		showStats
	}
}


function generateTLLight(diameter){
	var pixel = []
	for(let i=0;i<diameter;i++){
		for(let j=0;j<diameter;j++){
			const iVal = i>j ? i : j
			const lightVal = 255 - iVal*255/(diameter-1)
			pixel.push(lightVal)
			pixel.push(lightVal)
			pixel.push(lightVal)
			pixel.push(255)
		}
	}
	return pixel
}

// Input: array
// Output: array
function horizontalFlipArray(array){
	const flippedArray = []
	const numOfPixCols = (array.length/4) ** 0.5	//exclusive of RGBA
	const numOfPixRows = numOfPixCols	//exclusive of RGBA
	const numOfElementsPerRow = array.length/numOfPixRows
	for(let i=0;i<numOfPixRows;i++){
		for(let j=numOfPixCols-1;j>=0;j--){
			const linearIndex = i * numOfElementsPerRow + j * 4 
			for(let k=0;k<4;k++){
				flippedArray.push(array[linearIndex+k])
			}
		}
	}
	return flippedArray
}
// Input: array
// Output: array
function verticalFlipArray(array){
	const flippedArray = []
	const numOfPixCols = (array.length/4) ** 0.5	//exclusive of RGBA
	const numOfPixRows = numOfPixCols	//exclusive of RGBA
	const numOfElementsPerRow = array.length/numOfPixRows
	for(let i=numOfPixRows-1;i>=0;i--){
		for(let j=0;j<numOfPixCols;j++){
			const linearIndex = i * numOfElementsPerRow + j * 4 
			for(let k=0;k<4;k++){
				flippedArray.push(array[linearIndex+k])
			}
		}
	}
	return flippedArray
}