using UnityEngine;
using System.Collections;

public class Button4 : MonoBehaviour {

	void Awake ()
	{
	}
	
	void Start ()
	{
	}
		
	void onGUIDown (iPhoneTouch pTouch)
	{
		Debug.Log(gameObject.name + " Down");
	}

	void onGUIUp (iPhoneTouch pTouch)
	{
		Debug.Log(gameObject.name + " Up");
	}
}
