
var housePrefab : GameObject;

var cultureName = "Foo";

var surnames = "latin_surname";
var malenames = "latin_first_male";
var femalenames = "latin_first_female";
var ranknames = "latin_noble_ranks";
var placenames = "places_latin";

var numHouses = 2;

public var maskTexture : Texture2D;
public var baseTexture : Texture2D;

public var divisions : Texture2D[];
public var ordinaires : Texture2D[];
public var charges : Texture2D[];

public var colorScheme : Color[];
public var neutralColors : Color[];

public var jsonString : String;

private var malenamelist : Array;
private var femalenamelist : Array;
private var surnamelist : Array;
private var ranklist : Array;

function Start() {
	if(jsonString != null && jsonString != "")
	{
		UnSerialize(Utils.LoadJsonFromFile("Cultures/"+jsonString));
	}
	
	malenamelist = new Array(CSVReader.read("Data/"+malenames+".txt"));
	femalenamelist = new Array(CSVReader.read("Data/"+femalenames+".txt"));
	surnamelist = new Array(CSVReader.read("Data/"+surnames+".txt"));
	ranklist = new Array(CSVReader.read("Data/"+ranknames+".txt"));
	
	//GenerateHouses(0, numHouses);
}

function GenerateHouses(seed : int, number : int, team_id_offset : int)
{	

	for(var houseNum = 0; houseNum < number ; houseNum++ )
	{
		var index = Random.Range(0,surnamelist.Count);
		var housename = surnamelist[index];
		surnamelist.RemoveAt(index);
		
		var huset : GameObject;
		huset = Instantiate(housePrefab, Vector3.zero, Quaternion.identity);//new GameObject("House " + housename);
		huset.name = "House " + housename;
		var blazon = huset.AddComponent("Blazon");
		
		generate_blazon(blazon, colorScheme);
		blazon.SendMessage("Start");
		//blazon.SetBlazon( blazon.MakeTexture() );
		
		var player = huset.AddComponent("Player");
		var houseComponent = huset.AddComponent("House");
		player.team = houseNum+team_id_offset+1;
		player.playerName = huset.name;
		
		houseComponent.team = houseNum+team_id_offset+1;
		houseComponent.playerName = huset.name;
	}
}

function popRandom(arraything : Array) {
	index = Random.Range(0, arraything.length);
	item = arraything[index];
	arraything.RemoveAt(index);
	return item;
}

function GenerateFullName(sex : int)
{
	var first : String;
	// female
	if(sex == 0)
	{
		index = Random.Range(0, femalenamelist.length);
		first = ranklist[8] + " " + femalenamelist[index];
	}
	// male
	else
	{
		index = Random.Range(0, malenamelist.length);
		first = ranklist[1] + " " + malenamelist[index];
	}
	
	index = Random.Range(0, surnamelist.length);
	var sur = surnamelist[index];
	return first + " " + sur;
}

function generate_blazon(blazon : Blazon, colorSet : Color[])
{
    // base color
	//var blazonColors : Color[] = new Color[3];
	//var blazonTextures : Texture2D[] = new Texture2D[3];
	var blazonColors = new Array();
	var blazonTextures = new Array();
	
	// setup color array for easy manipulation
	var colors = new Array(colorSet);
	if( Random.value < 0.8 ) {
		colors = colors.Concat(new Array(neutralColors));
	}
	
	var index = Random.Range(0, colors.length);
	blazonColors.Add(colors[index]);
    colors.RemoveAt(index);
	
	blazonTextures.Add(baseTexture);
    
    // division
    if(Random.value < 0.7) {
		index = Random.Range(0, colors.length);
		tincture = colors[index];
		colors.RemoveAt(index);
		blazonColors.Add(tincture);
		
		index = Random.Range(0, divisions.length);
		blazonTextures.Add(divisions[index]);
	}
     
    //ordinaire
	if(Random.value < 0.5) {
		index = Random.Range(0, colors.length);
		tincture = colors[index];
		colors.RemoveAt(index);
		blazonColors.Add(tincture);
		
		index = Random.Range(0, ordinaires.length);
		blazonTextures.Add(ordinaires[index]);
    }
	
    //charge
    // NOTE : for now, all arms have charges
    // because it looks cooler that way
    if(Random.value < 0.8) {
		index = Random.Range(0, colors.length);
		tincture = colors[index];
		colors.RemoveAt(index);
		blazonColors.Add(tincture);
		
		index = Random.Range(0, charges.length);
		blazonTextures.Add(charges[index]);
	}
    
    // HACK : reject if we only managed to generate a base
	if(blazonTextures.length < 2) {
		//return generate_blazon(blazon, colors);
		generate_blazon(blazon, colorSet);
		return;
	}
    
    //return
	blazon.mask = maskTexture;
	
	var tc : Color[] = new Color[blazonColors.length];
	var tt : Texture2D[] = new Texture2D[blazonTextures.length];
	
	for(var i = 0; i < blazonColors.length; i++) {
		if(blazonColors[i] != null) tc[i] = blazonColors[i];
		if(blazonTextures[i] != null) tt[i] = blazonTextures[i];
	}
	blazon.teamColors = tc;
	blazon.teamTextures = tt;
}


function UnSerialize(jsonString : String)
{
	var i : int;
	var data = LitJson.JsonMapper.ToObject(jsonString);
	
	malenames = data["malenames"];
	femalenames = data["femalenames"];
	surnames = data["surnames"];
	ranknames = data["ranknames"];
	placenames = data["placenames"];
	
	return data;
}
