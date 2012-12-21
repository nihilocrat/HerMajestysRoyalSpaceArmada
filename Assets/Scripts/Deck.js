import System.Collections.Generic;

public var jsonFile : String;
public var deckLimit = 6;

// temporary for UnitDB -> Deck transition
public var fleetName : String;
public var culture : String;
public var foldship : GameObject;
//public var shipCards : GameObject[];
public var shipCards : List.<GameObject>;

public var commandCards = new List.<Card>();
public var artifexCards = new List.<Card>();
public var foldshipCards = new List.<Card>();
public var doctrineCards = new List.<Card>();
public var doctrineLimit = 1;
	

function Awake()
{
	if(jsonFile != "" && jsonFile != null)
	{
		var jsonString = Utils.LoadJsonFromFile("FleetDecks/"+jsonFile);
		UnSerialize(jsonString);
	}
}

/*
public GameObject get(string key) {
	//int idx = Array.IndexOf(keys, key);
	// what. the. fuck.
	int idx = -1;
	for(int i=0; i < keys.Length ; i++) {
		if(keys[i] == key) idx = i;
	}
	
	if(idx >= 0) return values[idx];
	else return null;
}
*/

public function GetShipsOfClass(shipClass : String) : Array
{
	var output = new Array();
	
	for(var ship in shipCards)
	{
		var component = ship.GetComponent(FleetShip);
		if(component.shipClass == shipClass)
		{
			output.Add(ship);
		}
	}
	
	return output;
}

// maybe doesn't belong in Deck
public function AssembleShipDesign(shipJson : String)
{
}

public function AddCard(shipCard : GameObject)
{
	if(shipCards.Count < deckLimit)
	{
		shipCards.Add(shipCard);
	}
	
	// sort them by ship type
}

public function RemoveCard(index : int)
{
	shipCards.RemoveAt(index);
}


public function SetCulture(newCulture : String)
{
	culture = newCulture;
	
	foldship = Resources.Load(String.Format("prefabs/FleetShip/FleetShip_{0}_foldship", culture)) as GameObject;
	
	// get "card names" from our existing cards
	// this should probably be redone when the card names get more generic and not so specific to the ship prefab
	var shipNameArray = new Array();
	for(var card in shipCards)
	{
		shipNameArray.Add( card.name.Replace("FleetShip_"+culture+"_","") );
	}
	shipCards.Clear();
	
	for(var shipName in shipNameArray)
	{
		var shipObj = Resources.Load(String.Format("prefabs/FleetShip/FleetShip_{0}_{1}", culture, shipName)) as GameObject;
		shipCards.Add(shipObj);
	}
}


public function UnSerialize(jsonString : String)
{	
	var data = LitJson.JsonMapper.ToObject(jsonString);
	
	fleetName = data["name"];
	culture = data["culture"];
	foldship = Resources.Load(String.Format("prefabs/FleetShip/FleetShip_{0}_foldship", culture)) as GameObject;
	
	// convert card names to actual card GameObjects
	var shipNameArray = data["shipCards"];
	shipCards.Clear();
	
	for(var shipName in shipNameArray)
	{
		var shipObj = Resources.Load(String.Format("prefabs/FleetShip/FleetShip_{0}_{1}", culture, shipName)) as GameObject;
		shipCards.Add(shipObj);
	}
	
	var cardNameArray = data["doctrineCards"];
	doctrineCards.Clear();
	
	for(var cardName in cardNameArray)
	{
		var cardObj : Card;
		cardObj = Card.UnSerialize( Utils.LoadJsonFromFile("Cards/" + cardName + ".card.json") );
		doctrineCards.Add(cardObj);
	}
}

public function Serialize()
{
	var data = {
		"version" : 1,
		"name" : fleetName,
		"culture" : culture,
		"foldship" : foldship.name
	};
	
	var shortname : String;
	
	var shipNameArray = new Array();
	for(var ship in shipCards)
	{
		// format : FleetShip_culture_shortname_maybe_with_other_stuff
		shortname = ship.name.Replace("FleetShip_block_","");
		shipNameArray.Add(shortname);
	}
	
	data["shipCards"] = shipNameArray;
	
	
	var cardNameArray = new Array();
	for(var card in doctrineCards)
	{
		shortname = "doctrine_" + card.name.Replace(" ", "_").ToLower();
		cardNameArray.Add(shortname);
	}
	data["doctrineCards"] = cardNameArray;
	
	var jsonString = LitJson.JsonMapper.ToJson(data);
    
    return jsonString;
}
