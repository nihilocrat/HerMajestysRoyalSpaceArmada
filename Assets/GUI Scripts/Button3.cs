using UnityEngine;
using System.Collections;

public class Button3 : MonoBehaviour {

	private GUIQuadObj thisObj;
	private bool DepthDir;
	
	public void ResetAnimation ()
	{
		thisObj.Rotation = new Vector3(0,0,0f);
	}
	
	void Awake ()
	{
		thisObj = (GUIQuadObj) gameObject.GetComponent(typeof(GUIQuadObj));
		DepthDir = true;
	}
	
	void Start ()
	{
		thisObj.AnimateTo(4f, gameObject, "ResetAnimation", null, "Rotation", new Vector3(0f,360f,0f), "easing", Ani.AnimationEasingType.LinearEasing);
		thisObj.StartAnimation (Ani.Animate.Loop, null, null, null);
	}
	
	void FixedUpdate ()
	{
		float tmpDepth = thisObj.Depth;
		
		if (DepthDir == true)
		{
			tmpDepth = tmpDepth - 0.5f;
			if (tmpDepth <= 0f)
			{
				tmpDepth = 0f;
				DepthDir = false;
			}
		}
		else
		{
			tmpDepth = tmpDepth + 0.5f;
			if (tmpDepth >= 20f)
			{
				tmpDepth = 20f;
				DepthDir = true;
			}
		}
		thisObj.Depth = tmpDepth; 
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
