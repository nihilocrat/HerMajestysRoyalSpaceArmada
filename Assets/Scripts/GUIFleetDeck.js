import LitJson;

public var skin : GUISkin;

private var show = new Hashtable();
private var conditionalBoxes = new Hashtable();

public var window_saveScheme: GUIEnterStringDialog;
public var window_loadScheme: GUILoadScheme;

public var currentDeck : Deck;

public var units : GameObject[];
public var doctrineCards = new Array();

private var pageNum = 0;
private var currentCardTypeIndex = 0;

function Start()
{
	var cardFiles = Directory.GetFiles(Application.dataPath + "/Data/Cards/", "doctrine_*.card.json");
	for(var cardFile in cardFiles)
	{
		var fileparts = cardFile.Split("/"[0]);
		cardFileName = fileparts[fileparts.Length-1];
		
		var newCard = Card.UnSerialize( Utils.LoadJsonFromFile("Cards/" + cardFileName) );
		doctrineCards.Add(newCard);
	}
}

function LateUpdate()
{
	if(Input.GetButtonDown("Menu"))
	{
		Debug.Log("quitting!");
		Application.Quit();
	}
}


function OnGUI()
{
	GUI.skin = skin;

	var i : int;
	var j : int;
	var width = Screen.width * 0.8;
	var center_y = Screen.height/2;
	var halfwidth = width / 2;
	
	var cardSize = new Vector2(100, 140);
	
	if(show["SaveConfirm"])
	{
		GUI.Window(1, Rect(Screen.width * 0.35, Screen.height * 0.4, 250, 80), DrawSaveConfirm, "Fleet Saved");
	}
	
	var name_x = (Screen.width * 0.1);
	var name_y = Screen.height * 0.05;
	GUI.Box( Rect(name_x, name_y, 128 + 32, 40), "Fleet Name:");
	currentDeck.fleetName = GUI.TextField (Rect (name_x, name_y + 20, 128 + 32, 20), currentDeck.fleetName, 32);
	
	var cultureChoices = ["block", "tri"];
	
	// Culture choices
	GUI.Box( Rect(name_x + 200, name_y, cultureChoices.Length * 80,40), "Culture: " + currentDeck.culture);
	i = 0;
	for(var cultureName in cultureChoices)
	{
		if( GUI.Button(Rect(name_x + 200 + (i*80), name_y + 20, 80, 20), cultureName) )
		{
			currentDeck.culture = cultureName;
		}
		i++;
	}
		
	
	GUI.BeginGroup(Rect(Screen.width*0.1, Screen.height*0.125, width, Screen.height));
	
	if(currentDeck != null)
	{
		var thisDoctrineCard : Card;
				
		GUI.Box(Rect(0,0,width,200), "Current Deck");

		currentCardTypeIndex = GUI.Toolbar(Rect(10,20,width-20,20), currentCardTypeIndex, ["Artifex","Doctrine","Command"]);
		
		GUI.BeginGroup(Rect(10,40,width,220));
		
		// current deck cards
		i = 0;
		j = 0;
		for(i=0; i < currentDeck.deckLimit ; i++) {
			if(currentCardTypeIndex == 0)
			{
				var shipCard : GameObject;
				if(i < currentDeck.shipCards.Count)
			 		shipCard = currentDeck.shipCards[i];
			 	
				if(shipCard != null)
				{
					if(GUI.Button(Rect(i * cardSize.x, 0, cardSize.x, cardSize.y), "")) {
						currentDeck.RemoveCard(i);
					}
					GUIPanel.DrawShipCard(new Vector2(cardSize.x * i, 0), shipCard);
				}
				else
				{
					GUI.Box(Rect(i * cardSize.x, 0, cardSize.x, cardSize.y), "Empty");
				}
			}
			else if(currentCardTypeIndex == 1)
			{
				if(i < currentDeck.doctrineCards.Count)
				{
			 		thisDoctrineCard = currentDeck.doctrineCards[i];
			 		
					if(GUI.Button(Rect(i * cardSize.x, 0, cardSize.x, cardSize.y), "")) {
						currentDeck.doctrineCards.RemoveAt(i);
					}
			 		
			 		thisDoctrineCard.DrawCard(new Vector2(cardSize.x * i, 0));
				}
			}
		}
		
		GUI.EndGroup();
		
		// card vault //////////////////////////////////////////
		
		var height = 300;
		
		GUI.BeginGroup(Rect(0,Screen.height * 0.35,width,height));
		GUI.Box(Rect(0,0,width,height), "Card Vault");
		
		var pageSize = 12;
		
		// paging buttons
		if( GUI.Button(Rect(0,0,20,height), "<") )
		{
			if(pageNum > 0) pageNum -= 1;
		}
		if( GUI.Button(Rect(width-20,0,20,height), ">") )
		{
			if(pageNum < Mathf.Floor(units.Length/pageSize)) pageNum += 1;
		}
		
		GUI.BeginGroup(Rect(20,20,width,height));
		
		var row = 0;
		var col = 0;
		
		for(i = 0; i < pageSize ; i++)
		{
			if(i != 0 && i % (pageSize / 2) == 0)
			{
				row += 1;
				col = 0;
			}
		
			var index = (pageNum * pageSize)+i;
			var cardRect = new Rect(cardSize.x * col, cardSize.y * row, cardSize.x, cardSize.y);
			
			if(currentCardTypeIndex == 0)
			{
				if(index >= units.Length)
					break;
					
				var thisCard = units[index];			
			
				if(!currentDeck.shipCards.Contains(thisCard))
				{
					if(GUI.Button(cardRect, ""))
					{
						currentDeck.AddCard(thisCard);
					}
				}
				
				GUIPanel.DrawShipCard(new Vector2(cardRect.x, cardRect.y), thisCard);
			}
			else if(currentCardTypeIndex == 1)
			{
				if(index >= doctrineCards.Count)
					break;
				
				thisDoctrineCard = doctrineCards[index];
				if(!currentDeck.doctrineCards.Contains(thisDoctrineCard))
				{
					if(GUI.Button(cardRect, ""))
					{
						currentDeck.doctrineCards.Add(thisDoctrineCard);
					}
				}
				
				thisDoctrineCard.DrawCard(new Vector2(cardRect.x, cardRect.y));
			}
			
			col += 1;
		}
		
		GUI.EndGroup();
		
		GUI.EndGroup();
		
	}
	
	GUI.EndGroup();
	
		
	if(GUI.Button(Rect(Screen.width-300,0,100,32), "Save Deck"))
	{
		var jsonString = currentDeck.Serialize();
		Debug.Log(jsonString);
		
		if( Utils.SaveJsonToFile( "FleetDecks/" + Utils.GetFileNameFromFleetName(currentDeck.fleetName, "deck"), jsonString ) )
		{
			toggle("SaveConfirm");
		}
	}
	if(GUI.Button(Rect(Screen.width-200,0,100,32), "Load Deck"))
	{
		window_loadScheme.parent = this.gameObject;
		window_loadScheme.toggle();
	}
	if( GUI.Button(Rect(Screen.width - 64, 0, 64, 32), "Exit") )
	{
		Application.LoadLevel("0_mainmenu");
	}
	
	if( GUI.Button(Rect(0, 0, 64, 32), "MakeCard") )
	{
		var card : Card;
		var json = Utils.LoadJsonFromFile("Cards/testCard.card.json");
		card = Card.UnSerialize(json);
		Debug.Log(card.name);
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


function DrawSaveConfirm(windowID : int)
{
	GUI.Label(Rect(20,20,200,40), currentDeck.fleetName+" saved!");
	if( GUI.Button(Rect(80,50,80,20), "Verily!") )
	{
		toggle("SaveConfirm");
	}
}


function toggle(panelName : String)
{
	if(show[panelName]) show[panelName] = false;
	else show[panelName] = true;
}

function Serialize()
{
}

function UnSerialize(chosen_value : String )
{
	currentDeck.jsonFile = chosen_value;
	currentDeck.Awake();
}
