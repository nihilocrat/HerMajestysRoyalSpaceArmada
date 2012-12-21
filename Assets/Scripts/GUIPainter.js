@script AddComponentMenu("GUI Panels/Painter")

public var skin : GUISkin;

public var readFromFile = true;
public var window_saveScheme: GUIEnterStringDialog;
public var window_loadScheme: GUILoadScheme;

public var currentShip : Transform;
public var currentBlazon : GUITexture;
public var currentPlayer : Player;
public var currentCultureIndex = 0;
private var cultureChoices = ["tri", "block"];

public var meshChoices : Mesh[];

private var show = new Hashtable();
private var conditionalBoxes = new Hashtable();
private var squadShipClass = "Frigate";

private var frontRankShips : GameObject[];
private var supportShips : GameObject[];
private var officerShips : GameObject[];

private var rankTextures : Array;
private var barTextures : Array;

public var colorChoices : Color[];
public var glowChoices : Color[];
public var colors : Color[];
private var currentColorIndex = 0;
private var colorNames = ["Primary", "Secondary", "Glow"];
private var currentColorName = colorNames[0];
private var colorChoiceIcons = new Array();
private var glowChoiceIcons = new Array();
public var colorIndexes : int[];

private var fieldChoices : Texture2D[];
private var ordinaireChoices : Texture2D[];
private var chargeChoices : Texture2D[];
private var maskChoices : Object[];

public var textures : Texture2D[];
public var mask : Texture2D;
public var fleetName = "Her Majesty's 1st Fleet";
public var foldshipName = "HMS Ark Royal";

private var currentTextureIndex = 0;
private var texNames = ["Mask", "Field / Ordinaire", "Charge"];
private var currentTexName = texNames[0];

private var units : UnitDB;

private var team = 0;
private var team_material : Material;
private var team_contrail_material : Material;
private var blazon : Texture2D;

private var jsonField = "";

private var showControls = true;


function Start()
{
	units = Director.getSingleton().GetComponent(UnitDB);
	
	maskChoices      = LoadTextureChoices("blazon/mask");
	fieldChoices     = LoadTextureChoices("blazon/field", "blazon/empty");
	ordinaireChoices = LoadTextureChoices("blazon/ordinaire", "blazon/empty");
	chargeChoices    = LoadTextureChoices("blazon/charge", "blazon/empty");
	
	// setup blocks of color for the color picker
	var base = Resources.Load("blazon/base") as Texture2D;
	var newTexture : Texture2D;
	var newpixels : Color[];
	var c : Color;
	for(c in colorChoices)
	{
		newTexture = new Texture2D(32, 24);
		newpixels = TextureUtils.Colorize(base.GetPixels(), c);
		newTexture.SetPixels(newpixels);
		newTexture.Apply();
		
		colorChoiceIcons.Add( newTexture );
	}
	for(c in glowChoices)
	{
		newTexture = new Texture2D(32, 24);
		newpixels = TextureUtils.Colorize(base.GetPixels(), c);
		newTexture.SetPixels(newpixels);
		newTexture.Apply();
		
		glowChoiceIcons.Add( newTexture );
	}
	
	OnColorChange();
	
	var panels = ["ColorPicker", "TexturePicker", "MeshPicker"];
	
	for(var p in panels)
	{
		show[p] = false;
	}
	
	SetShow("ColorPicker");
}

function LoadTextureChoices(path : String) : Texture2D[]
{
	return LoadTextureChoices(path, null);
}

function LoadTextureChoices(path : String, extra : String) : Texture2D[]
{
	var texArray : Texture2D[];
	 
	if(extra != null)
	{
		objs = Resources.LoadAll(path, Texture2D);
		texArray = new Texture2D[objs.Length+1];
		objs.CopyTo(texArray, 1);
		texArray[0] = Resources.Load(extra) as Texture2D;
	}
	else
	{
		objs = Resources.LoadAll(path, Texture2D);
		texArray = new Texture2D[objs.Length];
		objs.CopyTo(texArray, 0);
	}
	
	return texArray;
}

function LateUpdate()
{
	if(Input.GetButtonDown("Menu"))
	{
		Debug.Log("quitting!");
		Application.Quit();
	}
	
	/*
	if(Input.GetButtonDown("Map"))
	{
		//toggle("TacticalMap");
		if(miniMap.enabled == false)
			miniMap.enabled = true;
		else
			miniMap.enabled = false;
	}
	*/
	
	// camera controls
	var mo : MouseOrbit;
	var cc : CameraControls;
	if(Input.GetMouseButtonDown(0)) {
		mo = Camera.main.GetComponent(MouseOrbit);
		cc = Camera.main.GetComponent(CameraControls);
		
		mo.target = currentShip;
		
		mo.Reset();
		//mo.distance = Mathf.Min(cc.GetZoom(), 10);
		//mo.distance = 0.6;
		/*
		iTween.MoveTo(mo.gameObject,
			iTween.Hash(
				"time", 0.4,
				"easetype", iTween.EaseType.easeOutExpo,
				"position", mo.GetStartPosition(),
				"oncomplete", "OnEnterOrbit", "oncompletetarget", gameObject
			)
		);
		*/
		OnEnterOrbit();
	}
	else if(Input.GetMouseButtonUp(0)) {
		mo = Camera.main.GetComponent(MouseOrbit);
		cc = Camera.main.GetComponent(CameraControls);
		
		cc.SetZoom(mo.distance);
		
		//iTween.Stop(mo.gameObject);
		mo.enabled = false;
	}	
	
}


function OnEnterOrbit() {
	if(Input.GetMouseButton(0)) {
		var cc = Camera.main.GetComponent(CameraControls);
		var mo = Camera.main.GetComponent(MouseOrbit);
		
		cc.enabled = false;
		mo.distance = Vector3.Distance(mo.transform.position, mo.target.position);
		mo.enabled = true;
	}
}


function OnGUI()
{
	GUI.skin = skin;
	
	GUI.Label(Rect(20, Screen.height - 20, Screen.width, 20), "data path: " + Application.dataPath);
	
	var i : int;
	var j : int;
	var width = Screen.width * 0.8;
	var center_y = Screen.height/2;
	var halfwidth = width / 2;
	
	
	if( GUI.Button(Rect(Screen.width - 64, 0, 64, 32), "Exit") )
	{
		Application.LoadLevel("0_mainmenu");
	}
	
	var name_x = (Screen.width * 0.05) - 8;
	var name_y = Screen.height * 0.54;
	GUI.Box( Rect(name_x, name_y, 128 + 32, 40), "Fleet Name:");
	fleetName = GUI.TextField (Rect (name_x, name_y + 20, 128 + 32, 20), fleetName, 32);
	
	GUI.Box( Rect(name_x, name_y + 40, 128 + 32, 40), "Flagship Name:");
	foldshipName = GUI.TextField (Rect (name_x, name_y + 60, 128 + 32, 20), foldshipName, 32);
	
	// for hiding all the painter controls
	if(!showControls)
	{
		GUI.BeginGroup(Rect(Screen.width*0.1, 0, width,60));
	
		GUI.Box(Rect(0,0,width,30), "Her Majesty's Royal Fleet Painter");
	
		if(GUI.Button(Rect((width/2)-50,30,100,20), "- Show -"))
		{
			showControls = true;
		}
		
		GUI.EndGroup();
		
		return;
	}
		
		
	if(show["ColorPicker"])
	{
		GUI.Window(0, Rect(100, Screen.height * 0.7, 600, 86), DrawColorPicker, currentColorName);
	}
	if(show["TexturePicker"])
	{
		GUI.Window(0, Rect(100, Screen.height * 0.7, 600, 86), DrawTexturePicker, currentTexName);
	}
	else if(show["MeshPicker"])
	{
		GUI.Window(0, Rect(Screen.width * 0.4, Screen.height * 0.2, 160, 400), DrawMeshPicker, "Choose a ship");
	}
	
	if(show["SaveConfirm"])
	{
		GUI.Window(1, Rect(Screen.width * 0.35, Screen.height * 0.4, 250, 80), DrawSaveConfirm, "Fleet Saved");
	}
	
		
	// adjust GUI based on the controls that will end up being drawn
	// whether or not they are loading JSON from file	
	var topWindowHeight : float;
	var pickButtonRect : Rect;
	if(readFromFile) {
		pickButtonRect = Rect(150, 20, 200, 20);
		topWindowHeight = 50;
	}
	else {
		pickButtonRect = Rect(10, 40, 200, 20);
		topWindowHeight = 100;
	}
		
	// top window
	GUI.BeginGroup(Rect(Screen.width*0.1, 0, width, topWindowHeight+40));
	
	GUI.Box(Rect(0,0,width,topWindowHeight), "Her Majesty's Royal Fleet Painter");
	
	// pick mesh button
	var shipMesh = currentShip.GetComponent(MeshFilter);
	var meshName = shipMesh.mesh.name.Split(' '[0])[0];
	GUI.Label( Rect(10, 20, 200, 20), "Preview Ship:");
	
	if(GUI.Button(pickButtonRect, meshName)) {
		SetShow("MeshPicker");
	}
	
	if(readFromFile) {
		if(GUI.Button(Rect(width-200,20,100,20), "Save Scheme"))
		{
			// have to hide all other windows for the new window to actually work!
			//HideAll();
			//window_saveScheme.parent = this.gameObject;
			//window_saveScheme.toggle();
			
			if( SaveToFile( Utils.GetFileNameFromFleetName(fleetName, "scheme") ) )
			{
				toggle("SaveConfirm");
			}
		}
		if(GUI.Button(Rect(width-100,20,100,20), "Load Scheme"))
		{
			// have to hide all other windows for the new window to actually work!
			HideAll();
			window_loadScheme.parent = this.gameObject;
			window_loadScheme.toggle();
		}
	}
	else
	{
		// JSON field
		GUI.Label( Rect(260, 20, 260, 20), "Copy or Paste scheme code here:");
		jsonField = GUI.TextArea(Rect(260, 40, 260, 60), jsonField);
		
		if(GUI.Button(Rect(width-100,20,100,20), "Save Scheme"))
		{
			jsonField = Serialize();
		}
		if(GUI.Button(Rect(width-100,40,100,20), "Load Scheme"))
		{
			UnSerialize(jsonField);
			OnColorChange();
			OnCultureChange(currentCultureIndex);
		}
	}
	
	if(GUI.Button(Rect((width/2)-50,topWindowHeight,100,20), "- Hide -"))
	{
		showControls = false;
	}
	
	GUI.EndGroup();
	
	
	
	
		
	// bottom window
	GUI.BeginGroup(Rect(Screen.width*0.1, Screen.height*0.85, width,140));
	
	if(currentShip != null)
	{
		
		// uncomment this to make the box float where the planet is
		//var guipos = Camera.main.WorldToScreenPoint(transform.position);
		//GUI.BeginGroup(Rect(guipos.x-halfwidth, 480-guipos.y-halfwidth, width,200));
		
		GUI.Box(Rect(0,0,width,200), "");

		// FIXME : replace with a dummy player 0
		
		
		// draw slot buttons
		// clicking on an existing building will reveal upgrade/sell menu
		// clicking on empty slot will bring up build menu
		// the last empty slot should be a "planet upgrade" button
		// of course, if the planet is fully upgraded, there are no remaining slots,
		// thus no upgrade button
		//GUI.BeginGroup(Rect(10,40,400,80));
		GUI.BeginGroup(Rect(10,10,width,80));
		
		GUI.Label( Rect(0, 0, 100, 20), "Culture: " + cultureChoices[currentCultureIndex]);
		//currentCultureIndex = GUI.Toolbar( Rect(0, 20, 200, 20), currentCultureIndex, cultureChoices);
		i = 0;
		for(var cultureName in cultureChoices)
		{
			if( GUI.Button(Rect(0, 20 + (20 * i), 80, 20), cultureName) )
			{
				OnCultureChange(i);
				currentCultureIndex = i;
			}
			i += 1;
		}
		
		// Color choices
		GUI.Label( Rect(100, 0, 200, 20), "Ship Colors:");
	
		i = 0;
		j = 0;
		var buttonsize = 40;
		for(var colorType in colors) {
			var icons : Texture2D[];
			if(i == 2)
				icons = glowChoiceIcons;
			else
				icons = colorChoiceIcons;
		
			if(GUI.Button(Rect(100 + (i * buttonsize), 20, buttonsize, 40), icons[colorIndexes[i]])) {
				currentColorIndex = i;
				currentColorName = colorNames[i];
				SetShow("ColorPicker");
			}
			i++;
		}
		
		// Texture choices
		buttonsize = 64;
		for(i=1; i<=2; i++) {
			if(i == 0) continue;
		
			//GUI.Label(Rect(i * buttonsize, 50, buttonsize, 32), "Texture " + i);
			if(GUI.Button(Rect(340 + (i-1) * buttonsize, 0, buttonsize, buttonsize), textures[i])) {
				currentTextureIndex = i;
				currentTexName = texNames[i];
				SetShow("TexturePicker");
			}
		}
		
		// special mask button
		if(GUI.Button(Rect(260, 0, buttonsize, buttonsize), mask)) {
			currentTextureIndex = -1;
			currentTexName = texNames[0];
			SetShow("TexturePicker");
		}

		
		/*
		for(i=0; i<planet.slots.length ; i++) {
			GUI.Button(Rect(i * 40, 0, 40, 40), planet.slots[i]);
		}
		
		if(planet.rank < 7) {
			if(GUI.Button(Rect(i * 40, 0, 40, 40), "lvl++\n$"+(planet.rank+1)*Globals.planet_upgrade_cost_per_rank)) {
				planet.Upgrade();
			}
		}
		*/
		
		GUI.EndGroup();
		
		// Display the tooltip from the element that has mouseover or keyboard focus
		GUI.Label (Rect (10,80,150,20), GUI.tooltip);
	}
	
	
	GUI.EndGroup();
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


function DrawColorPicker(windowID : int)
{
		GUILayout.BeginArea(Rect(0, 20, 600, 64));
		GUILayout.BeginVertical();
		GUILayout.BeginHorizontal();
		
		var choices : Color[];
		var icons : Texture2D[];
		if(currentColorIndex == 2)
		{
			choices = glowChoices;
			icons = glowChoiceIcons;
		}
		else
		{
			choices = colorChoices;
			icons = colorChoiceIcons;
		}
		
		var i = 0;
		var halfLength = choices.Length / 2;
		for(var colorC in choices) {
			if(i == halfLength)
			{
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
			}
			
			//if(GUI.Button(Rect(i * buttonsize, 16, buttonsize, 16), colorC.ToString())) {
			if(GUILayout.Button(icons[i])) {
				colors[currentColorIndex] = colorC;
				colorIndexes[currentColorIndex] = i;
				OnColorChange();
			}
			i++;
		}
		
		GUILayout.EndHorizontal();
		GUILayout.EndVertical();
		GUILayout.EndArea();
}

function DrawTexturePicker(windowID : int)
{
		GUILayout.BeginArea(Rect(0, 8, 600, 90));
		GUILayout.BeginVertical();
		GUILayout.BeginHorizontal();
		
		var choices : Texture2D[];
		if(currentTextureIndex == 1) {
			choices = new Texture2D[fieldChoices.Length + ordinaireChoices.Length];
			fieldChoices.CopyTo(choices, 0);
			ordinaireChoices.CopyTo(choices, fieldChoices.Length);
		}
		else if(currentTextureIndex == 2) {
			choices = chargeChoices;
		}
		else if(currentTextureIndex == 3) {
			choices = chargeChoices;
		}
		
		// mask texture
		else if(currentTextureIndex == -1) {
			choices = maskChoices;
		}
		
		var i : int = 0;
		var col = 0;
		var row = 0;
		var buttonsize = 32;
		var halfLength : int = Mathf.Ceil(choices.Length / 2);
		
		for(var texC in choices) {
			if(i == halfLength)
			{
				row = 1;
				col = 0;
				GUILayout.EndHorizontal();
				GUILayout.BeginHorizontal();
			}
			
			if(GUI.Button(Rect(col * buttonsize, 12 + (buttonsize * row), buttonsize, buttonsize), texC)) {
				if(currentTextureIndex == -1) {
					mask = texC;
				}
				else {
					textures[currentTextureIndex] = texC;
				}
				OnColorChange();
			}
			/*
			if(GUILayout.Button(texC)) {
				textures[currentTextureIndex] = texC;
				OnColorChange();
			}
			*/
			col++;
			i++;
		}
		
		GUILayout.EndHorizontal();
		GUILayout.EndVertical();
		GUILayout.EndArea();
}

function DrawMeshPicker(windowID : int)
{
		GUILayout.BeginArea(Rect(5, 16, 150, 400));
		GUILayout.BeginVertical();
		
		var shipMesh = currentShip.GetComponent(MeshFilter);
		
		for(var m in meshChoices) {
			var meshName = m.name.Split(' '[0])[0] ;
			if(GUILayout.Button(meshName)) {
				shipMesh.mesh = m;
				SetShow("ColorPicker");
			}
		}
		
		GUILayout.EndVertical();
		GUILayout.EndArea();
}

function DrawSaveConfirm(windowID : int)
{
	GUI.Label(Rect(20,20,200,40), fleetName+" saved!");
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


function SetShow(showPanelName : String)
{
	SetShow(showPanelName, true);
}

function SetHide(showPanelName : String)
{
	SetShow(showPanelName, false);
}

function HideAll()
{
	SetShow("foobar", false);
}

function SetShow(showPanelName : String, showValue : boolean)
{
	var keys = new String[show.Count];
	show.Keys.CopyTo(keys, 0);

	for(var panelName in keys)
	{
		if(panelName == showPanelName)
		{
			show[panelName] = true;
		}
		else
		{
			show[panelName] = false;
		}
	}
}


function OnColorChange()
{
	currentPlayer.colors = colors;
	var blaze = currentPlayer.GetComponent(Blazon);
	blaze.mask = mask;
	blaze.teamColors = colors;
	blaze.teamTextures = textures;
	blazon = blaze.MakeTexture();

	//TeamSettings.getSingleton().generateAllTeamMaterials();
	TeamSettings.getSingleton().generateTeamMaterial(team);

	team_material = TeamSettings.getSingleton().getMaterial(team);
	team_contrail_material = TeamSettings.getSingleton().getContrailMaterial(team);
	//blazon = Player.getPlayer(team).getBlazon();
	//blazon = blaze.GetBlazon();

	var fShip = currentShip.GetComponent(FleetShip);
	
	currentShip.renderer.material = team_material;
	var contrail = currentShip.transform.Find("contrail");
	if(contrail) {
		contrail.renderer.material = team_contrail_material;
	}
	
	currentBlazon.texture = blazon;
}

function OnCultureChange(culture : int)
{
	currentCultureIndex = culture;

	var shipMesh = currentShip.GetComponent(MeshFilter);
		
	if(culture == 0)
		shipMesh.mesh = meshChoices[0];
	else if(culture == 1)
		shipMesh.mesh = meshChoices[6];
}


function GetTexturePath(tex : Texture2D)
{
	//return AssetDatabase.GetAssetPath(tex).Replace("Assets/Resources/", "").Replace(".png","");
	var path = "blazon/";
	var nameParts = tex.name.Split("_"[0]);
	if( nameParts.Length > 1 )
		path += nameParts[0] + "/";
	path += tex.name;
	return path;
}


function SaveToFile(filename : String)
{
	// this is a bit dumb, I think?
	var finalJson = Serialize();
	var fs : FileStream;
	fs = File.Open(Application.dataPath + "/Data/FleetSchemes/" + filename, FileMode.Create, FileAccess.Write, FileShare.None);
	
	var info : System.Byte[];
	info = new UTF8Encoding(true).GetBytes(finalJson);
	fs.Write(info, 0, info.Length);
	fs.Close();
	
	Debug.Log("Wrote to " + filename);
	return true;
}


function DumpColors()
{
	var allColors : String;
	
    allColors = "static public Color[] colorChoices = {\n";
    for(var c in colorChoices) {
    	ctext = c.ToString().Replace("RGBA", "new Color");
    	allColors += ctext + ",";
    }
    allColors += "\n}";
    
    Debug.Log(allColors);
    
    
    allColors = "static public Color[] glowChoices = {\n";
    for(var c in glowChoices) {
    	ctext = c.ToString().Replace("RGBA", "new Color");
    	allColors += ctext + ",";
    }
    allColors += "\n}";
    
    Debug.Log(allColors);
}


function Serialize()
{
	var data = {
		"version" : 1,
		"name" : fleetName,
		"foldshipName" : foldshipName,
		"culture" : currentCultureIndex,
		"colors" : [
			colorIndexes[0],
			colorIndexes[1],
			colorIndexes[2] // note: this is a glow color index, not a normal color index
		],
		"mask" : GetTexturePath(mask),
		"textures" : [
			GetTexturePath(textures[0]),
			GetTexturePath(textures[1]),
			GetTexturePath(textures[2])
		]
	};
	var jsonString = LitJson.JsonMapper.ToJson(data);
    
    return jsonString;
}


function UnSerialize(jsonString : String)
{
	// unscientific way of loading from file
	if(jsonString.Length < 128 && jsonString[0] != "{"[0])
		jsonString = Utils.LoadJsonFromFile("FleetSchemes/"+jsonString);

	var i : int;
	var data = LitJson.JsonMapper.ToObject(jsonString);
	
	fleetName = data["name"];
	foldshipName = data["foldshipName"];
	OnCultureChange(data["culture"]);
	//currentCultureIndex = data["culture"];
	
	mask = Resources.Load( data["mask"].ToString() ) as Texture2D;
	for(i=0;i<=2;i++)
	{
		textures[i] = Resources.Load( data["textures"][i].ToString() ) as Texture2D;
	}
		
	for(i=0;i<=1;i++)
	{
		colorIndexes[i] = data["colors"][i];
		colors[i] = colorChoices[data["colors"][i]];
	}
	
	colors[2] = glowChoices[data["colors"][2]];
	
	return data;
}
