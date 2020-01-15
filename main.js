console.log('loaded main.js')
var webglObj
setup()

async function setup(){
	// load webgltextures
	const imageTexture = await loadTextures()

	// create webglobj
	webglObj = createWebglObj(imageTexture)

	// game loop
	webglObj.addBlocks([
		//	X		Y			
				3, 3,
				-3, 2
		],[
		//	TL TR BL BR
				1,	1,	1,	1,
				1,	1,	1,	1	
		])
		// webglObj.setBlocks([
		// 	//	X		Y			
		// 			3, 3
		// 	],[
		// 	//	TL TR BL BR
		// 			1,	1,	1,	1
		// 	])
	gameLoop(webglObj)
}

function gameLoop(webglObj){

	webglObj.render()	
}