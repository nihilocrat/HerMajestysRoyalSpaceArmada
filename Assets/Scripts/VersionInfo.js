import Globals;

function Awake() {
	guiText.text = "Version: " + Globals.version;
}

@script RequireComponent(GUIText)