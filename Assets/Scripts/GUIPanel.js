@script AddComponentMenu("GUI Panels/Battlescape")

public var skin : GUISkin;

public var miniMap : Minimap2D;
public var selected : GameObject;
public var selectedGroup : Array;

public var emptySpace : Texture2D;
public var hackyShipPrefab : GameObject;

private var show = new Hashtable();
private var conditionalBoxes = new Hashtable();
private var squadShipClass = "Frigate";

private var currentPlayer : Player;
private var currentFoldship : Transform;

private var frontRankShips : GameObject[];
private var shipListIndex : int;

private var rankTextures : Array;
private var barTextures : Array;
private var bannerTextures : Hashtable;

public var design : GameObject[];


function Start()
{
	currentPlayer = TeamSettings.getSingleton().humanPlayer;
	
	rankTextures = [
		Resources.Load("ranks/rank_1"),
		Resources.Load("ranks/rank_1"),
		Resources.Load("ranks/rank_2"),
		Resources.Load("ranks/rank_3"),
		Resources.Load("ranks/rank_4"),
		Resources.Load("ranks/rank_5")
	];
	
	barTextures = [
		Resources.Load("healthbar_vertical/healthbar_vertical_1"),
		Resources.Load("healthbar_vertical/healthbar_vertical_1"),
		Resources.Load("healthbar_vertical/healthbar_vertical_2"),
		Resources.Load("healthbar_vertical/healthbar_vertical_3"),
		Resources.Load("healthbar_vertical/healthbar_vertical_4")
	];
	
	bannerTextures = new Hashtable({
		"frigate" : Resources.Load("icons/banner_frigate") as Texture2D,
		"cruiser" : Resources.Load("icons/banner_cruiser") as Texture2D,
		"battleship" : Resources.Load("icons/banner_battleship") as Texture2D
	});
	
	selectedGroup = new Array();
}

function LateUpdate()
{
	if(TeamSettings.getSingleton().debug && Input.GetKeyDown(KeyCode.Tab))
	{
		toggle("DebugMenu");
	}
	
	if(Input.GetButtonDown("Pause"))
	{
		Debug.Log("pausing!");
		Director.getSingleton().OnPause();
	}
	
	if(Input.GetButtonDown("Menu"))
	{
		Debug.Log("quitting!");
		Application.Quit();
	}
	
	
	if(Input.GetButtonDown("Map"))
	{
		//toggle("TacticalMap");
		if(miniMap.enabled == false)
			miniMap.enabled = true;
		else
			miniMap.enabled = false;
	}
	
}

function OnGUI()
{
	GUI.skin = skin;

	var i : int;
	var buildOrder : BuildOrder;
	var width = Screen.width * 0.6;
	var center_y = Screen.height/2;
	var halfwidth = width / 2;
	var blazon : Texture2D;
	
	// GM menu
	if(show["DebugMenu"])
	{
		GUI.Window(0, Rect(0, 0, 100, 300), DrawDebugWindow, "Debug Menu");
	}
	

	// <economy pane>
	player = currentPlayer;
	
	var cashRate = player.getCashRate() * 10;
	var cashRateString = cashRate.ToString();
	if(cashRate >= 0) cashRateString = "+" + cashRate;
	
	GUI.BeginGroup(Rect(Screen.width*0.2, 0, width, 70));
	GUI.Box(Rect(0,0,width,30), "");
	GUI.Label(Rect(20,5,100,20), "$" + player.cash + " ("+ cashRateString+"/min)");
	//GUI.Label(Rect(width-100,5,100,20), "Squadrons: ("+ player.squadCount +"/"+ player.squad_cap +")");
	minutes = Mathf.Floor(Time.timeSinceLevelLoad/60);
	seconds = Time.timeSinceLevelLoad - (minutes * 60);
	GUI.Label(Rect(width-100,5,100,20), String.Format("Time: {0}:{1:00}", minutes, seconds) );
	
	var bQueue = player.GetComponent(BuildQueue);
	var toRemove = -1;
	i = 0;
	for(var order : BuildOrder in bQueue.queue)
	{
		if(GUI.Button(Rect(35 * i, 30, 35, 35), order.icon))
		{
			toRemove = i;
		}
		i += 1;
	}
	if(toRemove > -1)
	{
		bQueue.queue.RemoveAt(toRemove);
	}
	
	GUI.EndGroup();
	// </economy pane>
	
	
	var shipyardObj = currentPlayer.shipyard;
	var shipyard : Shipyard;
	if(shipyardObj != null)
		shipyard = shipyardObj.GetComponent(Shipyard);
	
	if(shipyard != null)
	{	
		// comission squad gui
		commissionIcon = Resources.Load("icons/icon_commission");
		
		if(GUI.Button(Rect(Screen.width-50, Screen.height - 50, 40, 40),
			GUIContent(commissionIcon, "Commission new squadron")
		))
		{
			toggle("ComissionSquadron");
		}
		
		// Display the tooltip from the element that has mouseover or keyboard focus
		//GUI.Label (Rect (10,80,150,20), GUI.tooltip);
	
	}
	
	
	// below this point, do not display anything if nothing is selected ////////////////////////////////////////////////////
	if((selected != null || selectedGroup.length > 0) && !show["ComissionSquadron"])
	{
		var squadboxHeight = 180;
		var cardHeight = 80;
	
		// for a more predictable user experience, use the bottom of the window
		GUI.BeginGroup(Rect(Screen.width*0.2, Screen.height*0.825, width,squadboxHeight));
		
		// group selection
		if(selectedGroup != null && selectedGroup.length > 0)
		{
			if(selectedGroup.length > 1)
			{
				GUI.Box(Rect(0,0,width,squadboxHeight), "");
				
				var cardWidth = 80;
				for(i=0; i < selectedGroup.length; i++) { 
					squad = selectedGroup[i];
					if(squad == null) continue;
					
					GUI.BeginGroup(Rect(i * cardWidth, 0, cardWidth,cardHeight));
					// click button to select squad
					if(GUI.Button(Rect(0,0,cardWidth,cardHeight), "")) {
						selectedGroup.Clear();
						selectedGroup.Add(squad);
						selected = squad.gameObject;
					}
					
					GUI.Label(Rect(20,0,cardWidth,20), squad.fleetName);
					/*
					if(GUI.Button(Rect(10,i * 20,150,20), squad.fleetName)) {
						selectedGroup.Clear();
						selected = squad.gameObject;
						squad = selected.GetComponent(Squadron);
						break;
					}
					*/
					
					// fleet icons
					var fship : FleetShip;
					var xoff = 0;
					var yoff = 1;
					for(var si=0; si < squad.members.Count ; si++)
					{
						fship = squad.members[si].GetComponent(FleetShip);
		
						// silly hardcoding
						if(si ==0 || si == 4) {
							xoff = 0;
							yoff += 1;
							GUI.DrawTexture(Rect(0,yoff * 20, 16, 16), fship.icon);
							xoff += 2;
						}
						
						DrawHealthBarVertical(xoff * 10,yoff * 20, fship);
						xoff += 1;
					}
				
					GUI.DrawTexture(Rect(0, 20, 16, 16),
						Resources.Load("icons/icon_formation"));
					GUI.Label(Rect(20,20,cardWidth,20), squad.currentFormation);
					//GUI.Label(Rect(105,20,120,20), "morale: " + Mathf.Floor(squad.morale));
					//GUI.Label(Rect(width-60,20,50,20), "XP: " + squad.xp);
					
					GUI.DrawTexture(Rect(0, 0, 16, 16), rankTextures[squad.rank]);
					
					GUI.EndGroup();
				}
			}
			//GUI.EndGroup();
			// single squad
			else if(selectedGroup.length == 1)
			{
				squad = selectedGroup[0];
				blazon = Player.getPlayer(squad.team).GetBlazon();
				
				GUI.Box(Rect(0,0,width,200), squad.fleetName);
				GUI.DrawTexture(Rect(5,5,32,32), blazon);
				GUI.Label(Rect(width-60,0,50,20), "rank:");
				GUI.DrawTexture(Rect(width-24, 0, 16, 16), rankTextures[squad.rank]);
				GUI.Label(Rect(0,90,width,20), "commander: " + squad.captainName);
				
				if(squad.team == player.team)
				{
					GUI.Label(Rect(width-200,20,120,20), "formation: " + squad.currentFormation);
					GUI.Label(Rect(105,20,120,20), "morale: " + Mathf.Floor(squad.morale));
					GUI.Label(Rect(width-60,20,50,20), "XP: " + squad.xp);
				}
				
				var padding = 60;
				
				GUI.BeginGroup(Rect(24,48,width,60));
				// member info
				// officer
				var flagship = squad.members[0].GetComponent(FleetShip);
				//GUI.Label(Rect(0,padding*1.25, padding, padding),
				GUI.Label(Rect(8,4, padding, padding), flagship.icon);
				DrawHealthCircle(8,4, flagship);
				
				// front rank
				for(i=1; i<squad.members.Count; i++)
				{
					var ship = squad.members[i].GetComponent(FleetShip);
					var x_offset = 32;
					var y_offset = 4;
					//if(i > 4){ y_offset = padding/2;  x_offset = -padding * 3;}
					//GUI.Label(Rect(padding * i + x_offset, y_offset, padding, padding),
					//	ship.shipName +"\n"+ ship.GetHP().ToString());
					var icon_rect = Rect(padding * i + x_offset, y_offset, padding, padding);
					GUI.Label(icon_rect, ship.icon);
					DrawHealthCircle(padding * i + x_offset, y_offset, ship);
				}
				// rear rank
				
				GUI.EndGroup();
			}
		}	
		else if(selected != null)
		{
			// determine what we have selected
			var planet = selected.GetComponent(Planet);
			
			if(planet != null) 
			{
				// uncomment this to make the box float where the planet is
				//var guipos = Camera.main.WorldToScreenPoint(transform.position);
				//GUI.BeginGroup(Rect(guipos.x-halfwidth, 480-guipos.y-halfwidth, width,200));
		
		
				// planet info
				//GUI.Label(Rect(10,0,120,20), "team: " + planet.team);
				
				GUI.Box(Rect(0,0,width,200), selected.name);
		
				// FIXME : replace with a dummy player 0
				
				blazon = Player.getPlayer(planet.team).GetBlazon();
				GUI.DrawTexture(Rect(5,5,32,32), blazon);
				
				//GUI.Label(Rect(50,5,120,20), "hp: " + planet.GetHP());
				//GUI.Label(Rect(width-50,0,120,20), "rank: " + planet.rank);
				if(planet.GetCaptureProgress() > 0.0)
				{
					GUI.Label(Rect(50,5,120,20), String.Format("captured: {0:p0}", planet.GetCaptureProgress()));
				}
				
				// controls enabled only for friendly cities
				if(planet.team == currentPlayer.team || TeamSettings.getSingleton().debug)
				{
					//GUI.Label(Rect(width-70,20,120,20), "militia: 0/0");
					
					// draw slot buttons
					// clicking on an existing building will reveal upgrade/sell menu
					// clicking on empty slot will bring up build menu
					// the last empty slot should be a "planet upgrade" button
					// of course, if the planet is fully upgraded, there are no remaining slots,
					// thus no upgrade button
					//GUI.BeginGroup(Rect(10,40,400,80));
					GUI.BeginGroup(Rect(10,40,400,80));
					
					// upgrade planet stats
					i = 0;
					var buttonsize = 80;
					for(var statname in planet.statList) {
						// button : stat name plus rank
						// tooltip : "upgrade: $cost"
						var tip : String = "upgrade: $"+ planet.stats[statname]*Globals.planet_upgrade_cost_per_rank;
						var statContent = new GUIContent("+", tip);
						
						GUI.Label(Rect(i * buttonsize, 0, buttonsize, 20), statname+": "+ planet.stats[statname]);
						if(GUI.Button(Rect(i * buttonsize, 20, buttonsize, 20), statContent)) {
							buildOrder = new BuildOrder();
							buildOrder.cost = planet.GetUpgradeCost(statname);
							buildOrder.icon = Resources.Load("icons/icon_planet_upgrade");
							buildOrder.description = "";
							buildOrder.sender = planet.gameObject;
							buildOrder.buildMessage = "UpgradeStat";
							buildOrder.buildArgs = statname;
							
							currentPlayer.SendMessage("OnSubmit", buildOrder);
							//planet.UpgradeStat(statname);
						}
						i++;
					}
					
					/*
					for(i=0; i<planet.slots.length ; i++) {
						GUI.Button(Rect(i * 40, 0, 40, 40), planet.slots[i]);
					}
					
					if(planet.rank < 7) {
						if(GUI.Button(Rect(i * 40, 0, 40, 40), "lvl++\n$"+(planet.rank+1)*Globals.planet_upgrade_cost_per_rank)) {
							planet.Upgrade();
						}
					}
					*/
					
					GUI.EndGroup();
					
					// Display the tooltip from the element that has mouseover or keyboard focus
					GUI.Label (Rect (10,80,150,20), GUI.tooltip);
				}
			}
		}
		
		GUI.EndGroup();
	}
	
	
	// things outside of the bottom pane
	// generally these should only be toggled
	if(show["ComissionSquadron"])
	{
		// squad comission GUI
		/*
		GUI.BeginGroup(Rect(Screen.width/4, center_y/2, width, 200));
		GUI.Box(Rect(0,0, width, 200), "Comission Squadron");
		GUI.EndGroup();
		*/
		
		var commissionBoxHeight = 200;
	
		GUI.Box(Rect(Screen.width*0.2, Screen.height*0.7, width, commissionBoxHeight), "Commission Squadron");
		
		
		if(GUI.Button(Rect((Screen.width*0.8)-30, Screen.height*0.7, 30, 20), "X"))
		{		
				show["ComissionSquadron"] = false;
		}
		
		
		// ship class selector
		var shipclasses = ["Frigate", "Cruiser", "Battleship"];
		
		// FIXME : this is really ugly
		var ranklabels;
		shipListIndex = GUI.Toolbar(Rect(Screen.width*0.25, Screen.height*0.74, width*0.8, 20),
			shipListIndex,shipclasses);
		
		if(shipListIndex == 1) {
			frontRankShips = currentPlayer.units.GetShipsOfClass("Cruiser");
		}
		else if(shipListIndex == 2) {
			frontRankShips = currentPlayer.units.GetShipsOfClass("Battleship");
		}
		else {
			frontRankShips = currentPlayer.units.GetShipsOfClass("Frigate");
		}
		
		
		GUI.BeginGroup(Rect(Screen.width*0.2, Screen.height*0.78, width, commissionBoxHeight));
					
		// silly hack to find choosable ships
		var choices : GameObject[];
		choices = frontRankShips;
		
		var shipcardWidth = 100;
		var shipcardHeight = 140;
				
		//for(j=0; j < 8; j++)
		j=0;
		for(var shipObj : GameObject in choices)
		{
			var fShip = shipObj.GetComponent(FleetShip);
			var icon : Texture2D = fShip.icon;
			
			// FIXME : these two functions are very heavy to be in here, precache the values
			var buildDesign = new GameObject[3];
			buildDesign[0] = shipObj;
			buildDesign[1] = shipObj;
			buildDesign[2] = shipObj;
			var shipCost = Squadron.GetSquadronCostFromDesign(buildDesign);
			//var content = new GUIContent(icon, fShip.shipName + "\n" + statsString);
			
			if(GUI.Button(Rect(j * shipcardWidth, 0, shipcardWidth, shipcardHeight), ""))
			{
				buildOrder = new BuildOrder();
				buildOrder.cost = shipCost;
				buildOrder.icon = icon;
				buildOrder.description = "";
				buildOrder.sender = shipyard.gameObject;
				buildOrder.buildMessage = "ComissionSquadron";
				buildOrder.buildArgs = buildDesign;
				
				currentPlayer.SendMessage("OnSubmit", buildOrder);
				//shipyard.ComissionSquadron(design);//, squadShipClass);
				//planet.ComissionSquadron(design, squadShipClass);
				show["ComissionSquadron"] = false;
			}
			
			// card-button contents
			DrawShipCard(new Vector2(j*shipcardWidth, 0), shipObj);
			
			
			j++;
		}
	
		GUI.EndGroup();
		
		
		GUI.BeginGroup(Rect(Screen.width*0.2, Screen.height*0.85, width, 80));
		
		// Display the tooltip from the element that has mouseover or keyboard focus
		GUI.Label (Rect (0,0,400,70), GUI.tooltip);
		//GUILayout.Label(GUI.tooltip);
		
		//var current_cost = Squadron.GetSquadronCostFromDesign(design);
		//GUI.Label(Rect(10, commissionBoxHeight - 160, 80, 40), "Cost: $" + current_cost);
		GUI.EndGroup();
	}
}

static function DrawHealthCircle(x,y, ship : FleetShip)
{
	// pick the number of segments present out of 8
	var texturenumber = Mathf.Ceil((parseFloat(ship.GetHP()) / parseFloat(ship.max_hp)) * 8.0);

	// I am hardcoding an offset here, assuming we are drawing on top of a 32x32 icon
	// ... quit judging!
	var r = Rect(x-8, y-4, 48,48);
	if(texturenumber > 0) {
		var tex_path = "healthcircle/healthcircle_"+texturenumber.ToString();
		GUI.DrawTexture(r, Resources.Load(tex_path));
	}
}

static function DrawHealthBarVertical(x,y, ship : FleetShip)
{
	// pick the number of segments present out of 4
	var texturenumber = Mathf.Ceil((parseFloat(ship.GetHP()) / parseFloat(ship.max_hp)) * 4.0);

	var r = Rect(x, y, 8,16);
	if(texturenumber > 0) {
		var tex_path = "healthbar_vertical/healthbar_vertical_"+texturenumber.ToString();
		GUI.DrawTexture(r, Resources.Load(tex_path));
		//GUI.DrawTexture(r, barTextures[texturenumber]);
	}

}

function DrawConditionalBoxes()
{
	for(var key in show.Keys)
	{
		if(show[key])
		{
			conditionalBoxes[key]();
		}
	}
}


static function DrawDoctrineCard(cardPos : Vector2, card : Card)
{
	var shipcardWidth = 100;
	var shipcardHeight = 140;
	
	// card-button contents
	GUI.BeginGroup(Rect(cardPos.x, cardPos.y, shipcardWidth, shipcardHeight));
	
	GUI.Label(Rect(10, 5, shipcardWidth, 40), card.name);
	GUI.Label(Rect(10,80, shipcardWidth,shipcardHeight-80), card.description);
	
	GUI.EndGroup();
}

static function DrawShipCard(cardPos : Vector2, shipObj : GameObject)
{
	var shipcardWidth = 100;
	var shipcardHeight = 140;
		
	var fShip = shipObj.GetComponent(FleetShip);
	var icon : Texture2D = fShip.icon;
	var classIcon : Texture2D = Resources.Load("icons/banner_" + fShip.shipClass.ToLower()) as Texture2D;
	
	var buildDesign = new GameObject[3];
	buildDesign[0] = shipObj;
	buildDesign[1] = shipObj;
	buildDesign[2] = shipObj;
	var shipCost = Squadron.GetSquadronCostFromDesign(buildDesign);
	var fWeapon = fShip.GetMainWeapon();
	
	var statsString = String.Format("Hull: {0}\nArmor: {1}\nSpeed: {2}", fShip.max_hp, fShip.armor, fShip.impulse);
	//if(fWeapon != null)
	//	statsString += String.Format("\nDamage: {0:f1}\t\t\tArmor Penetration: {1:f1}\t\t\tRange: {2}", fWeapon.GetDPS(), fWeapon.GetPPS(), fWeapon.range);
	
	//var content = new GUIContent(icon, fShip.shipName + "\n" + statsString);
	
	var shipnameParts = fShip.shipName.Split(" "[0]);
	
	// card-button contents
	GUI.BeginGroup(Rect(cardPos.x, cardPos.y, shipcardWidth, shipcardHeight));
	
	GUI.Label(Rect(10, 5, shipcardWidth, 40), shipnameParts[0] + "\n" + shipnameParts[1]);
	GUI.Label(Rect(shipcardWidth - 30, 5, shipcardWidth, 20), "$"+shipCost.ToString());
	//GUI.DrawTexture(Rect(10,40, 32,32), bannerTextures[fShip.shipClass.ToLower()]);
	GUI.DrawTexture(Rect(10,45, 32,32), classIcon);
	GUI.DrawTexture(Rect(10,45, 32,32), icon);
	
	GUI.Label(Rect(10,80,shipcardWidth,shipcardHeight-80), statsString);
	
	GUI.EndGroup();
}


function HealSquadron(squadron : Squadron) {
	if(squadron == null) return false;
	
	for(var m in squadron.members) {
		if(m.active == false) m.Revive();
		m.SetHP(m.max_hp);
	}
	//squadron.ResetSquadronSpeed();
	/*
	for(var m in squadron.members) {
		var pos = squadron.flagship.transform.position;
		var rot = squadron.flagship.transform.rotation;
		if(m.active == false) m.Revive(pos,rot);
		m.SetHP(m.max_hp);
	}*/
}

function DrawDebugWindow(windowID : int)
{
		var squadron : Squadron;

		GUILayout.BeginArea(Rect(0, 0, 100, 300));
		GUILayout.BeginVertical();
			
		GUILayout.Label("");
		if(GUILayout.Button("+$1000"))
		{
			currentPlayer.cash += 1000;
		}
		if(GUILayout.Button("Heal Selected"))
		{
			if(selectedGroup != null && selectedGroup.length > 1) {
				for(var squad in selectedGroup) {
					HealSquadron(squad);
				}
			}
	
			else if(selected != null) {
				squadron = selected.GetComponent("Squadron");
				if(squadron != null) {
					HealSquadron(squadron);
				}
			}
		}
		
		if(GUILayout.Button("Time x3"))
		{
			if(Time.timeScale < 3.0) Time.timeScale = 3.0;
			else Time.timeScale = 1.0;
		}
		
		GUILayout.Label("Bad Stuff");
		
		if(GUILayout.Button("Rout Squad")) {
			if(selected != null) {
				squadron = selected.GetComponent("Squadron");
				if(squadron != null) {
					squadron.AddMorale(-100000.0);
				}
			}
		}
		if(GUILayout.Button("Kill Flagship")) {
			if(selected != null) {
				squadron = selected.GetComponent("Squadron");
				if(squadron != null) {
					squadron.members[0].OnDamage(9001.0); // OVER 9000
				}
			}
		}
		
		GUILayout.EndVertical();
		GUILayout.EndArea();
}


function OnDesignChange(slotnum : int, ship : GameObject)
{
	design[slotnum] = ship;
	
	// the squad's flagship will match its front rank if the player doesn't
	// choose something
	if(slotnum == 0 && design[2] != design[0])
		design[2] = ship;
}

function toggle(panelName : String)
{
	if(show[panelName]) show[panelName] = false;
	else show[panelName] = true;
}
