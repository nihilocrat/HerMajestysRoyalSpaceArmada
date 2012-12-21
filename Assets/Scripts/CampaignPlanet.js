import Globals;
import System.Collections;

public var squadBannerPrefab : GameObject;

public var team = 1;
public var rank = 1;

public var max_hp = 2000;
private var hp = max_hp;

public var heal_rate = 40;
public var slots = Array();

public var stats = Hashtable();
public var statList = ["economy", "industry", "tech", "defense"];
public var connections = new ArrayList();

private var Cargo : Cargo;
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
private var banner : Texture2D;
private var bannerTex : Transform;
private var bannerOffset = Vector3(0,2,0);

function Awake()
{
	stats["economy"] = 1;
	stats["industry"] = 1;
	stats["tech"] = 1;
}

function Start()
{
	SetPlayer(team);
	
	// prefill slots
	slots.Add("-");
	
	stats["economy"] = 1;
	stats["industry"] = 1;
	stats["tech"] = 1;
	
	bannerTex = transform.Find("Banner");
}

function SetPlayer(team_id : int) {
	team = team_id;
	//SetTeamColor(team_id);
	myPlayer = Player.getPlayer(team_id);
	banner = myPlayer.GetComponent(Blazon).GetBlazon();//getBlazon();
}


function SetTeamColor(team_id : int) {
	// FIXME: set my material to the team material
	var planetmesh = transform.Find("planet");
	var planetmat = TeamSettings.getSingleton().teamPlanetMaterials[team_id];
	planetmesh.renderer.material = planetmat;
}

function OnGUI() {
	if(banner == null) return;
	var iconPos = Camera.main.WorldToScreenPoint(transform.position + bannerOffset);
	/*
	if(iconPos.z >= 0) {
		//var iconSize = Mathf.Max(1, 32 * ((20.0-Camera.main.transform.position.y)/20.0));
		var iconSize = 32;

		var bannerRect = new Rect(iconPos.x-(iconSize/2),
			Screen.height - iconPos.y+(iconSize/2),
			iconSize, iconSize);

		GUI.DrawTexture(bannerRect, banner);
		
		//var rankpath = "ranks/rank_" + rank;
		//GUI.DrawTexture(Rect(iconPos.x+8, Screen.height - iconPos.y+16, 8, 8), Resources.Load(rankpath));
	}
	*/
}

function Update()
{
	if(banner != null && bannerTex != null) {
		var iconPos = Camera.main.WorldToScreenPoint(transform.position + bannerOffset);
		iconPos.x /= Screen.width;
		iconPos.y /= Screen.height;
		bannerTex.position = iconPos;
		bannerTex.GetComponent(GUITexture).texture = banner;
	}
}

function ComissionSquadron(squad_design, shipClass) : Squadron {
	ComissionSquadron(squad_design, shipClass, false);
}

function ComissionSquadron(squad_design, shipClass, free) : Squadron {
	// can't comission when under attack
	if(attackers.length > 0) return null;

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
	spawn_offset.x = ((squads_created_here % 3) - 1) * 2.5;
	spawn_offset.z = (0.5 - Mathf.Floor(squads_created_here / 3)) * 2.5;
	
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
	
	// broadcast message if successful
	Messages.Broadcast(myPlayer.team, "comission",
		squad_component.fleetName +" comissioned over "+ gameObject.name);
	
	myPlayer.squadCount += 1;
	squads_created_here += 1;
	if(squads_created_here >= 6) squads_created_here = 0;
	
	return squad_component;
}

function Upgrade() : boolean {
	// we gotz the moneys?
	if(myPlayer.cash < rank * Globals.planet_upgrade_cost_per_rank) return false;
	
	myPlayer.cash -= rank * Globals.planet_upgrade_cost_per_rank;
	
	// kay, upgrade
	rank += 1;
	myPlayer.resetCashRate(); // FIXME : might want to send a message instead
	max_hp = rank * 2000;
	hp = max_hp;
	slots.Add("-");
	return true;
}

function UpgradeStat(statName : String) : boolean {
	// we gotz the moneys?
	if(myPlayer.cash < stats[statName] * Globals.planet_upgrade_cost_per_rank) return false;
	
	myPlayer.cash -= stats[statName] * Globals.planet_upgrade_cost_per_rank;
	
	// kay, upgrade
	stats[statName] += 1;
	
	// upgrade actual attributes based on stat levels
	if(statName == "economy") {
		myPlayer.resetStats(); // FIXME : might want to send a message instead
	}
	else if(statName == "industry") {
		myPlayer.resetStats(); // FIXME : might want to send a message instead
	}
	else if(statName == "defense") {
		max_hp = stats[statName] * 2000;
		hp = max_hp;
	}
	
	return true;
}

function GetHP() : int {
	return hp;
}


function OnEnemyAttack(attacker : Squadron) {
	lastAttacker = attacker;
	
	attackers.Add(attacker);
}

function OnEnemyDisengage(attacker : Squadron) {
	attackers.Remove(attacker);
}

function OnDamage(amount : int) {
	// potential damage formula
	//var totaldamage = amount - Mathf.Max(0, armor - penetration);
	
	// this assumes a little too much about WHY we are being sent the message,
	// but it is currently better than the alternatives
	// FIXME: we should instead keep a LIST of attackers, and let the attackers
	//  send a message to join or leave the list

	if(hp > 0) hp -= amount;
	if(hp <= 0){
		hp = 0;
		//Kill();
	}
	else if(hp > max_hp) hp = max_hp;
}

function IsUnderAttack() : boolean {
	if(attackers.length > 0) return true;
	return false;
}