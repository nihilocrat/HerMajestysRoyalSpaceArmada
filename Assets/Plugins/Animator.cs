using UnityEngine;
using System.Collections;

public class Animator : MonoBehaviour {

	/*-----------------------------------Public Variables------------------------------------*/

	/*-----------------------------------Private Variables-----------------------------------*/
	private class AnimationObj
	{
		public string Cmd = "";
		public UnityEngine.Object Obj;
		public float Duration;
		public GameObject CallbackObj;
		public string CallbackMsg;
		public object CallbackParams;
		public Hashtable Properties = new Hashtable();
	}
	
	private ArrayList mAnimate = new ArrayList();
	private bool mAnimating = false;
	private GameObject mCallbackObj;
	private string mCallbackMsg = "";
	private object mCallbackParams;
	private Ani.Animate mAnimateMode = Ani.Animate.OneShot;
	
	/*----------------------------------------Methods----------------------------------------*/
	//Animate To
	public void AnimateTo (UnityEngine.Object obj, float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
		tmpObj.Obj = obj;
		tmpObj.Cmd = "To";
		tmpObj.Duration = Duration;
		tmpObj.CallbackObj = CallbackObj;
		tmpObj.CallbackMsg = (string) CallbackMsg;
		tmpObj.CallbackParams = CallbackParams;
		for (Count=0;Count<args.Length;Count=Count+2)
		{
			//Make sure we don't go pass the end of the array
			if ((Count+2) <= args.Length)
			{
				tmpProperty = args[Count];
				tmpValue = args[Count+1];
				tmpObj.Properties.Add(tmpProperty, tmpValue);
			}
		}
		
		//Add object to array
		mAnimate.Add(tmpObj);
	}
	
	//Animate From
	public void AnimateFrom (UnityEngine.Object obj, float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
		tmpObj.Obj = obj;
		tmpObj.Cmd = "From";
		tmpObj.Duration = Duration;
		tmpObj.CallbackObj = CallbackObj;
		tmpObj.CallbackMsg = (string) CallbackMsg;
		tmpObj.CallbackParams = CallbackParams;
		for (Count=0;Count<args.Length;Count=Count+2)
		{
			//Make sure we don't go pass the end of the array
			if ((Count+2) <= args.Length)
			{
				tmpProperty = args[Count];
				tmpValue = args[Count+1];
				tmpObj.Properties.Add(tmpProperty, tmpValue);
			}
		}
		
		//Add object to array
		mAnimate.Add(tmpObj);
	}
	
	//Animate By
	public void AnimateBy (UnityEngine.Object obj, float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
		tmpObj.Obj = obj;
		tmpObj.Cmd = "By";
		tmpObj.Duration = Duration;
		tmpObj.CallbackObj = CallbackObj;
		tmpObj.CallbackMsg = (string) CallbackMsg;
		tmpObj.CallbackParams = CallbackParams;
		for (Count=0;Count<args.Length;Count=Count+2)
		{
			//Make sure we don't go pass the end of the array
			if ((Count+2) <= args.Length)
			{
				tmpProperty = args[Count];
				tmpValue = args[Count+1];
				tmpObj.Properties.Add(tmpProperty, tmpValue);
			}
		}
		
		//Add object to array
		mAnimate.Add(tmpObj);
	}
	
	//Start animation sequence
	public bool StartAnimation (Ani.Animate Mode, GameObject CallbackObj, object CallbackMsg, object CallbackParams)
	{
		//Start animation is we're not already animating
		if (mAnimating == false)
		{
			//Must be active to start coroutine
			gameObject.active = true;

			mAnimating = true;
			mCallbackObj = CallbackObj;
			mCallbackMsg = (string) CallbackMsg;
			mCallbackParams = CallbackParams;
			mAnimateMode = Mode;
			StartCoroutine(AnimateEngine());
			return true;
		}
		
		return false;
	}
	
	//Stop animation sequence
	public void StopAnimation ()
	{
		mAnimating = false;
	}
	
	//Clear animation queue
	public void ClearAnimation ()
	{
		//Stop the animation before clearing
		mAnimate.Clear();
	}
	
	//Coroutine animator
	IEnumerator AnimateEngine ()
	{
		int Index = 0;
		
		while ((mAnimate.Count > 0) && (mAnimating == true))
		{
			if (Index < mAnimate.Count)
			{
				AnimationObj item = (AnimationObj) mAnimate[Index];
				
				//Send animation command to AniMate
				switch (item.Cmd)
				{
					case "To":
						yield return Ani.Mate.To(item.Obj, item.Duration, item.Properties);
						break;
					case "From":
						yield return Ani.Mate.From(item.Obj, item.Duration, item.Properties);
						break;
					case "By":
						yield return Ani.Mate.By(item.Obj, item.Duration, item.Properties);
						break;
				}
				
				//Send message to callback object
				if (item.CallbackObj != null)
				{
					item.CallbackObj.SendMessage(item.CallbackMsg, item.CallbackParams, SendMessageOptions.DontRequireReceiver);
				}
				
				//Remove animation object if needed
				if (mAnimateMode == Ani.Animate.OneShot)
				{
					//Check to see if list was emptied before attempting to remove item
					if (mAnimate.Count > 0)
					{
						mAnimate.RemoveAt(Index);
					}
				}
				else
				{
					//Loop mode.  Just point to the next anim object
					Index++;
					if (Index >= mAnimate.Count)
					{
						Index = 0;
					}
				}
			}
		}
		
		//Done animating
		mAnimating = false;

		//Send message to callback from Start Animation
		if ((mCallbackObj != null) && (mCallbackMsg != null))
		{
			mCallbackObj.SendMessage(mCallbackMsg, mCallbackParams, SendMessageOptions.DontRequireReceiver);
		}
	}
}
