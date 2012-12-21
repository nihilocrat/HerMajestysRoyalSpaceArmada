

function OnGUI()
{
	GUILayout.BeginArea (Rect((Screen.width/2)-100,Screen.height/2,200,300));
	GUILayout.BeginVertical();

	if(GUILayout.Button("Play Again")) {
		Application.LoadLevel("2_battlescape");
	}
	if(GUILayout.Button("Main Menu")) {
		Application.LoadLevel("0_mainmenu");
	}

	if(GUILayout.Button("Quit"))
	{
		Debug.Log("quitting game!");
		Application.Quit();
	}
	
	GUILayout.EndVertical();
	GUILayout.EndArea();
}