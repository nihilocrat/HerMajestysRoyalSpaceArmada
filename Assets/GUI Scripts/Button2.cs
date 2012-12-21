using UnityEngine;
using System.Collections;

public class Button2 : MonoBehaviour {

	private GUIQuadObj thisObj;
	private float pTimer;
	
	void Awake ()
	{
		thisObj = (GUIQuadObj) gameObject.GetComponent(typeof(GUIQuadObj));
	}
	
	void Start ()
	{
		thisObj.StartFPS(1, 13, 10f, GUIQuadObj.FrameMode.ForwardLoop);
	}
	
	void onGUIDown (iPhoneTouch pTouch)
	{
		Debug.Log(gameObject.name + " Down");
	}
}
