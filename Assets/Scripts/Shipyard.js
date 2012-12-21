import Globals;
import System.Collections;

public var squadBannerPrefab : GameObject;

public var team = 1;
public var rank = 1;

public var isFoldship = false;

public var slots = Array();
public var stats = Hashtable();

private var attackers = Array();
private var lastAttacker : Squadron;
private var tickCooldown = 0.0;
private var max_tickCooldown = 5.0;

private var squads_created_here = 0;

private var squadron_names = [
	"Voyagers",
	"Strike Group",
	"Guardians",
	"Sentinels",
	"Skirmishers",
	"Task Force",
	"Marauders"
];

private var myPlayer : Player;
private var team_material : Material;

private var healAreaIndicator : Transform;

function Awake() {
	stats["economy"] = 2;
	stats["industry"] = 3;
	stats["defense"] = 1;
};

function Start() {
	//SetPlayer(team);
	//team_material = TeamSettings.getSingleton().getMaterial(team);
	
	healAreaIndicator = transform.Find("heal_area/heal_area_indicator");
	healAreaIndicator.gameObject.active = false;
}


function OnSelected() {
	healAreaIndicator.gameObject.active = true;
}

function OnUnSelected() {
	healAreaIndicator.gameObject.active = false;
}



function SetPlayer(team_id : int) {
	team = team_id;
	myPlayer = Player.getPlayer(team_id);
	SetTeamColor(team_id);
	
	// special shipyard code
	// tell the player that I am the main shipyard
	Debug.Log("shipyard set for player " + team_id);
	myPlayer.setShipyard(gameObject);
	myPlayer.resetStats();
	
	// pass message to other things, such as: HealArea
	gameObject.BroadcastMessage("OnSetPlayer", team_id);
}


function SetTeamColor(team_id : int) {
	team_material = myPlayer.shipMaterial;
	
	// FIXME: set my material to the team material
	if(isFoldship)  {
		renderer.sharedMaterial = team_material;
		// also slap on my faction banner, if present
		var banners = transform.Find("banners");
		if( banners != null )
		{
			banners.renderer.material.mainTexture = myPlayer.GetBlazon();
		}
	}
	else  {
		for(var child : Transform in transform) {
			if(child.renderer != null) {
				for(var i=0 ; i < child.renderer.sharedMaterials.Length; i++) {
						child.renderer.sharedMaterials[i] = team_material;
				}
			}
		}
	}
}


function ComissionSquadron(squad_design : GameObject[]) : Squadron {
	return ComissionSquadron(squad_design, null, false);
}

function ComissionSquadron(squad_design, shipClass) : Squadron {
	return ComissionSquadron(squad_design, shipClass, false);
}

function ComissionSquadron(squad_design, shipClass, free) : Squadron {
	// can't comission when under attack
	//if(attackers.length > 0) return null;

	// infer shipclass from design[0]
	if(shipClass == null || shipClass == "")
	{
		shipClass = squad_design[0].GetComponent(FleetShip).shipClass;
	}

	// calculate everything... beep beep boop
	var total_cost = Squadron.GetSquadronCostFromDesign(squad_design);
	
	if(!free) {
		if(total_cost > myPlayer.cash) {
			Messages.getSingleton().Add(myPlayer.team, "Not enough money!");
			return null;
		}
		if(myPlayer.getSquads().length >= myPlayer.squad_cap) {
			Messages.getSingleton().Add(myPlayer.team,
				"You already have the maximum number of squadrons!");
			return null;
		}
		
		myPlayer.cash -= total_cost;
		Debug.Log("cost $" + total_cost);
	}
	// create that durn squadron
	//officer.GetComponent(FleetShip).team = team;
	var officer = squad_design[2];
	// officer ship matches the front rank if the player has no special flagships
	if(officer == null) officer = squad_design[0];
	
	var spawn_offset = new Vector3();
	spawn_offset.x = ((squads_created_here % 3) - 1) * 4;
	spawn_offset.z = (0.5 - Mathf.Floor(squads_created_here / 3)) * 4;
	
	var spawnpoint = new Vector3(transform.position.x,0,transform.position.z);
	spawnpoint += spawn_offset;
	var flaggy = Instantiate(officer, spawnpoint, Quaternion.identity);
	var squad = Instantiate(squadBannerPrefab, spawnpoint, Quaternion.identity);
	squad.transform.parent = flaggy.transform;
	squad.transform.localPosition = new Vector3(0,1.5,0);
	
	// determine squad name
	//var baseName = squad_design[0].baseFleetName;
	var rand_name = Random.Range(0, squadron_names.length);
	var s_name = myPlayer.getNextFleetName(squadron_names[rand_name]);
	
	var squad_component = squad.GetComponent(Squadron);
	squad_component.flagship = flaggy;
	flaggy.GetComponent(FleetShip).squadron = squad_component;
	squad_component.shipClass = shipClass;
	squad_component.design = squad_design;
	squad_component.fleetName = s_name;
	squad_component.team = team;
	
	var culture = myPlayer.GetComponent(Culture);
	if(culture != null)
		squad_component.captainName = culture.GenerateFullName(1);
	
	// broadcast message if successful
	Messages.Broadcast(myPlayer.team, "comission",
		squad_component.fleetName +" comissioned");
	
	myPlayer.squadCount += 1;
	squads_created_here += 1;
	if(squads_created_here >= 6) squads_created_here = 0;
	
	return squad_component;
}
