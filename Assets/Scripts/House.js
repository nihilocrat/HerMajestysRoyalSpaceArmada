import Globals;
import Utils;

public var playerName = "House Foobarius";
public var shipMaterial : Material;
public var team = 1;

public var cash = 1000;

public var colors : Color[];

private var blazonTexture : Texture2D;

function Awake() {
	blazonTexture = GetComponent(Blazon).GetBlazon();
}

function getPlanets() {
	var all_planets = FindObjectsOfType(CampaignPlanet);
	var mine = new Array();
	for(var p in all_planets) {
		if(p.team == team) mine.Add(p);
	}
	
	return mine;
}


function GetBlazon() {
	return blazonTexture;
}


static function getPlayer(team_id : int) : Player {
	// hack : we should instead keep a list of players and send out references from there
	//var t = Transform.root.Find("player_" + team_id);
	var foundPlayer : Player;
	var players = FindObjectsOfType(Player);
	
	for(var p in players)
	{
		if(p.GetComponent(Player).team == team_id) return p;
	}
	
	return foundPlayer;
}
