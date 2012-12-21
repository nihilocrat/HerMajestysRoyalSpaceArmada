using UnityEngine;

public class SetText : MonoBehaviour
{
	public string[] lines;

	public void Awake() {
		guiText.text = "";
		foreach(string line in lines) {
			guiText.text += line + "\n";
		}
	}

	public void setText(string newtext) {
		guiText.text = newtext;
	}

}

