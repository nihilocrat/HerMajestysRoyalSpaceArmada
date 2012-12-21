public var youLose : GUIText;
public var pauseText : GUIText;

private var gameOver = false;

private var team : int;

private var all_planets : Object[];

/* ================== singleton code  ==================== */
private static var singleton : Director;

function Awake() {
	singleton = this;
}

static function getSingleton() {
	return singleton;
}
/* ================== end singleton code ================= */

function Start()
{
	// reset game if we re-enter the scene
	if(Time.timeScale != 1.0 || gameOver == true) {
		Time.timeScale = 1.0;
		pauseText.gameObject.active = false;
			youLose.gameObject.SetActiveRecursively(false);
		gameOver = false;
	}

	team = TeamSettings.getSingleton().humanPlayer.team;
	
	all_planets = gameObject.FindObjectsOfType(Planet);
	
	// game begins paused
	yield WaitForSeconds(0.1);
	OnPause();
}


function OnSquadronDestroyed(squad : Squadron)
{
	// if this is a foldship squadron
	if( squad.shipClass == "Single" && squad.members[0].GetComponent(Shipyard) != null )
	{
		//Messages.Broadcast(newPlayer.team,
		//	"The forces of " + oldPlayer.playerName + " have been defeated!");
		Messages.Broadcast(squad.team, "We have been defeated!");
		
		// see if the human player has lost
		if(squad.team == TeamSettings.getSingleton().humanPlayer.team) {
			// YOU LOSE
			// FIXME : move GUI stuff back to GUIPanel and broadcast a message
			youLose.gameObject.SetActiveRecursively(true);
			gameOver = true;
			OnPause();
			// TODO : disable pause function
		}
		// FIXME : this is hacked in assuming there are only two players!
		// MUST BE CHANGED in an iteration or two!
		else {
			youLose.text = "VAE VICTUS! We have won!";
			youLose.gameObject.SetActiveRecursively(true);
			gameOver = true;
			OnPause();
		}
	}
}


function OnPlanetCapture(planet : Planet, oldPlayer : Player, newPlayer : Player) {
	Messages.getSingleton().Add(oldPlayer.team,
		planet.gameObject.name +" has fallen to "+ newPlayer.playerName);
	Messages.getSingleton().Add(newPlayer.team,
		"We have liberated "+ planet.gameObject.name +" from "+ oldPlayer.playerName +"!");
	
	// recount planets owned by either team
	var oldPlayer_planets = oldPlayer.getPlanets();
	var newPlayer_planets = newPlayer.getPlanets();
	
	Debug.Log("new team # of planets: " + newPlayer_planets.length);
	Debug.Log("old team # of planets: " + oldPlayer_planets.length);
	
	/*
	// see if the player losing the planet has lost
	if(oldPlayer_planets.length < 1 && oldPlayer.team != 0) {
		Messages.Broadcast(newPlayer.team,
			"The forces of " + oldPlayer.playerName + " have been defeated!");
		Messages.Broadcast(oldPlayer.team, "We have been defeated!");
		
		// see if the human player has lost
		if(oldPlayer.team == TeamSettings.getSingleton().humanPlayer.team) {
			// YOU LOSE
			// FIXME : move GUI stuff back to GUIPanel and broadcast a message
			youLose.gameObject.SetActiveRecursively(true);
			gameOver = true;
			OnPause();
			// TODO : disable pause function
		}
		// FIXME : this is hacked in assuming there are only two players!
		// MUST BE CHANGED in an iteration or two!
		else {
			youLose.text = "VAE VICTUS! We have won!";
			youLose.gameObject.SetActiveRecursively(true);
			gameOver = true;
			OnPause();
		}
	}
	*/
	
	// actually, we should be seeing if EVERYONE has lost all their planets yet
	// so we can crown a winner
	
}

function OnPause() {
	if(pauseText == null) return;

	if(Time.timeScale >= 1.0) {
		Time.timeScale = 0.0;
		pauseText.gameObject.active = true;
	}
	else {
		Time.timeScale = 1.0;
		pauseText.gameObject.active = false;
	}
}