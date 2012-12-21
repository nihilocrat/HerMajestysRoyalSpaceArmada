
public var left : int;
public var bottom : int;
public var width : int;
public var height : int;

//var spriteManager : SpriteManager;

private var sprite;// : Sprite;

function Start() {
    //var comp = spriteManager.GetComponent(SpriteManager);
	var spriteManager = SpriteManager.GetSingleton();
    sprite = spriteManager.AddSprite(gameObject, // The game object to associate the sprite to
										transform.localScale.x, 		// The width of the sprite
										transform.localScale.y, 		// The height of the sprite
										left, 		// Left pixel
										bottom, 		// Bottom pixel
									    width, 		// Width in pixels
										height, 		// Height in pixels
										true);		// Billboarded?
	sprite.billboarded = true;
}

function Update() {
	/*var lookVector = (Camera.main.transform.position - transform.position).normalized;
	transform.LookAt(Camera.main.transform, Vector3.Cross(lookVector, ));
	sprite.Transform();*/
	// doesn't really do what I want it to...
	sprite.TransformBillboarded(Camera.main.transform);
}

function OnDisable() {
	var spriteManager = SpriteManager.GetSingleton();
	spriteManager.RemoveSprite(sprite);
}

@script AddComponentMenu("SpriteManager/SpriteObject")

