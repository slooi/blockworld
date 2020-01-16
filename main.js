console.log('loaded main.js')
var webglObj
setup()

async function setup(){
	// load webgltextures
	const imageTexture = await loadTextures()

	// create webglobj
	webglObj = createWebglObj(imageTexture)

	// game loop
	// webglObj.addBlocks([
	// 	//	X		Y			
	// 			3, 3,
	// 			-3, 2
	// 	],[
	// 	//	TL TR BL BR
	// 			1,	1,	1,	0.2,
	// 			1,	1,	1,	1	
	// 	],[
	// 				//blockIndex
	// 				1,
	// 				1,
	// 		])
		// webglObj.setBlocks([
		// 	//	X		Y			
		// 			0, 0,
		// 			2, 0,
		// 			2, 1,
		// 			2, 2,
		// 			1, 2,
		// 			0, 2,
		// 			-1, 2,
		// 			-1, 1,
		// 			-1, 0
		// 	],[
		// 		//	TL TR BL BR
		// 				9/24,	12/24,	1/24,	6/24,
		// 				10/24,	3/24,	9/24,	0,
		// 				5/24,	0,	2/24,	0,
		// 				2/24,	0,	0,	0,
		// 				3/24,	2/24,	0,	0,
		// 				1,	1,	1,	1,
		// 				1,	1,	1,	1,
		// 				1,	1,	1,	1,
		// 				1,	1,	1,	1
		// 		],[
		// 			//	blockIndex
		// 					1,
		// 					1,
		// 					1,
		// 					1,							
		// 					1,
		// 					1,
		// 					1,
		// 					1,
		// 					1
		// 			])
	gameLoop(webglObj)
}

function gameLoop(webglObj){

	webglObj.render()	
}