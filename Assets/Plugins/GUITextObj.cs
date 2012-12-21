using UnityEngine;
using System.Collections;

public class GUITextObj : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/

	/*-----------------------------------Private Variables-----------------------------------*/
	private GUIManager ptrGUIMgr;
	private GameObject pObj;				//This game object
	private GUIText pText;				//GUITexture component
	private Animator pAnimator;			//Animator script component
	private bool pActive;
	private Vector2 pLocation;
	
	/*----------------------------------------Methods----------------------------------------*/
	//Get pointer to game object
	public GameObject GameObj
	{
		get { return pObj; }
	}

	//Get pointer to GUIText
	public GUIText TextObj
	{
		get { return pText; }
	}
	
	//Is this GUI element being used
	public bool GUIActive
	{
		get { return pActive; }
		set {
			pActive = value;
		}
	}
	
	//Set the text to the GUIText
	public string Text
	{
		get { return pText.text; }
		set {
			pText.text = value;
		}
	}
		
	//Set the location
	public Vector2 Location
	{
		get { return pLocation; }
		set {
			//Set internal variable
			pLocation = value;
			//Recalculate for GUIText object
			Vector2 tmpVect = pLocation;
			tmpVect.y = ptrGUIMgr.ScreenHeight - pLocation.y;
			/*if (pCameraMgr.mVerticalOrientation == true)
			{
				tmpVect.y = 480f - pLocation.y;
			}
			else
			{
				tmpVect.y = 320f - pLocation.y;
			}*/
			pText.pixelOffset = tmpVect;
		}
	}
	
	//Set X location only
	public float LocX
	{
		get { return pLocation.x; }
		set {
			//Set internal variable
			pLocation.x = value;
			//Recalculate for GUIText object
			Vector2 TmpVect = pText.pixelOffset;
			TmpVect.x = pLocation.x;
			pText.pixelOffset = TmpVect;
		}
	}
	
	//Set Y location only
	public float LocY
	{
		get { return pLocation.y; }
		set {
			//Set internal variable
			pLocation.y = value;
			//Recalculate for GUIText object
			Vector2 TmpVect = pText.pixelOffset;
			TmpVect.y = ptrGUIMgr.ScreenHeight - pLocation.y;
			/*if (pCameraMgr.mVerticalOrientation == true)
			{
				TmpVect.y = 480f - pLocation.y;
			}
			else
			{
				TmpVect.y = 320f - pLocation.y;
			}*/
			pText.pixelOffset = TmpVect;
		}
	}
	
	//Set z order of object
	public float GUIDepth
	{
		get { return pObj.transform.position.z; }
		set {
			pObj.transform.position = new Vector3(0, 0, value);
		}
	}
	
	//Set text material
	public Material TextMaterial
	{
		get { return pText.material; }
		set {
			pText.material = value;
		}
	}
	
	//Set visibility
	public bool Enabled
	{
		get { return pObj.active; }
		set {
			pObj.active = value;
		}
	}
	
	//Set text formatting
	public void SetFormat (Font pFont, TextAlignment pAlign, TextAnchor pAnchor, float pSpacing, float pTabSize)
	{
		pText.font = pFont;
		pText.alignment = pAlign;
		pText.anchor = pAnchor;
		pText.lineSpacing = pSpacing;
		pText.tabSize = pTabSize;
	}
	
	//Reset GUI to default state
	public void Reset ()
	{
		//Stop all animation
		pAnimator.StopAnimation();
		pAnimator.ClearAnimation();
		
		//Reset variables and turn off component
		pActive = false;
		gameObject.active = false;
	}
	
	//Check if mouse was clicked on this
	public bool CheckHit (Vector3 Coords)
	{
		if (pText.HitTest(Coords) == true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Mode To
	public void AnimateTo (float Duration, GameObject CallbackObj, string CallbackMsg, object CallbackParams, params object[] args)
	{
		//Wrapper function
		pAnimator.AnimateTo(this, Duration, CallbackObj, CallbackMsg, CallbackParams, args);
	}

	//Mode From
	public void AnimateFrom (float Duration, GameObject CallbackObj, string CallbackMsg, object CallbackParams, params object[] args)
	{
		//Wrapper function
		pAnimator.AnimateFrom(this, Duration, CallbackObj, CallbackMsg, CallbackParams, args);
	}
	
	//Mode By
	public void AnimateBy (float Duration, GameObject CallbackObj, string CallbackMsg, object CallbackParams, params object[] args)
	{
		//Wrapper function
		pAnimator.AnimateBy(this, Duration, CallbackObj, CallbackMsg, CallbackParams, args);
	}

	//Start animation sequence
	public void StartAnimation (Ani.Animate AnimateMode, GameObject CallbackObj, object CallbackMsg, object CallbackParams)
	{
		//Wrapper function
		switch (AnimateMode)
		{
			case Ani.Animate.OneShot:
				pAnimator.StartAnimation(Ani.Animate.OneShot, CallbackObj, CallbackMsg, CallbackParams);
				break;
			case Ani.Animate.Loop:
				pAnimator.StartAnimation(Ani.Animate.Loop, CallbackObj, CallbackMsg, CallbackParams);
				break;
		}	
	}
	
	//Stop animation sequence
	public void StopAnimation ()
	{
		//Wrapper function
		pAnimator.StopAnimation();
	}
	
	//Clear animation queue
	public void ClearAnimation ()
	{
		//Wrapper function
		pAnimator.ClearAnimation();
	}

	/*-------------------------------------Unity Methods-------------------------------------*/
	void Awake ()
	{
		//Get pointer to GUI manager
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
		pObj = gameObject;
		pText = (GUIText) gameObject.GetComponent(typeof(GUIText));
		pAnimator = (Animator) gameObject.GetComponent(typeof(Animator));
		pActive = false;
		pLocation = new Vector2(0f, 0f);
		
		//Turn off this text object
		gameObject.active = false;
	}
}
