using UnityEngine;
using System.Collections;

public class GUICameras : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/

	/*-----------------------------------Private Variables-----------------------------------*/
	private GUIManager ptrGUIMgr;
	
	/*----------------------------------------Methods----------------------------------------*/
	public void Init ()
	{
		Debug.Log("Init Cameras Manager");

		int Count = 0;
		Camera tmpCameraObj;
		GameObject tmpGameObj;
		string tmpCameraName = "";

		//Create all cameras
		for (Count=1;Count<=10;Count++)
		{
			tmpCameraName = "GUICameraL" + Count.ToString();
			tmpGameObj = new GameObject();
			tmpGameObj.name = tmpCameraName;
			tmpGameObj.AddComponent("Camera");
			tmpGameObj.AddComponent("GUILayer");
			tmpGameObj.transform.position = new Vector3(0,0,-500f);
			tmpGameObj.layer = (int) GUIManager.Layers.GUILayer1 + Count - 1;
			tmpGameObj.transform.parent = gameObject.transform;
			tmpCameraObj = (Camera) tmpGameObj.GetComponent(typeof(Camera));
			tmpCameraObj.clearFlags = CameraClearFlags.Depth;
			tmpCameraObj.backgroundColor = Color.black;
			tmpCameraObj.nearClipPlane = 0.3f;
			tmpCameraObj.farClipPlane = 1000f;
			tmpCameraObj.fieldOfView = Mathf.Atan((0.5f * ptrGUIMgr.ScreenHeight) / 500f) * 2f * Mathf.Rad2Deg;
			if (ptrGUIMgr.Cameras[(Count - 1)] == GUIManager.CameraMode.Standard)
			{
				tmpCameraObj.orthographic = true;
			}
			else
			{
				tmpCameraObj.orthographic = false;
			}
			tmpCameraObj.orthographicSize = ptrGUIMgr.ScreenHeight / 2f;
			tmpCameraObj.depth = 100f - (Count * 5f);
			tmpCameraObj.cullingMask = (1 << tmpGameObj.layer);
		}
	}
	
	/*-------------------------------------Unity Methods-------------------------------------*/
	void Awake ()
	{
		//Get pointer to GUI manager
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
	}
}
