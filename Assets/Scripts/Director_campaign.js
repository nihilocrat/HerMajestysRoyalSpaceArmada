public var youLose : GUIText;
public var pauseText : GUIText;

private var gameOver = false;

private var team : int;

private var all_planets : Object[];

/* ================== singleton code  ==================== */
private static var singleton : Director_campaign;

function Awake() {
	singleton = this;
}

static function getSingleton() {
	return singleton;
}
/* ================== end singleton code ================= */

function Start()
{
	var totalPlayers = 0;
	for(var culture in GameObject.FindObjectsOfType(Culture))
	{
		culture.GenerateHouses(0, culture.numHouses, totalPlayers);
		totalPlayers += culture.numHouses;
	}

	//var planets : GameObject[] = gameObject.GetComponent(GalaxyGen).Go();
	var planets : Array = gameObject.GetComponent(GalaxyGen).Go();
	
	for(var pobj : GameObject in planets) {
		var p = pobj.GetComponent(CampaignPlanet);
		var dice = Random.value;
		
		var playerteam = Random.Range(1,totalPlayers);
		p.SetPlayer(playerteam);
	}
}


function Update()
{
}

function OnPause() {
	if(Time.timeScale >= 1.0) {
		Time.timeScale = 0.0;
		pauseText.gameObject.active = true;
	}
	else {
		Time.timeScale = 1.0;
		pauseText.gameObject.active = false;
	}
}