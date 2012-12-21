using UnityEngine;
using System.Collections;

public class GUITextMgr : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/
	
	/*-----------------------------------Private Variables-----------------------------------*/
	private GUIManager ptrGUIMgr;
	private int AllocBlockSize;
	private ArrayList pTextBuffer = new ArrayList();

	/*----------------------------------------Methods----------------------------------------*/
	public void Init ()
	{
		Debug.Log("Init Text Manager");
		GUITextObj TmpTextObj;
		GameObject tmpGameObj;

		//Set block size
		AllocBlockSize = ptrGUIMgr.AllocBlockSize;
		
		//Allocate initial guitext buffer
		int Count = 0;
		for (Count=0;Count<AllocBlockSize;Count++)
		{
			//Create new guitext object
			tmpGameObj = new GameObject();
			tmpGameObj.name = "GUIText" + Count.ToString();
			tmpGameObj.AddComponent("GUIText");
			tmpGameObj.AddComponent("Animator");
			tmpGameObj.AddComponent("GUITextObj");
			
			//Set a child of guitextmgr
			tmpGameObj.transform.parent = gameObject.transform;
			
			//Add to buffer
			TmpTextObj = (GUITextObj) tmpGameObj.GetComponent(typeof(GUITextObj));
			TmpTextObj.GUIActive = false;
			pTextBuffer.Add(TmpTextObj);
		}
	}
	
	public void ResetGUI ()
	{/*
		//Reset gui texts
		foreach(GUITextObj TmpObj in pTextBuffer)
		{
			TmpObj.Reset();
		}*/
	}
	
	public GUITextObj GetGUIText (int LayerNum)
	{
		int Count = 0;
		GUITextObj TmpTextObj;
		GameObject tmpGameObj;
		
		//Search guitext buffer for available object
		for (Count=0;Count<pTextBuffer.Count;Count++)
		{
			TmpTextObj = (GUITextObj) pTextBuffer[Count];
			if (TmpTextObj.GUIActive == false)
			{
				//Flag the object as used
				TmpTextObj.GUIActive = true;
				//Set the objects layer
				TmpTextObj.GameObj.layer = LayerNum;
				//Return object
				return TmpTextObj;
			}
		}
		
		//No available object, so allocate more
		int BuffIdx = 0;
		int BuffSize = pTextBuffer.Count;
		for (Count=0;Count<AllocBlockSize;Count++)
		{
			//Create new guitext object
			tmpGameObj = new GameObject();
			BuffIdx = BuffSize + Count;
			tmpGameObj.name = "GUIText" + BuffIdx.ToString();
			tmpGameObj.AddComponent("GUIText");
			tmpGameObj.AddComponent("Animator");
			tmpGameObj.AddComponent("GUITextObj");
			
			//Set a child of guitextmgr
			tmpGameObj.transform.parent = gameObject.transform;
			
			//Add to buffer
			TmpTextObj = (GUITextObj) tmpGameObj.GetComponent(typeof(GUITextObj));
			TmpTextObj.GUIActive = false;
			pTextBuffer.Add(TmpTextObj);
		}
		
		//Search guitext buffer for available object
		for (Count=0;Count<pTextBuffer.Count;Count++)
		{
			TmpTextObj = (GUITextObj) pTextBuffer[Count];
			if (TmpTextObj.GUIActive == false)
			{
				//Flag the object as used
				TmpTextObj.GUIActive = true;
				//Set the objects layer
				TmpTextObj.GameObj.layer = LayerNum;
				//Return object
				return TmpTextObj;
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
