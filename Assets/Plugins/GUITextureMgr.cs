using UnityEngine;
using System.Collections;

public class GUITextureMgr : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/
	
	/*-----------------------------------Private Variables-----------------------------------*/
	private GUIManager ptrGUIMgr;
	private int AllocBlockSize;
	private ArrayList pTextureBuffer = new ArrayList();

	/*----------------------------------------Methods----------------------------------------*/
	public void Init ()
	{
		Debug.Log("Init Texture Manager");
		GUITextureObj TmpTextureObj;
		GameObject tmpGameObj;
		
		//Set block size
		AllocBlockSize = ptrGUIMgr.AllocBlockSize;
		
		//Allocate initial guitexture buffer
		int Count = 0;
		for (Count=0;Count<AllocBlockSize;Count++)
		{
			//Create new guitexture object
			tmpGameObj = new GameObject();
			tmpGameObj.name = "GUITexture" + Count.ToString();
			tmpGameObj.AddComponent("GUITexture");
			tmpGameObj.AddComponent("Animator");
			tmpGameObj.AddComponent("GUITextureObj");
			tmpGameObj.transform.localScale = new Vector3(0,0,0);
			
			//Set a child of guitexturemgr
			tmpGameObj.transform.parent = gameObject.transform;
			
			//Add to buffer
			TmpTextureObj = (GUITextureObj) tmpGameObj.GetComponent(typeof(GUITextureObj));
			TmpTextureObj.GUIActive = false;
			pTextureBuffer.Add(TmpTextureObj);
		}
	}
	
	public void ResetGUI ()
	{
		/*Reset gui textures
		foreach(GUITextureObj TmpObj in pTextureBuffer)
		{
			TmpObj.Reset();
		}*/
	}
	
	public GUITextureObj GetGUITexture (int LayerNum)
	{
		int Count = 0;
		GUITextureObj TmpTextureObj;
		GameObject tmpGameObj;
		
		//Search guitexture buffer for available object
		for (Count=0;Count<pTextureBuffer.Count;Count++)
		{
			TmpTextureObj = (GUITextureObj) pTextureBuffer[Count];
			if (TmpTextureObj.GUIActive == false)
			{
				//Flag the object as used
				TmpTextureObj.GUIActive = true;
				//Set the objects layer
				TmpTextureObj.GameObj.layer = LayerNum;
				//Return object
				return TmpTextureObj;
			}
		}
		
		//No available object, so allocate more
		int BuffIdx = 0;
		int BuffSize = pTextureBuffer.Count;
		for (Count=0;Count<AllocBlockSize;Count++)
		{
			//Create new guitexture object
			tmpGameObj = new GameObject();
			BuffIdx = BuffSize + Count;
			tmpGameObj.name = "GUITexture" + BuffIdx.ToString();
			tmpGameObj.AddComponent("GUITexture");
			tmpGameObj.AddComponent("Animator");
			tmpGameObj.AddComponent("GUITextureObj");
			
			//Set a child of guitexturemgr
			tmpGameObj.transform.parent = gameObject.transform;
			
			//Add to buffer
			TmpTextureObj = (GUITextureObj) tmpGameObj.GetComponent(typeof(GUITextureObj));
			TmpTextureObj.GUIActive = false;
			pTextureBuffer.Add(TmpTextureObj);
		}
		
		//Search guitexture buffer for available object
		for (Count=0;Count<pTextureBuffer.Count;Count++)
		{
			TmpTextureObj = (GUITextureObj) pTextureBuffer[Count];
			if (TmpTextureObj.GUIActive == false)
			{
				//Flag the object as used
				TmpTextureObj.GUIActive = true;
				//Set the objects layer
				TmpTextureObj.GameObj.layer = LayerNum;
				//Return object
				return TmpTextureObj;
			}
		}

		return null;
	}

	/*-------------------------------------Unity Methods-------------------------------------*/
	void Awake ()
	{
		//Get pointer to GUI manager
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
	}
}
