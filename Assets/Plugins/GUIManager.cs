using UnityEngine;
using System.Collections;

public class GUIManager : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/
	[HideInInspector]
	public GUICameras ptrCameraMgr;
	[HideInInspector]
	public int pCameraMask;
	[HideInInspector]
	public GUITextMgr ptrTextMgr;
	[HideInInspector]
	public GUITextureMgr ptrTextureMgr;

	public enum Layers
	{
		GUILayer1 = 8,
		GUILayer2 = 9,
		GUILayer3 = 10,
		GUILayer4 = 11,
		GUILayer5 = 12,
		GUILayer6 = 13,
		GUILayer7 = 14,
		GUILayer8 = 15,
		GUILayer9 = 16,
		GUILayer10	 = 17	
	}

	public enum CameraMode
	{
		Standard = 0,
		Perspective = 1
	}
	
	public int AllocBlockSize = 10;
	public int ScreenWidth = 800;
	public int ScreenHeight = 600;
	public CameraMode[] Cameras = new CameraMode[10];
	
	/*-----------------------------------Private Variables-----------------------------------*/

	/*----------------------------------------Methods----------------------------------------*/

	/*-------------------------------------Unity Methods-------------------------------------*/
	void Awake ()
	{
		GameObject tmpGameObj;
		
		//Get culling mask for non GUI cameras
		pCameraMask = (1 << (int)Layers.GUILayer1);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer2);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer3);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer4);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer5);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer6);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer7);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer8);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer9);
		pCameraMask = pCameraMask | (1 << (int)Layers.GUILayer10);
		pCameraMask = ~pCameraMask;
		//Set all non GUI cameras not to render GUI layers
		Camera[] allCams = Camera.allCameras;
		foreach (Camera tmpCam in allCams)
		{
			tmpCam.cullingMask = pCameraMask;
		}

		//Initialize the Camera system
		tmpGameObj = new GameObject();
		tmpGameObj.name = "GUICameras";
		tmpGameObj.AddComponent("GUICameras");
		ptrCameraMgr = (GUICameras) tmpGameObj.GetComponent(typeof(GUICameras));
		ptrCameraMgr.Init();
		
		//Init GUIText system
		tmpGameObj = new GameObject();
		tmpGameObj.name = "GUITextMgr";
		tmpGameObj.AddComponent("GUITextMgr");
		ptrTextMgr = (GUITextMgr) tmpGameObj.GetComponent(typeof(GUITextMgr));
		ptrTextMgr.Init();
		
		//Init GUITexture system
		tmpGameObj = new GameObject();
		tmpGameObj.name = "GUITextureMgr";
		tmpGameObj.AddComponent("GUITextureMgr");
		ptrTextureMgr = (GUITextureMgr) tmpGameObj.GetComponent(typeof(GUITextureMgr));
		ptrTextureMgr.Init();
		
		//Init all quad managers and premade quad objects
		gameObject.BroadcastMessage("InitQuadMgr", null, SendMessageOptions.DontRequireReceiver);
	}
}
