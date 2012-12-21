var target : Transform;
var distance = 10.0;

var xSpeed = 250.0;
var ySpeed = 120.0;

var yMinLimit = -20;
var yMaxLimit = 80;

private var x = 0.0;
private var y = 0.0;

public var zoomspeed = 20.0;
public var minZoom = 0.5;
public var maxZoom = 50.0;
private var original_distance : float;

@script AddComponentMenu("Camera-Control/Mouse Orbit")

function Awake() {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
		
	original_distance = distance;
}

function Start () {
}


function LateUpdate () {
	var zoomAmt = 1.0 + (-Input.GetAxis("Zoom") * zoomspeed * Time.deltaTime);
	distance = Mathf.Max(minZoom, Mathf.Min(maxZoom, distance * zoomAmt));
	
    if (target) {
        x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
 		
 		y = ClampAngle(y, yMinLimit, yMaxLimit);
 		       
        var rotation = Quaternion.Euler(y, x, 0);
        var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
        
        transform.rotation = rotation;
        transform.position = position;
    }
}

function GetStartPosition() {
	if(target == null) return null;

	/*
	x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
	y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
	
	y = ClampAngle(y, yMinLimit, yMaxLimit);
	*/       
	var rotation = Quaternion.Euler(y, x, 0);
	var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
	
	return position;
}

function Reset() {
	distance = original_distance;
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}