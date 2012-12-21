import System.IO;
import System.Text;
import Path;
@script AddComponentMenu("GUI Panels/Enter String Dialog")

public var skin : GUISkin;
public var show = true;
public var parent : GameObject;

public var title = "Enter filename";
public var chosenDirectory = "/Data/";
public var fileExtension = ".scheme.json";
public var chosenValue = "";

private var width : float;
private var height : float;
private var windowRect : Rect;
private var shortFileName = "";


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
	GUI.Window(0, windowRect, DrawSchemePicker, title);
}

function DrawSchemePicker(windowID : int)
{
	var buttonHeight = 20;
	var padding = 5;

	GUI.BeginGroup(Rect(padding, 16, width, height));
	//GUILayout.BeginArea(Rect(5, 16, 100, 300));
	//GUILayout.BeginVertical();
	
	shortFileName = GUI.TextArea(Rect(padding, 16, width, buttonHeight), "fleet_");
	
	if(GUI.Button(Rect(padding, 40, width-(padding*2), buttonHeight), "Save")) {
		chosenValue = shortFileName + fileExtension;
		
		// this is a bit dumb, I think?
		var painter = parent.GetComponent(GUIPainter);
		var finalJson = painter.Serialize();
		var fs : FileStream;
		fs = File.Open(Application.dataPath + chosenDirectory + chosenValue, FileMode.CreateNew, FileAccess.Write, FileShare.None);
		
		var info : System.Byte[];
		info = new UTF8Encoding(true).GetBytes(finalJson);
		fs.Write(info, 0, info.Length);
		fs.Close();
		
		Debug.Log("Wrote to " + chosenValue);
		
		show = false;
	}
		
	//GUILayout.EndVertical();
	//GUILayout.EndArea();
	GUI.EndGroup();
}

