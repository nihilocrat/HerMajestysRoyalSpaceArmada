import System.IO;
import Path;
@script AddComponentMenu("GUI Panels/Load Scheme")

public var skin : GUISkin;
public var show = true;
public var parent : GameObject;

public var chosenDirectory = "/Data/";
public var searchPattern = "*.scheme.json";
public var messageName = "UnSerialize";
public var chosenValue = "";

private var width : float;
private var height : float;
private var windowRect : Rect;

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
	GUI.Window(42, windowRect, DrawSchemePicker, "Choose a scheme");
	//GUI.Box(windowRect, "Choose a scheme");
	//DrawSchemePicker(42);
}

function DrawSchemePicker(windowID : int)
{
	var buttonHeight = 20;
	var padding = 5;

	var files = Directory.GetFiles(Application.dataPath + chosenDirectory, searchPattern);

	var innerRect = new Rect(padding, 20,width-(padding*2), height-20);
	//var innerRect = new Rect(Screen.width * transform.position.x + padding, Screen.height * transform.position.y + 20,
	//					  width-(padding*2), height-20);
	
	GUI.BeginScrollView(innerRect, Vector2.zero, Rect(0,0, width-(padding*6), 40 * buttonHeight));
	//GUI.BeginGroup(Rect(padding, 16, width, height));
	//GUILayout.BeginArea(Rect(5, 16, 100, 300));
	//GUILayout.BeginVertical();
	
	var i = 0;
	for(var f in files) {
		var fileName = Path.GetFileName(f);
		var shortFileName = (fileName).Split('.'[0])[0];
		
		if(GUI.Button(Rect(0, i * buttonHeight, width-(padding*2)-20, buttonHeight), shortFileName)) {
			chosenValue = fileName;
			Debug.Log("Chose " + chosenValue);
			parent.SendMessage(messageName, chosenValue);
			//parent.SendMessage("OnColorChange");
			show = false;
		}
		
		i += 1;
	}
	
	//GUILayout.EndVertical();
	//GUILayout.EndArea();
	GUI.EndScrollView();
}

