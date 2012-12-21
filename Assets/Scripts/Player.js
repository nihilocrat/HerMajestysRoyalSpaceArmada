import Globals;
import Utils;
import System.IO;

public var playerName = "Foobarius";
public var shipMaterial : Material;
public var contrailMaterial : Material;
public var team = 1;
public var culture = 0;

public var cash = 1000;

public var squad_cap = 10;
public var squadCount = 0;

public var colors : Color[];
public var colorIndexes : int[];

public var shipyard : GameObject;
public var units : Deck;

public var playerData : Hashtable = new Hashtable(); // extra data from JSON
public var jsonString : String;
public var stats = new Dictionary.<String, int>();


private static var singleton : Player;

// to keep track of fleet numbering
private var fleetsCreated = 0;
// to display the rate at which this player accumulates cash
private var cashRate : int;

private var blazonTexture : Texture2D;
private var tickCooldown = 0.0;
private var max_tickCooldown = 6.0;

private var buildQueue : BuildQueue;

function Awake() {
	singleton = this;
	
	blazonTexture = GetComponent(Blazon).GetBlazon();
	buildQueue = GetComponent(BuildQueue);
}

function Start() {
	if(jsonString != null && jsonString != "")
	{
		UnSerialize(Utils.LoadJsonFromFile("FleetSchemes/"+jsonString));
	}
	TeamSettings.getSingleton().generateTeamMaterial(team);
	
	shipMaterial = TeamSettings.getSingleton().getMaterial(team);
	contrailMaterial = TeamSettings.getSingleton().getContrailMaterial(team);
	
	units = transform.GetComponentInChildren(Deck);
}


function Update() {
	if(tickCooldown > 0) tickCooldown -= Time.deltaTime;
	else
	{
		// put per-player game tick stuff here
		
		// cash
		cash += cashRate;
		
		// advance build queue
		if(buildQueue != null)
			buildQueue.Advance();
		
		tickCooldown += max_tickCooldown;
	}
}

function getSquads() : Array {
	var all_squads = FindObjectsOfType(Squadron);
	var my_squads = new Array();
	for(var s in all_squads) {
		if(s.team == team) my_squads.Add(s);
	}
	
	return my_squads;
}

function getPlanets() {
	var all_planets = FindObjectsOfType(Planet);
	var mine = new Array();
	for(var p in all_planets) {
		if(p.team == team) mine.Add(p);
	}
	
	return mine;
}


function GetBlazon() {
	if(blazonTexture == null) blazonTexture = GetComponent(Blazon).GetBlazon();
	return blazonTexture;
}


function resetCashRate() {
	var planets = getPlanets();
	
	var total_rate = 0;
	// count planet income
	for(var p in planets) {
		total_rate += p.stats["economy"] * Globals.cash_per_rank; //p.rank;
	}
	// count squadron maintanence
	
	cashRate = total_rate;
}


function GetStat(statName : String)
{
	if(stats.ContainsKey(statName))
	{
		return stats[statName];
	}
	else
	{
		return 0;
	}
}


function resetStats() {
	var planets = getPlanets();
	
	var total_rate = 0;
	var total_cap = 0;
	
	var totalEconomy = 0;
	var totalIndustry = 0;
	
	if(shipyard != null)
	{
		var foldship = shipyard.GetComponent(Shipyard);
		
		// count foldship stats
		totalEconomy  += foldship.stats["economy"];
		totalIndustry += foldship.stats["industry"];
	}
	
	// count planet income
	for(var p in planets) {
		totalEconomy  += p.stats["economy"];
		totalIndustry += p.stats["industry"];
	}
	// count squadron maintanence
	
	
	// get bonuses from cards
	if(units != null)
	{
		for(var card in units.doctrineCards)
		{
			totalEconomy  += card.GetStat("economy");
			totalIndustry += card.GetStat("industry");
			
			// FIXME : probably should move this logic into cards somehow
			// get bonuses depending on planets owned
			totalEconomy  += card.GetStat("economy_per_planet")  * planets.Count;
			totalIndustry += card.GetStat("industry_per_planet") * planets.Count;
			
			// carry over all other stats
			var excludedStats = new List.<String>(["economy", "industry", "economy_per_planet", "industry_per_planet"]);
			for(var statName in card.stats.Keys)
			{
				if(!excludedStats.Contains(statName))
				{
					stats[statName] = card.stats[statName];
					Debug.Log("set stat " + statName + " : "+ stats[statName] +" from card " + card.name);
				}
			}
		}
	}
		
	stats["economy"]  = totalEconomy;
	stats["industry"] = totalIndustry;
	
	cashRate  = stats["economy"]  * Globals.cash_per_rank;
	squad_cap = stats["industry"] * Globals.squads_per_rank;	
}


function getCashRate() {
	return cashRate;
}

static function getSingleton() {
	return singleton;
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

function getNextFleetName(baseFleetName : String) {
	fleetsCreated += 1;
	return Utils.toOrdinal(fleetsCreated) + " " + baseFleetName;
}

function setShipyard(syard : GameObject) {
	shipyard = syard;
}

function UnSerialize(jsonString : String)
{
	var i : int;
	var data = LitJson.JsonMapper.ToObject(jsonString);
	
	playerName = data["name"];
	culture = data["culture"];
	
	colorIndexes = new int[3];
	for(i=0;i<=1;i++)
	{
		colorIndexes[i] = data["colors"][i];
		colors[i] = Globals.colorChoices[data["colors"][i]];
	}
	
	colors[2] = Globals.glowChoices[data["colors"][2]];
	
	// pack all extra data into playerData
	playerData = LitJson.JsonMapper.ToObject.<Hashtable>(jsonString);
	
	return data;
}
