using UnityEngine;
using System.Collections;

public class GUITextureObj : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/

	/*-----------------------------------Private Variables-----------------------------------*/
	private GUIManager ptrGUIMgr;
	private GameObject pObj;		//This game object
	private GUITexture pTexture;	//CUITexture component
	private Animator pAnimator;		//Animator script component
	private bool pActive;
	private Vector2 pLocation;
	
	/*----------------------------------------Methods----------------------------------------*/
	//Get pointer to game object
	public GameObject GameObj
	{
		get { return pObj; }
	}

	//Get pointer to GUITexture
	public GUITexture TextureObj
	{
		get { return pTexture; }
	}
	
	//Is this GUI element being used
	public bool GUIActive
	{
		get { return pActive; }
		set {
			pActive = value;
		}
	}
	
	//Set the image of the GUITexture
	public Texture Image
	{
		get { return pTexture.texture; }
		set {
			pTexture.texture = value;
		}
	}
		
	//Set the color
	public Color Tint
	{
		get { return pTexture.color; }
		set {
			pTexture.color = value;
		}
	}

	//Set red channel only
	public float ColorRed
	{
		get { return pTexture.color.r; }
		set {
			Color TmpColor = pTexture.color;
			TmpColor.r = value;
			pTexture.color = TmpColor;
		}
	}
	
	//Set blue channel only
	public float ColorBlue
	{
		get { return pTexture.color.b; }
		set {
			Color TmpColor = pTexture.color;
			TmpColor.b = value;
			pTexture.color = TmpColor;
		}
	}

	//Set green channel only
	public float ColorGreen
	{
		get { return pTexture.color.g; }
		set {
			Color TmpColor = pTexture.color;
			TmpColor.g = value;
			pTexture.color = TmpColor;
		}
	}

	//Set alpha channel only
	public float ColorAlpha
	{
		get { return pTexture.color.a; }
		set {
			Color TmpColor = pTexture.color;
			TmpColor.a = value;
			pTexture.color = TmpColor;
		}
	}

	//Set the location
	public Rect Location
	{
		get {
			Rect TmpRect = pTexture.pixelInset;
			TmpRect.x = pLocation.x;
			TmpRect.y = pLocation.y;
			return TmpRect;
		}
		set {
			//Set internal variable
			pLocation.x = value.x;
			pLocation.y = value.y;
			//Recalculate for GUITexture object
			Rect TmpRect = value;
			TmpRect.x = pLocation.x - (pTexture.texture.width/2);
			TmpRect.y = ptrGUIMgr.ScreenHeight - pLocation.y - (pTexture.texture.height/2);
			/*if (pCameraMgr.mVerticalOrientation == true)
			{
				TmpRect.y = 480f - pLocation.y - (pTexture.texture.height/2);
			}
			else
			{
				TmpRect.y = 320f - pLocation.y - (pTexture.texture.height/2);
			}*/
			pTexture.pixelInset = TmpRect;
		}
	}
	
	//Set X location only
	public float LocX
	{
		get { return pLocation.x; }
		set {
			//Set internal variable
			pLocation.x = value;
			//Recalculate for GUITexture object
			Rect TmpRect = pTexture.pixelInset;
			TmpRect.x = pLocation.x - (pTexture.texture.width/2);
			pTexture.pixelInset = TmpRect;
		}
	}
	
	//Set Y location only
	public float LocY
	{
		get { return pLocation.y; }
		set {
			//Set internal variable
			pLocation.y = value;
			//Recalculate for GUITexture object
			Rect TmpRect = pTexture.pixelInset;
			TmpRect.y = ptrGUIMgr.ScreenHeight - pLocation.y - (pTexture.texture.height/2);
			/*if (pCameraMgr.mVerticalOrientation == true)
			{
				TmpRect.y = 480f - pLocation.y - (pTexture.texture.height/2);
			}
			else
			{
				TmpRect.y = 320f - pLocation.y - (pTexture.texture.height/2);
			}*/
			pTexture.pixelInset = TmpRect;
		}
	}
	
	//Set width only
	public float LocW
	{
		get { return pTexture.pixelInset.width; }
		set {
			Rect TmpRect = pTexture.pixelInset;
			TmpRect.width = value;
			pTexture.pixelInset = TmpRect;
		}
	}
	
	//Set height only
	public float LocH
	{
		get { return pTexture.pixelInset.height; }
		set {
			Rect TmpRect = pTexture.pixelInset;
			TmpRect.height = value;
			pTexture.pixelInset = TmpRect;
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
	
	//Set visibility
	public bool Enabled
	{
		get { return pObj.active; }
		set {
			pObj.active = value;
		}
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
		
		//Reset settings to default
		pTexture.color = new Color(0.5f, 0.5f, 0.5f, 0.5f);
		pTexture.pixelInset = new Rect(0,0,0,0);
	}
	
	//Check if mouse was clicked on this
	public bool CheckHit (Vector3 Coords)
	{
		if (pTexture.HitTest(Coords) == true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Mode To
	public void AnimateTo (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		//Wrapper function
		pAnimator.AnimateTo(this, Duration, CallbackObj, CallbackMsg, CallbackParams, args);
	}

	//Mode From
	public void AnimateFrom (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		//Wrapper function
		pAnimator.AnimateFrom(this, Duration, CallbackObj, CallbackMsg, CallbackParams, args);
	}
	
	//Mode By
	public void AnimateBy (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
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
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
		pObj = gameObject;
		pTexture = (GUITexture) gameObject.GetComponent(typeof(GUITexture));
		pAnimator = (Animator) gameObject.GetComponent(typeof(Animator));
		pActive = false;
		pLocation = new Vector2(0f, 0f);
		
		//Turn off this texture object
		gameObject.active = false;
	}
}
