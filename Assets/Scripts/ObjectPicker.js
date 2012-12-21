import Globals;
import Utils;

public var minimumScreenY = 0.2;

public var nameDisplay : GUIText;

public var labelOffset = Vector3(0,5,0);

public var selected : Transform;

public var selectorMaterial : Texture2D;

public var commandSound : AudioClip;

private var buttonDownPos : Vector2;
private var buttonUpPos : Vector2;

private var moveOrigin : Vector3;

private var selectedFleets : Array;

private var lastHit : RaycastHit; 
private var cam : Camera;

private var hoverText : String;

private var pickerPlane : Plane;
private var guiPanel : GUIPanel;

private var singleton : ObjectPicker;

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
	currentPlayer = TeamSettings.getSingleton().humanPlayer;
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
		var fleet : Squadron;
		buttonUpPos = Input.mousePosition;
		
		// reset various stuff
		//guiPanel.selectedGroup = null;
		guiPanel.selected = null;
			
		// clear out the select group unless we're adding to it
		if( !Input.GetButton("AddToSelection") )
		{
			ClearSelectedFleets();
		}
		
		// if we have a single-select-only selected (like a planet), always clear it out
		if(selected != null)
		{
			selected.gameObject.SendMessage("OnUnSelected", SendMessageOptions.DontRequireReceiver);
			selected = null;
		}
		
		// if the difference is tiny then assume they are not trying to group select
		if((buttonUpPos - buttonDownPos).magnitude < selectMin) {
			// single select logic
			// NOTE : you can single select planets and enemy fleets
			
			if(castMouseRay()) {
				fleet = OnMouseClick(lastHit);
				if(fleet != null)
				{
					selectedFleets.Add( fleet );
				}
				else
				{
					// we have hit a single-select-only object
					// so always clear the fleet selection
					ClearSelectedFleets();
				}
			}
			else {
				//OnUnselect();
			}
			
		}
		else
		{
			// group select logic
			// NOTE: group select ONLY works for friendly fleets
			var newSelectedFleets = DoGroupSelect(buttonDownPos, buttonUpPos);
			if( Input.GetButton("AddToSelection") )
			{
				selectedFleets = selectedFleets.Concat(newSelectedFleets);
			}
			else
			{
				selectedFleets = newSelectedFleets;
			}
			Debug.Log("selected: " + selectedFleets.length);
		}
		
		// now perform GUI actions and other things based on
		// what was just selected
		if(selectedFleets != null) {
			guiPanel.selectedGroup = selectedFleets;
			
			for(fleet in selectedFleets)
			{
				fleet.SendMessage("OnSelected", SendMessageOptions.DontRequireReceiver);
				for(var ship in fleet.members)
				{
					ship.BroadcastMessage("OnSelected", SendMessageOptions.DontRequireReceiver);
				}
			}
		}

		// do some witchcraft to make the OnGUI code not draw the box on next click
		buttonDownPos = buttonUpPos;
	}
	
	var MyOrder : SquadronOrder;
	
	// group commands
	// a single squad counts as a group of length 1
	if(selectedFleets != null && selectedFleets.length > 0) {
		var f : Squadron;
		var origin : Transform;
		var myP : Vector3;
		
		if(Input.GetButtonDown("Move")) {
			buttonDownPos = Input.mousePosition;
			moveOrigin = ScreenPointToGamePlane(buttonDownPos);
		}
		
		else if(Input.GetButton("Move")) {
			// assign facing if proper
			dir = GetFacing(moveOrigin, buttonDownPos, Input.mousePosition);
			
			// move squads in relation to each other
			origin = selectedFleets[0].transform;
			for(f in selectedFleets) {
				if(f.combatTargets.Count <= 0) {
					myP = moveOrigin + origin.TransformDirection(f.transform.position - origin.position);
					
					f.SetPointer(myP, dir);
				}
			}
		}
	
		if(Input.GetButtonUp("Move") && selectedFleets.Count > 0 && selectedFleets[0] != null)
		{
			buttonUpPos = Input.mousePosition;
			
			p = ScreenPointToGamePlane(buttonDownPos);

			// assign facing if proper
			dir = GetFacing(p, buttonDownPos, buttonUpPos);
			
			// move squads in relation to each other
			origin = selectedFleets[0].transform;
			for(f in selectedFleets) {
				if(f.combatTargets.Count <= 0) {
					myP = p + origin.TransformDirection(f.transform.position - origin.position);
					
					//f.GoTo(myP, dir);
					myOrder = new SquadronOrder();
					myOrder.position = myP;
					myOrder.direction = dir;
					myOrder.type = OrderType.GoTo;
					
					f.SendMessage("OnSubmit", myOrder);
					f.GetPointer().gameObject.active = true;
				}
			}
			
			audio.PlayOneShot(commandSound);
		}
		
		if(Input.GetButtonDown("Retreat") && selectedFleets.Count > 0)
		{
			p = ScreenPointToGamePlane(Input.mousePosition);
			
			// move squads in relation to each other
			origin = selectedFleets[0].transform;
			for(f in selectedFleets) {
				// only retreat if the fleet has some kind of target
				if(f.combatTargets.Count > 0 || f.GetCombatTargetPlanet() != null) {
					myP = p + origin.TransformDirection(f.transform.position - origin.position);
					
					myOrder = new SquadronOrder();
					myOrder.position = myP;
					myOrder.direction = dir;
					myOrder.type = OrderType.Retreat;
					
					f.SendMessage("OnSubmit", myOrder);
					f.GetPointer().gameObject.active = true;
				}
			}
			
			audio.PlayOneShot(commandSound);
		}
		
		
		if(Input.GetButtonDown("formation_1"))
		{
			for(f in selectedFleets) {
				f.currentFormation = "column";
				f.GoTo(f.GetMoveTarget());
			}
		}	
		else if(Input.GetButtonDown("formation_2"))
		{
			for(f in selectedFleets) {
				f.currentFormation = "skirmish";
				f.GoTo(f.GetMoveTarget());
			}
		}	
		else if(Input.GetButtonDown("formation_3"))
		{
			for(f in selectedFleets) {
				f.currentFormation = "combat";
				f.GoTo(f.GetMoveTarget());
			}
		}
		
	}
	
	// camera controls
	// FIXME : these can probably go elsewhere, actually
	var mo : MouseOrbit;
	var cc : CameraControls;
	var primarySel = GetPrimarySelected();
	if(Input.GetButtonDown("Rotate") && primarySel != null) {

		mo = Camera.main.GetComponent(MouseOrbit);
		cc = Camera.main.GetComponent(CameraControls);
		
		mo.target = primarySel;
		
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


function OnGUI() {
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

function GetPrimarySelected() : Transform
{
	var planet : Planet;
	var squad : Squadron;

	if(selectedFleets.length > 0)
	{
		squad = selectedFleets[0];
		if(squad.flagship != null)
			return squad.flagship.transform;
		else
			return null;
	}
	else if(selected != null)
	{
		planet = selected.GetComponent(Planet);
		
		var trans : Transform;
		if(planet != null) {
			trans = planet.transform;
		}	

		return trans;
	}
	else
	{
		return null;
	}
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
	/*if(Input.GetMouseButtonDown(0))
	{
		new_selected = hit.transform;
		selectedFleets.Add(new_selected);
		Debug.Log("group-select " + new_selected.name + " already selected:" + selectedFleets.length);
	}*/

	hoverText = hit.transform.gameObject.name;
	/*
	nameDisplay.text = hit.transform.gameObject.name;
	var newpos = cam.WorldToScreenPoint(hit.transform.position);
	newpos.x /= cam.pixelWidth;
	newpos.y /= cam.pixelHeight;
	newpos.z = 0;
	newpos += labelOffset;
	nameDisplay.transform.position = newpos;
	*/
}

function OnMouseClick(hit : RaycastHit)
{
	selected = hit.transform;
	hoverText = selected.gameObject.name;
	
	guiPanel.selected = selected.gameObject;
	
	selected.gameObject.SendMessage("OnSelected");
	
	// select fleet, if possible
	var selectedSquad : Squadron;
	var ship = selected.GetComponent(FleetShip);
	if(ship != null) {
		selectedSquad = ship.squadron;
	}
	
	var presence = selected.GetComponent(SquadPresence);
	if(presence != null) {
		selectedSquad = presence.squadron;
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
			var s_size = new Vector2(16,16);
			if(Utils.AABBcollide(buttonUpPos, buttonDownPos, s_pos-s_size, s_pos+s_size)) {
				selected.Add(s);
				s.SendMessage("OnSelected", SendMessageOptions.DontRequireReceiver);
				for(var ship in s.members)
				{
					ship.BroadcastMessage("OnSelected", SendMessageOptions.DontRequireReceiver);
				}
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


function ClearSelectedFleets() {
	for(var s in selectedFleets)
	{
		if(s != null)
		{
			s.SendMessage("OnUnSelected", SendMessageOptions.DontRequireReceiver);
			for(var ship in s.members)
			{
				ship.BroadcastMessage("OnUnSelected", SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	selectedFleets.Clear();
	guiPanel.selectedGroup.Clear();
}

/*
function pointInsideAABB(min : Vector2, max : Vector2, point : Vector2) : boolean
{
    return (point.x >= min.x && point.x <= max.x) &&
           (point.y >= min.y && point.y <= max.y);
}
*/

/*
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
		GUI.Box(new Rect(newpos.x-60, newpos.y, 120,20), hoverText);
	}
}
*/

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

function getSingleton() : ObjectPicker {
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