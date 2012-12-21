public var show = true;
public var skin : GUISkin;

private var myPlayer : Player;

private var myPlanets : Array;
private var sidebarRect : Rect;

function Start() {
	myPlayer = TeamSettings.getSingleton().humanPlayer;
	sidebarRect = new Rect(Screen.width-120,24,120,400);
	
	resetStats();
}

function resetStats() {
	//myPlanets = myPlayer.getPlanets();
	myPlanets = gameObject.FindObjectsOfType(Planet);
	updateLoop();
}

function updateLoop() {
	yield WaitForSeconds(2.0);
	resetStats();
}

function Update() {
	if(Input.GetButtonDown("Map")) {
		if(show) show = false;
		else show = true;
	}
}

function OnGUI()
{
	GUI.skin = skin;

	GUI.Box(Rect(Screen.width-120,0,120,24), "Outposts ("+ myPlanets.length +")");
	GUI.BeginGroup (Rect(Screen.width-120,24,120,400));

	// stuff beyond this point is not shown unless the map is up
	if(show) {
		for(var i=0; i < myPlanets.length ; i++){
			var p = myPlanets[i];
			GUI.Box(Rect(0,40 * i, 120, 40), "");
			GUI.Label(Rect(10,40 * i, 120, 24), p.name);
			if(p.team == myPlayer.team)
			{
				statsString = String.Format("{0} - {1} - {2}", p.stats["economy"], p.stats["industry"], p.stats["defense"]);
				GUI.Label(Rect(10,40 * i + 16, 120, 24), statsString);
			}
			GUI.DrawTexture(Rect(120 - 40,40 * i + 4, 32, 32), Player.getPlayer(p.team).GetBlazon());
		}
	}
	
	GUI.EndGroup();
}