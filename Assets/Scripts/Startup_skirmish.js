@script RequireComponent(GalaxyGen)
@script RequireComponent(Director)

public var numberOfPlayers = 2;

public var starterFleetDesign : GameObject[];

public var foldship : GameObject;
public var starbase : GameObject;

public var startPoints : Vector2[];

public var minimap : Minimap2D;

function Start() {
	var generator = GetComponent(GalaxyGen);
	
	// generate the map before we find starting planets
	generator.Go();
	//SetupStartLocations();
	SetupFoldships();
}

function SetupFoldships()
{
	for(var playerNum = 1; playerNum <= numberOfPlayers; playerNum++)
	{
		var playerObj = Player.getPlayer(playerNum);
		/*
		var homebase : GameObject;
		if(playerNum == TeamSettings.getSingleton().humanPlayer.team) {
			homebase = foldship;
		}
		else {
			homebase = starbase;
		}
		
		foldship = Instantiate(homebase,
			myplanet.transform.position + Vector3(0,1.5,0), myplanet.transform.rotation);
		foldship.SendMessage("SetPlayer", playerNum);
		*/
	
		// set cash rate to reflect their starting economy
		playerObj.resetStats();
	}

	// signal to the rest of the scene that the game has officially started
	minimap.SendMessage("Reset");
}

function SetupStartLocations() {
	// find some start planets
	var planets = new Array(FindObjectsOfType(Planet));
	
	// give the planet to each player and place a starter fleet
	for(var playerNum = 1; playerNum <= numberOfPlayers; playerNum++) {
		var playerObj = Player.getPlayer(playerNum);
		var index = Random.Range(0, planets.length);
		Debug.Log("placed player " + playerNum + " at planet #"+ index +" out of "+ planets.length);
		var myplanet = planets[index];
		planets.RemoveAt(index);
		
		myplanet.SetPlayer(playerNum);
		
		// starter fleet -- second argument is true, meaning the squad will be free
		var starters = myplanet.ComissionSquadron(starterFleetDesign, "Frigate", true);
		starters.spawnWithFullHP = true;
		
		
		var homebase : GameObject;
		if(playerNum == TeamSettings.getSingleton().humanPlayer.team) {
			homebase = foldship;
		}
		else {
			homebase = starbase;
		}
		
		foldship = Instantiate(homebase,
			myplanet.transform.position + Vector3(0,1.5,0), myplanet.transform.rotation);
		foldship.SendMessage("SetPlayer", playerNum);
		
				
		// set cash rate to reflect their starting economy
		playerObj.resetStats();
		
		
		if(playerNum == TeamSettings.getSingleton().humanPlayer.team) {
			Camera.main.transform.position.x = myplanet.transform.position.x;
			Camera.main.transform.position.z = myplanet.transform.position.z - 5;
		}
		
	}
	
	// signal to the rest of the scene that the game has officially started
	minimap.SendMessage("Reset");
}