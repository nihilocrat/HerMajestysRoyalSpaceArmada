@script AddComponentMenu("GUI Panels/Sidebar - Squadron")

public var show = true;
public var skin : GUISkin;

private var myPlayer : Player;

private var mySquads : Array;
private var sidebarRect : Rect;


private var barTextures : Array;


function Start() {
	myPlayer = TeamSettings.getSingleton().humanPlayer;
	sidebarRect = new Rect(0,24,120,400);
	
	
	barTextures = [
		Resources.Load("healthbar_vertical/healthbar_vertical_1"),
		Resources.Load("healthbar_vertical/healthbar_vertical_1"),
		Resources.Load("healthbar_vertical/healthbar_vertical_2"),
		Resources.Load("healthbar_vertical/healthbar_vertical_3"),
		Resources.Load("healthbar_vertical/healthbar_vertical_4")
	];
	
	resetStats();
}

function resetStats() {
	mySquads = myPlayer.getSquads();
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

	GUI.Box(Rect(0,0,120,24), "Squads: ("+ myPlayer.squadCount +"/"+ myPlayer.squad_cap +")");
	GUI.BeginGroup (Rect(0,24,120,400));

	// stuff beyond this point is not shown unless the map is up
	if(show) {		
		for(var i=0; i < mySquads.length ; i++){
			var squad = mySquads[i];
			
			GUI.BeginGroup(Rect(0,40 * i, 120, 40));
			GUI.Box(Rect(0,0, 120, 40), "");
			GUI.DrawTexture(Rect(22,2,32,32), squad.GetBanner());
			GUI.Label(Rect(0,0, 120, 40), squad.fleetName.Split(" "[0])[0]);
			GUI.DrawTexture(Rect(60,0 ,16,16), squad.members[0].icon);
			GUI.DrawTexture(Rect(60,20,16,16), squad.members[0].icon);
			
			// fleet icons
			var fship : FleetShip;
			var xoff = 0;
			var yoff = 0;
			for(var si=0; si < squad.members.Count ; si++)
			{
				fship = squad.members[si];

				// silly hardcoding
				if(si == Mathf.Ceil(squad.members.Count/2)+1) {
					xoff = 0;
					yoff += 1;
				}
				
				DrawHealthBarVertical(80 + xoff * 10,yoff * 20, fship);
				xoff += 1;
			}
			
			GUI.EndGroup();
		}
	}
	
	
	GUI.EndGroup();
}



function DrawHealthBarVertical(x,y, ship : FleetShip)
{
	// pick the number of segments present out of 4
	var texturenumber = Mathf.Ceil((parseFloat(ship.GetHP()) / parseFloat(ship.max_hp)) * 4.0);

	var r = Rect(x, y, 8,16);
	if(texturenumber > 0) {
		//var tex_path = "healthbar_vertical/healthbar_vertical_"+texturenumber.ToString();
		GUI.DrawTexture(r, barTextures[texturenumber]);
	}

}


