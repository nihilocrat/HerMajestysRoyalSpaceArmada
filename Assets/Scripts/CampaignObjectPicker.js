import Globals;
import Utils;

public var minimumScreenY = 0.2;

public var nameDisplay : GUIText;

public var labelOffset = Vector3(0,1,0);

public var selected : Transform;

public var selectorMaterial : Texture2D;

private var selectedFleet : Squadron;
private var buttonDownPos : Vector2;
private var buttonUpPos : Vector2;

private var selectedFleets : Array;

private var lastHit : RaycastHit; 
private var cam : Camera;

private var hoverText : String;

private var pickerPlane : Plane;
private var guiPanel : GUIPanel;

private var singleton : CampaignObjectPicker;

private var currentPlayer : Player;

private var selectMin = 5;
private var assignFacingMin = 5;

/*
group select method:

get the camera projection of all Squadon objects
then treat group select as a 2D operation of 2D points inside an AABB
defined by the mouse location during the last mousebuttondown
and the mouse location during the current mousebuttonup
*/

function Start()
{
	cam = Camera.main;
	//currentPlayer = TeamSettings.getSingleton().humanPlayer;
	selectedFleets = new Array();
	
	// create a plane to perform orders on
	pickerPlane = new Plane(Vector3(0,1,0), Vector3(0,0,0));
	
	guiPanel = GetComponent(GUIPanel);
	
	singleton = this;
}

function Update () 
{ 
	var p : Vector3;
	var p2 : Vector3;
	var dir : Vector3;
		
	//if(Input.GetButtonUp("Fire1"))
	if(Input.GetMouseButtonDown(0))
	{
		buttonDownPos = Input.mousePosition;
	}
	else if(Input.GetMouseButtonUp(0) &&
			buttonDownPos.y > minimumScreenY * Screen.height)
	{
		// reset various stuff
		//selectedFleets.Clear();
		guiPanel.selectedGroup = null;
		
		buttonUpPos = Input.mousePosition;
		
		// if the difference is tiny then assume they are not trying to group select
		if((buttonUpPos - buttonDownPos).magnitude < selectMin) {
			// single select logic
			// NOTE : you can single select planets and enemy fleets
			// weird issues arise if we don't clear out the select group
			selectedFleets.Clear();
			//guiPanel.selected = null;
			
			if(castMouseRay()) {
				selectedFleet = OnMouseClick(lastHit);
			}
			else {
				//OnUnselect();
			}
			
		}
		else
		{
			// group select logic
			// NOTE: group select ONLY works for friendly fleets
			//guiPanel.selected = null;
			selectedFleets = DoGroupSelect(buttonDownPos, buttonUpPos);
			Debug.Log("selected: " + selectedFleets.length);
			if(selectedFleets.length == 1) {
				selectedFleet = selectedFleets[0];
			}
		}
		
		// now perform GUI actions and other things based on
		// what was just selected
		if(selectedFleet != null) {
			guiPanel.selected = selectedFleet.gameObject;
			guiPanel.selectedGroup = null;
		}
		if(selectedFleets != null && selectedFleets.length > 1) {
			//guiPanel.selected = null;
			guiPanel.selectedGroup = selectedFleets;
		}

		// do some witchcraft to make the OnGUI code not draw the box on next click
		buttonDownPos = buttonUpPos;
	}
	
	// camera controls
	// FIXME : these can probably go elsewhere, actually
	var mo : MouseOrbit;
	var cc : CameraControls;
	if(Input.GetButtonDown("Rotate") && guiPanel.selected != null) {
		var planet = guiPanel.selected.GetComponent(Planet);
		var squad = guiPanel.selected.GetComponent(Squadron);

		mo = Camera.main.GetComponent(MouseOrbit);
		cc = Camera.main.GetComponent(CameraControls);
		if(squad != null) {
			mo.target = squad.members[0].transform;
		}
		else if(planet != null) {
			mo.target = planet.transform;
		}
		
		mo.Reset();
		mo.distance = Mathf.Min(cc.GetZoom(), 10);
		
		iTween.MoveTo(mo.gameObject,
			iTween.Hash(
				"time", 0.4,
				"easetype", iTween.EaseType.easeOutExpo,
				"position", mo.GetStartPosition(),
				"oncomplete", "OnEnterOrbit", "oncompletetarget", gameObject
			)
		);
	}
	else if(Input.GetButtonUp("Rotate")) {
		mo = Camera.main.GetComponent(MouseOrbit);
		cc = Camera.main.GetComponent(CameraControls);
		
		cc.SetZoom(mo.distance);
		
		//iTween.Stop(mo.gameObject);
		mo.enabled = false;
		cc.enabled = true;
	}
	/*else if(Input.GetButtonDown("Pan")) {
		Camera.main.GetComponent(MouseOrbit).enabled = false;
		Camera.main.GetComponent(CameraControls).enabled = true;
	}*/
		
	
	// mouseOver funcs go here
	if(castMouseRay()) OnMouseOver(lastHit);
	else OnMouseNotOver();
}


function OnEnterOrbit() {
	if(Input.GetButton("Rotate")) {
		var cc = Camera.main.GetComponent(CameraControls);
		var mo = Camera.main.GetComponent(MouseOrbit);
		
		cc.enabled = false;
		mo.enabled = true;
	}
}

function ScreenPointToGamePlane(position : Vector3)
{
	//var p = Globals.GetPlaneCoords(Input.mousePosition);
	var camray = cam.ScreenPointToRay(position);
	var raydist = 0.0;
	pickerPlane.Raycast(camray, raydist);
	return camray.GetPoint(raydist);
}

function GetFacing(p : Vector3, buttonDownPos : Vector2, buttonUpPos : Vector2) {
	var dir : Vector3;

	// assign facing if proper
	if((buttonUpPos - buttonDownPos).magnitude > assignFacingMin) {
		var p2 = ScreenPointToGamePlane(buttonUpPos);
		dir = p2 - p;
	}
	
	return dir;
}

function OnMouseOver(hit : RaycastHit)
{
	// drag-select units
	if(Input.GetMouseButtonDown(0))
	{/*
		new_selected = hit.transform;
		selectedFleets.Add(new_selected);
		Debug.Log("group-select " + new_selected.name + " already selected:" + selectedFleets.length);
		*/
	}

	hoverText = hit.transform.gameObject.name;
	
	/*
	nameDisplay.text = hit.transform.gameObject.name;
	var newpos = cam.WorldToScreenPoint(hit.transform.position + labelOffset);
	newpos.x /= cam.pixelWidth;
	newpos.y /= cam.pixelHeight;
	newpos.z = 0;
	//newpos += labelOffset;
	nameDisplay.transform.position = newpos;
	*/
}

function OnMouseClick(hit : RaycastHit)
{
	selected = hit.transform;
	hoverText = selected.gameObject.name;
	
	guiPanel.selected = selected.gameObject;
	
	// select fleet, if possible
	selectedFleet = null;
	var selectedSquad : Squadron;
	var ship = selected.GetComponent(FleetShip);
	if(ship != null) {
		selectedSquad = ship.squadron;
	/*
		selectedFleet = ship.squadron;
		guiPanel.selected = selectedFleet.gameObject;
	*/
	}
	
	return selectedSquad;
}

function DoGroupSelect(buttonUpPos : Vector2, buttonDownPos : Vector2) : Array
{
	var selected = new Array();

	// determine AABB
	// swap points if needed
	var temp : float;
	if(buttonDownPos.x < buttonUpPos.x) {
		temp = buttonDownPos.x;
		buttonDownPos.x = buttonUpPos.x;
		buttonUpPos.x = temp;
	}
	if(buttonDownPos.y < buttonUpPos.y)	{
		temp = buttonDownPos.y;
		buttonDownPos.y = buttonUpPos.y;
		buttonUpPos.y = temp;
	}
	
	// get squads
	var all_squads = FindObjectsOfType(Squadron);
	for(var s in all_squads) {
		// filter squads
		if(s.team == currentPlayer.team) {
			var s_pos = cam.WorldToScreenPoint(s.transform.position);
			if(Utils.pointInsideAABB(buttonUpPos, buttonDownPos, s_pos)) {
				selected.Add(s);
			}
		}
	}
	
	// we didn't catch any. Let's assume they wanted to select a planet.
	if(selected.length <= 0) {
		var all_planets = FindObjectsOfType(Planet);
		for(var p in all_planets) {
			var p_pos = cam.WorldToScreenPoint(p.transform.position);
			if(Utils.pointInsideAABB(buttonUpPos, buttonDownPos, p_pos)) {
				guiPanel.selected = p.gameObject;
				break;
			}
		}
	}
	
	return selected;
}

/*
function pointInsideAABB(min : Vector2, max : Vector2, point : Vector2) : boolean
{
    return (point.x >= min.x && point.x <= max.x) &&
           (point.y >= min.y && point.y <= max.y);
}
*/

function OnGUI()
{
	if(hoverText != "")
	{
		var newpos = cam.WorldToScreenPoint(lastHit.transform.position + labelOffset);
		newpos.y = (Screen.height - newpos.y);
		newpos.z = 0;
		//newpos += labelOffset;
		//GUI.BeginGroup(new Rect(newpos.x, newpos.y, 100,20), nameDisplay.text);
		//GUI.EndGroup();
		GUI.Box(new Rect(newpos.x-60, newpos.y, 120,24), hoverText);
	}
	
	if(Input.GetMouseButton(0) &&
	   (buttonUpPos - buttonDownPos).magnitude > selectMin) {
		var mouse = Input.mousePosition;
		var downPos = new Vector2(buttonDownPos.x, buttonDownPos.y);
				
		// determine AABB
		// swap points if needed
		var temp : float;
		if(downPos.x > mouse.x) {
			temp = downPos.x;
			downPos.x = mouse.x;
			mouse.x = temp;
		}
		if(downPos.y < mouse.y)	{
			temp = downPos.y;
			downPos.y = mouse.y;
			mouse.y = temp;
		}
		
		var w = mouse.x - downPos.x;
		var h = -(mouse.y - downPos.y);
		
		GUI.Box(Rect(downPos.x, Screen.height - downPos.y, w, h),
			""); //style
		//GUI.DrawTexture(Rect(buttonDownPos.x, Screen.height - buttonDownPos.y, w, h),
		//	selectorMaterial); //style
	}
}

function OnUnselect()
{
	//selected = null;
	//guiPanel.selected = null;
	//selectHoverText = "";
}

function OnMouseNotOver()
{
	if(selected == null) hoverText = "";
}

function castMouseRay()
{
	var ray : Ray = cam.ScreenPointToRay(Input.mousePosition); 
	var hit : RaycastHit; 
	if(Physics.Raycast (ray, hit, Mathf.Infinity)) 
	{
		lastHit = hit;
		//OnMouseRay(hit);
		return true;
	}
	
	return false;
}

function getSingleton() : CampaignObjectPicker {
	return singleton;
}

function correctAABB(a : Vector2, b : Vector2) {
	// determine AABB
	// swap points if needed
	var temp : float;
	if(a.x < b.x) {
		temp = a.x;
		a.x = b.x;
		b.x = temp;
	}
	if(a.y < b.y)	{
		temp = a.y;
		a.y = b.y;
		b.y = temp;
	}
}