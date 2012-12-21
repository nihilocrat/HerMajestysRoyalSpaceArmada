public var mouseScrolling = true;
public var movespeed = 20.0;
public var zoomspeed = 50.0;

// FIXME : replace with huge galaxy-size trigger to keep EVERYTHING inside
public var viewBounds = 70.0;
public var scrollDeadzone = 0.9;
public var panDeadzone = 0.25;

public var minZoom = 1.0;
public var maxZoom = 50.0;
private var zoomAmt = 10.0;

private var cam : Camera;

private var moveVec : Vector3;
private var zoomVec : Vector3;

private var original_rot : Quaternion;
private var original_zoom : float;

function Start()
{
	cam = Camera.main;
	
	original_rot = transform.rotation;
	original_zoom = transform.position.y;
	
	zoomAmt = original_zoom;
}

function Update()
{
	moveVec = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
		
	// keyboard controls override mouse edge scolling 
	if(mouseScrolling && !Input.GetMouseButton(0) &&
		moveVec.x == 0 && moveVec.z == 0) {
		moveVec = MouseMotion(scrollDeadzone) * movespeed * Time.deltaTime;
	}
	else if (Input.GetButton("Pan")) {
		moveVec = MouseMotion(panDeadzone) * movespeed * 3.0 * Time.deltaTime;
	}
	else {
		moveVec *= movespeed * Time.deltaTime;
	}
	
	// don't calculate if there's no point
	if(moveVec.sqrMagnitude > 0) {
		moveVec = transform.TransformDirection(moveVec);
		moveVec.y = 0;
	}

	// Zooming code
	// we have to keep track of our own distance from the zoom point (zoomAmt)
	zoomVec = Vector3.zero;
	if( Input.GetAxis("Zoom") != 0.0 )
	{
		//var zoomAmt = 1.0 + (-Input.GetAxis("Zoom") * zoomspeed * Time.deltaTime);
		//distance = Mathf.Max(minZoom, Mathf.Min(maxZoom, distance * zoomAmt));f
		var zoomAdjust = Input.GetAxis("Zoom") * zoomspeed * Time.deltaTime * zoomAmt;
		
		if( (zoomAmt - zoomAdjust > minZoom) &&
			(zoomAmt - zoomAdjust < maxZoom) )
		{
			zoomAmt -= zoomAdjust;
			zoomVec = new Vector3(0,0,zoomAdjust);
		}
	}
	
	// adjust panning speed based on zoom amount
	//zoomVec *= (zoomAmt * 0.1);
	moveVec *= (zoomAmt / 2);
		
	if(transform.position.x < -viewBounds && moveVec.x < 0) moveVec.x = 0;
	else if(transform.position.x > viewBounds && moveVec.x > 0) moveVec.x = 0;
	if(transform.position.z < -viewBounds && moveVec.z < 0) moveVec.z = 0;
	else if(transform.position.z > viewBounds && moveVec.z > 0) moveVec.z = 0;
	
	//if(cam.transform.position.y < -viewBounds && zoomVec.y < 0) zoomVec.y = 0;
	//else if(cam.transform.position.y > viewBounds && zoomVec.y > 0) zoomVec.y = 0;
	
	
	if(Input.GetButton("SpeedUp")) moveVec *= 3;
	
	transform.Translate(moveVec, Space.World);
	
	//iTween.Stop();
	//iTween.MoveTo(gameObject, transform.TransformPoint(zoomVec), 0.2);
	transform.Translate(zoomVec, Space.Self);

	/*
	if(transform.position.y < minZoom) transform.position.y = minZoom;
	else if(transform.position.y > maxZoom) transform.position.y = maxZoom;
	*/
}

function MouseMotion(deadzone : float) : Vector3 {
	var moveVec = new Vector3();
    var cursor = new Vector2();
	var realmouse_x = Mathf.Clamp(Input.mousePosition.x, 0, Screen.width);
	var realmouse_y = Mathf.Clamp(Input.mousePosition.y, 0, Screen.height);
    cursor.x = (realmouse_x - Screen.width/2) / (Screen.width/2);
    cursor.y = (realmouse_y - Screen.height/2) / (Screen.height/2);

    var turnx = 0.0;
    var turny = 0.0;

    // clamp the cursor to the deadzone
    if(cursor.x > deadzone) {
        turnx = (cursor.x - deadzone) / (1.0 - deadzone);
    }
    else if (cursor.x < -deadzone) {
        turnx = (cursor.x + deadzone) / (1.0 - deadzone);
    }
    else {
        turnx = 0.0;
    }
    if(cursor.y > deadzone) {
        turny = (cursor.y - deadzone) / (1.0 - deadzone);
    }
    else if (cursor.y < -deadzone) {
        turny = (cursor.y + deadzone) / (1.0 - deadzone);
    }
    else {
        turny = 0.0;
    }
    
	/*
    var turn_direction = Vector3 (-turny, turnx, Input.GetAxis("Roll"));
    //var turn_direction = Vector3 (Input.GetAxis("Vertical"), Input.GetAxis("Vertical"), Input.GetAxis("Roll"));
    puppet.Turn(turn_direction);

    var camera_bounce = 0.02;

    //cam.transform.position.x = -turnx * camera_bounciness;
    cam.transform.localPosition = new Vector3(turnx * camera_bounce, 0.1 + turny * camera_bounce, -0.3);
	*/
	
	return new Vector3(turnx, 0, turny);
}

function Reset()
{
	transform.rotation = original_rot;
	transform.position.y = original_zoom;
}

function SetZoom(value : float) {
	zoomAmt = value;
}

function GetZoom() {
	return zoomAmt;
}