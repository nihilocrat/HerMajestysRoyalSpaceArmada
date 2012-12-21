
public var skin : GUISkin;
public var show = true;
public var numberOfPlayers = 2;
public var playerPrefab : GameObject;
public var deckPrefab : GameObject;
public var cultureDeckDefaults : String[];
public var director : Transform;
public var schemePicker : GUILoadScheme;
public var deckPicker : GUILoadScheme;
public var players = new Array();

private var width : float;
private var height : float;
private var windowRect : Rect;

private var chosenPlayer : Player;

function Start() {
	width = Screen.width * transform.localScale.x;
	height = Screen.height * transform.localScale.y;
	
	windowRect = new Rect(Screen.width * transform.position.x, Screen.height * transform.position.y,
						  width, height);	
}

function toggle() {
	if(show)
		show = false;
	else
		show = true;
}

function OnGUI () {
	if(!show) return;
	
	GUI.skin = skin;
	GUI.Box(windowRect, "Battle Setup");
	DrawSchemePicker();
}

function DrawSchemePicker()
{
	if( GUI.Button(Rect(Screen.width - 80, 0, 80, 40), "Exit") )
	{
		Application.LoadLevel("0_mainmenu");
	}

	var contentRect = new Rect(windowRect.x + 5, windowRect.y + 20, width-10, height-25);
	GUI.BeginGroup(contentRect);

	var i = 0;
	for(var playa in players)
	{
		GUI.BeginGroup(Rect(10, 30 * i, contentRect.width, 30));
		GUI.Label(Rect(  0,0, 200,32), playa.playerName);
		GUI.Label(Rect(180,0,  32,32), playa.GetBlazon());
		GUI.Label(Rect(220,0,  80,32), "Team " + playa.team);
		if(playa.units == null)
		{
			if(GUI.Button(Rect(320,0,  120,32),  "Choose Deck"))
			{
				chosenPlayer = playa;
				deckPicker.parent = this.gameObject;
				deckPicker.show = true;
			}
		}
		else
		{
			GUI.Label(Rect(300,0,  100,32), playa.units.fleetName);
		}
		
		GUI.EndGroup();
		
		i += 1;
	}
	
	if( players.Count < numberOfPlayers )
	{
		if( GUI.Button(Rect(10, 30 * i, 300, 32), "Add Player") )
		{
			schemePicker.parent = this.gameObject;
			schemePicker.show = true;
		}
	}
	
	if( players.Count >= 2 )
	{
		if( GUI.Button(Rect(width - 200, height - 55, 180, 32), "Start Game") )
		{
			// bring all the players and any global components (like teamsettings) into the game
			for(var playa in players)
			{
				DontDestroyOnLoad(playa.gameObject);
				if(playa.units == null)
				{
					chosenPlayer = playa;
					ChooseDeck(cultureDeckDefaults[playa.culture]);
				}
			}
			
			DontDestroyOnLoad(director.gameObject);
				
			Application.LoadLevel("2_battlescape");
		}
	}
	
	GUI.EndGroup();
}


function ChooseScheme(chosenName : String)
{
	baseName = (chosenName).Split('.'[0])[0];
	schemeName = baseName + ".scheme.json";
	deckName = baseName + ".deck.json";

	var clone = Instantiate(playerPrefab, transform.position, transform.rotation);
	clone.name = "Player_" + (players.Count+1);
	
	var newPlayer = clone.GetComponent(Player);
	var newBlazon = clone.GetComponent(Blazon);
	
	newPlayer.jsonString = schemeName;
	newBlazon.jsonString = schemeName;
	newPlayer.team = (players.Count+1);
	newBlazon.assembleAtStartup = true;
	// tell them to load their json
	newBlazon.SendMessage("Awake");
	newPlayer.SendMessage("Start");
	
	// attempt to choose a deck if one exists
	// first see if file exists!
	if( false )
	{
		ChooseDeck(chosenName);
	}
	
	// for now, assume the human player is player 1
	if( newPlayer.team == 1 )
	{
		TeamSettings.getSingleton().humanPlayer = newPlayer;
	}
	else
	{
		clone.AddComponent(AICommander);
	}
	
	players.Add(newPlayer);
	
	schemePicker.show = false;
}


function ChooseDeck(chosenName : String)
{
	baseName = (chosenName).Split('.'[0])[0];
	deckName = baseName + ".deck.json";

	// create and assign deck
	var clone = Instantiate(deckPrefab, transform.position, transform.rotation);
	var newDeck = clone.GetComponent(Deck);
	newDeck.jsonFile = deckName;
	newDeck.gameObject.SendMessage("Awake");
	
	newDeck.transform.parent = chosenPlayer.transform;
	chosenPlayer.units = newDeck;
}
