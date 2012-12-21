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
private var team_material : Material;

function Start() {
	team_material = TeamSettings.getSingleton().getMaterial(team);
	SetPlayer(team);
}



function SetPlayer(team_id : int) {
	team = team_id;
	SetTeamColor(team_id);
	myPlayer = Player.getPlayer(team_id);
}


function SetTeamColor(team_id : int) {
	team_material = TeamSettings.getSingleton().getMaterial(team_id);
	
	// FIXME: set my material to the team material
	for(var child : Transform in transform) {
		/*for(var i=0 ; i < child.renderer.materials.Length; i++) {
			Debug.Log("coloring " + child.name + " part " + i);
			child.renderer.materials[i] = team_material;
		}*/
		if(child.renderer != null)
			child.renderer.sharedMaterial = team_material;
	}
}

function Update()
{
/*
	//FIXME : turn this into a yield loop
	if(tickCooldown > 0) tickCooldown -= Time.deltaTime;
	else
	{
		if(myPlayer != null && team == myPlayer.team)
		{
			// give player cash based on the planet's economy
			// FIXME : might want to move this to Player
			myPlayer.cash += stats["economy"] * Globals.cash_per_rank;//rank;
			
			// don't heal while under attack...
			if(!IsUnderAttack())
			{
				if(hp < max_hp) hp += heal_rate; //Debug.Log(name + " is healing itself");}
				if(hp > max_hp) hp = max_hp;
			}
		
			tickCooldown = max_tickCooldown;
		}
	}
*/
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
		Kill();
	}
	else if(hp > max_hp) hp = max_hp;
}

function Kill() {
	// I need to figure out who killed me, and switch to their team
	var oldTeam = team;
	var oldPlayer = Player.getPlayer(oldTeam);
	team = lastAttacker.team;	
	
	hp = 100;
	// ugh
	lastAttacker.OnVictory();
	SetPlayer(lastAttacker.team);
	
	myPlayer.resetStats();
	oldPlayer.resetStats();
	
	// tell the director that a planet has been captured
	//Director.getSingleton().OnBaseCapture(this, oldPlayer, myPlayer);
	
	// we are assuming that ALL our attackers
	// are friendly to the new team. I think if this is not the case,
	// the unfriendly attacker will simply re-engage the planet.
	// therefore it's probably safe (and easiest) to just clear my attackers
	attackers.Clear();
}


function IsUnderAttack() : boolean {
	if(attackers.length > 0) return true;
	return false;
}