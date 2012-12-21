// radar! by PsychicParrot, adapted from a Blitz3d script found in the public domain online somewhere ..
//

public var friendlyBlip : Texture2D;
public var enemyBlip : Texture2D;
public var neutralBlip : Texture2D;
public var blipSize : int = 4;
public var radarBG : Texture;

public var centerObject : Transform;
public var mapScale = 0.3;
private var mapCenter : Vector2;

public var size : int = 128;
private var sizehalf : int;

public var updateRate = 2.0;
private var cooldown = 0;

private var all_players : Object[];
private var all_planets : Object[];
private var all_squads : Object[];

private var player : Player;

function Start () {
    mapCenter = new Vector2(transform.position.x * Screen.width, Screen.height - (transform.position.y * Screen.height));
	sizehalf = size / 2;
	
    player = TeamSettings.getSingleton().humanPlayer;
	
	GetSquadrons();
}

function Reset() {
	all_players = FindObjectsOfType(Player);
	all_planets = FindObjectsOfType(Planet);
}

function GetSquadrons() {
	all_squads = FindObjectsOfType(Squadron);
	GetObjectsLoop();
}

function GetObjectsLoop() {
	yield WaitForSeconds(updateRate);
	GetSquadrons();
}

function OnGUI () {
    //  GUI.matrix = Matrix4x4.TRS (Vector3.zero, Quaternion.identity, Vector3(Screen.width / 600.0, Screen.height / 450.0, 1));
	//GUI.DrawTexture(Rect(mapCenter.x-sizehalf,mapCenter.y-sizehalf,size,size),radarBG);
	
	/*if(cooldown > 0) cooldown -= Time.deltaTime;
	else
	{*/
		//GUI.Box(Rect());
		GUI.Box(Rect(mapCenter.x-sizehalf,mapCenter.y-sizehalf,size,size),"");
		DrawBlipsForType(Planet, all_planets);
		//DrawBlipsForType(Squadron, all_squads);
		DrawSquadronBlips(all_squads);
		
		
		// ghetto camera icon
		var bX = Camera.main.transform.position.x * mapScale;
		var bY = Camera.main.transform.position.z * -mapScale;
		GUI.Label(Rect(mapCenter.x+bX-5,mapCenter.y+bY-10,20, 20), "[  ]");
		//drawBlip(Camera.main.transform, neutralBlip);
		
		cooldown = updateRate;
	//}
}


function drawBlip(obj,aTexture){
    //var debug = GameObject.Find("Debug Text").GetComponent(GUIText);

	if(centerObject != null) centerPos=centerObject.position;
	else centerPos = Vector3.zero;
	
    extPos=obj.position;
    
    // first we need to get the distance of the enemy from the player
    //dist=Vector3.Distance(centerPos,extPos);

    //var screen_relation = centerCamera.WorldToScreenPoint(extPos);
    bX = extPos.x * mapScale;
    bY = extPos.z * -mapScale;

    // this is the diameter of our largest radar circle
    GUI.DrawTexture(Rect(mapCenter.x+bX,mapCenter.y+bY,blipSize, blipSize),aTexture);
}

function DrawBlipsForType(typ) {
	var objs : Object[];
    objs = gameObject.FindObjectsOfType(typ);
	DrawBlipsForType(typ, objs);
}

function DrawBlipsForType(typ, objs : Object[]){
	if(objs == null) return;
    //var distance = Mathf.Infinity; 
    var position = transform.position; 
	
    // Iterate through them and call drawBlip function
    for (var go in objs)  {
        if(go.transform == centerObject){ continue; } 
		//drawBlip(go.transform, friendlyBlip);
		
        var othership = go.GetComponent(typ);
		if(othership == null){ continue; }
        
		if(othership.team == 0) {
            drawBlip(go.transform,neutralBlip);
		}
        else if(othership.team == player.team) {
            drawBlip(go.transform,friendlyBlip);
        }
        else {
            drawBlip(go.transform,enemyBlip);
        }
    }
 
}

function DrawSquadronBlips(objs : Object[]){
	if(objs == null) return;
    //var distance = Mathf.Infinity; 
    var position = transform.position; 
	
    // Iterate through them and call drawBlip function
    for (var go in objs)  {
        if(go.transform == centerObject){ continue; } 
		//drawBlip(go.transform, friendlyBlip);
		
        var othership = go.GetComponent(Squadron);
		if(othership == null){ continue; }
    
        drawBlip(go.transform,othership.GetBanner());
    }
 
}

