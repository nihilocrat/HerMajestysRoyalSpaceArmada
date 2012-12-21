public var size = 10;

public var slots = Array();

function Add (obj : GameObject) {
	if(slots.length >= size) return false;
	
	slots.Add(obj);
	return true;
}

function Tick(dt : float) {

}