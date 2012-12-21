using UnityEngine;
using System.Collections;

public class Button1 : MonoBehaviour {

	public Texture2D pTex;
	
	private GUIQuadObj thisObj;
	private GUITextObj ptrTitle;
	private GUITextureObj ptrImage;
	private bool FadeDir;
	private GUIManager ptrGUIMgr;
	
	void Awake ()
	{
		thisObj = (GUIQuadObj) gameObject.GetComponent(typeof(GUIQuadObj));
		FadeDir = true;
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
	}
	
	void Start ()
	{
		thisObj.AnimateTo(4f, null, null, null, "Location", new Vector2(120f,160f), "Rotation", new Vector3(0f,0f,180f), "easing", Ani.AnimationEasingType.SinusoidalEasing);
		thisObj.AnimateTo(4f, null, null, null, "Location", new Vector2(240f,160f), "Rotation", new Vector3(0f,0f,0f));
		thisObj.StartAnimation (Ani.Animate.Loop, null, null, null);
		
		ptrImage = ptrGUIMgr.ptrTextureMgr.GetGUITexture(gameObject.layer);
		ptrImage.Image = pTex;
		ptrImage.Location = new Rect(100f, 200f, 72f, 72f);
		ptrImage.Enabled = true;
		
		ptrImage.AnimateTo(1f, null, null, null, "LocY", 200f, "easing", Ani.AnimationEasingType.LinearEasing);
		ptrImage.AnimateTo(1f, null, null, null, "LocY", 300f, "easing", Ani.AnimationEasingType.LinearEasing);
		ptrImage.StartAnimation (Ani.Animate.Loop, null, null, null);

		ptrTitle = ptrGUIMgr.ptrTextMgr.GetGUIText(gameObject.layer);
		ptrTitle.Text = "Hello World";
		ptrTitle.Location = new Vector2(240f, 50f);
		ptrTitle.GUIDepth = 1;
		ptrTitle.SetFormat(null, TextAlignment.Center, TextAnchor.UpperCenter, 1.34f, 4f);
		ptrTitle.TextMaterial = null;
		ptrTitle.Enabled = true;
		
		ptrTitle.AnimateTo(4f, null, null, null, "LocX", 340f, "easing", Ani.AnimationEasingType.LinearEasing);
		ptrTitle.AnimateTo(4f, null, null, null, "LocX", 140f, "easing", Ani.AnimationEasingType.LinearEasing);
		ptrTitle.StartAnimation (Ani.Animate.Loop, null, null, null);
	}
	
	void FixedUpdate ()
	{
		Color tmpTint = thisObj.Tint;
		
		if (FadeDir == true)
		{
			tmpTint.a = tmpTint.a - 0.0125f;
			if (tmpTint.a <= 0f)
			{
				tmpTint.a = 0f;
				FadeDir = false;
			}
		}
		else
		{
			tmpTint.a = tmpTint.a + 0.0125f;
			if (tmpTint.a >= 1f)
			{
				tmpTint.a = 1f;
				FadeDir = true;
			}
		}
		thisObj.Tint = tmpTint; 
	}
	
	void onGUIDown (iPhoneTouch pTouch)
	{
		Debug.Log(gameObject.name + " Down");
	}
}
