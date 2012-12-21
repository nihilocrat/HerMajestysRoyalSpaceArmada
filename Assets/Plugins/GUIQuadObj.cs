using UnityEngine;
using System.Collections;

public class GUIQuadObj : MonoBehaviour {

	public enum ColliderType
	{
		Square = 0,
		Circle = 1,
		None = 2
	};
	
	public enum FrameMode
	{
		ForwardOneShot = 0,
		BackwardOneShot = 1,
		ForwardLoop = 2,
		BackwardLoop = 3,
		Bounce = 4
	};
	
	/*-----------------------------------Public Variables------------------------------------*/
	public Color mColor = Color.white;
	public int mWidth;
	public int mHeight;
	public Vector2 mLocation;
	public Vector3 mRotation;
	public Vector2 mScale = new Vector2(1f, 1f);
	public Vector2 mUV;
	public float mDepth = 1f;
	public Vector2 mAnimUV = new Vector2(0f, 0f);
	public int mAnimCols = 1;
	public int mAnimMaxFrames = 1;
	public ColliderType mCollider = ColliderType.None;
	public Vector2 mColliderSize;
	public bool mVisible = true;
	public bool mEnabled = true;

	/*-----------------------------------Private Variables-----------------------------------*/
	private class AnimationObj
	{
		public string Cmd = "";
		public float Duration;
		public GameObject CallbackObj;
		public string CallbackMsg;
		public object CallbackParams;
		public Hashtable Properties = new Hashtable();
	}
	
	private GUIQuadMgr pGUIQuadMgr;
	private GUIManager ptrGUIMgr;
	private GUISprite mpGUISprite;
	private int mStartFrame;
	private int mEndFrame;
	private int mCurFrame;
	private int mFrameDir;
	private float mFPS = 0f;
	private FrameMode mFrameMode = FrameMode.ForwardOneShot;
	private ArrayList mAnimate = new ArrayList();
	private bool mAnimating = false;
	private GameObject mCallbackObj;
	private string mCallbackMsg = "";
	private object mCallbackParams;
	private Ani.Animate mAnimateMode = Ani.Animate.OneShot;
	
	/*----------------------------------------Methods----------------------------------------*/
	//Get pointer to gui manager
	public GUIQuadMgr QuadManager
	{
		get { return pGUIQuadMgr; }
	}

	//Get GUI manager version of sprite
	public GUISprite QuadSprite
	{
		get { return mpGUISprite; }
	}
	
	//Color
	public Color Tint
	{
		get { return mColor; }
		set {
			mColor = value;
			mpGUISprite.color = value;
		}
	}
	
	//Width
	public int Width
	{
		get { return mWidth; }
		set {
			//Resize vertices
			mWidth = value;
			mpGUISprite.Resize(mWidth, mHeight);
		}
	}
	
	//Height
	public int Height
	{
		get { return mHeight; }
		set {
			//Resize vertices
			mHeight = value;
			mpGUISprite.Resize(mWidth, mHeight);
		}
	}
	
	//Set/Get screen location
	public Vector2 Location
	{
		get { return mLocation; }
		set
		{
			//Set new location
			mLocation = value;
			//Normalize location
			NormalizeToScreen();
			
			if (mVisible == true)
			{
				//Update sprite manager of change if visible
				mpGUISprite.Transform();
			}
		}
	}
	
	//Set/Get rotation
	public Vector3 Rotation
	{
		get { return mRotation; }
		set
		{
			//Set new rotation
			mRotation = value;
			transform.localEulerAngles = value;
			
			if (mVisible == true)
			{
				//Update sprite manager of change if visible
				mpGUISprite.Transform();
			}
		}
	}
	
	//Set/Get scale
	public Vector2 Scale
	{
		get { return mScale; }
		set
		{
			//Set new scale
			mScale = value;
			transform.localScale = new Vector3(mScale.x, mScale.y, 1f);
			
			if (mVisible == true)
			{
				//Update sprite manager of change if visible
				mpGUISprite.Transform();
			}
		}
	}
	
	//UV coords
	public Vector2 UV
	{
		get { return mUV; }
		set
		{
			if (mVisible == true)
			{
				mUV = value;
				mpGUISprite.lowerLeftUV = value;
			}
		}
	}
	
	//Depth
	public float Depth
	{
		get { return mDepth; }
		set
		{
			mDepth = value;
			mpGUISprite.depth = value;
		}
	}
	
	//Animation grid start location
	public Vector2 AnimUV
	{
		get { return mAnimUV; }
		set
		{
			mAnimUV = value;
		}
	}
	
	//Number of columns in grid
	public int AnimCols
	{
		get { return mAnimCols; }
		set
		{
			if (mAnimCols > 0)
			{
				//Animation column cannot be zero
				mAnimCols = value;
			}
			else
			{
				mAnimCols = 1;
			}
		}
	}
	
	//Number of total animation frames
	public int AnimMaxFrames
	{
		get { return mAnimMaxFrames; }
		set
		{
			if (mAnimMaxFrames > 0)
			{
				//Max number of frames cannot be zero
				mAnimMaxFrames = value;
			}
			else
			{
				mAnimMaxFrames = 1;
			}
		}
	}
	
	//Set/Get visible flag
	public bool Visible
	{
		get { return mVisible; }
		set
		{
			mVisible = value;
			if (mVisible == true)
			{
				mpGUISprite.hidden = false;
				//Update sprite manager since we may have changed while not visible
				mpGUISprite.Transform();
				//Enable the collider for touch input
				UpdateCollider();
			}
			else
			{
				mpGUISprite.hidden = true;
				//Disable the collider
				DisableCollider();
			}
		}
	}
	
	//Set/Get enabled flag
	public bool Enabled
	{
		get { return mEnabled; }
		set
		{
			mEnabled = value;
			if (mEnabled == true)
			{
				//Enable collider
				UpdateCollider();
			}
			else
			{
				//Disable collider
				DisableCollider();
			}
		}
	}

	//Initialize Quad object
	public void InitQuad (GUIQuadMgr pManager)
	{
		//Set refernce to parent quad manager
		pGUIQuadMgr = pManager;
		
		//Get pointer to GUI manager
		ptrGUIMgr = (GUIManager) GameObject.Find("GUI").GetComponent(typeof(GUIManager));
		
		//Copy position variables to transform
		NormalizeToScreen();
		//Copy rotation variables to transform
		transform.localEulerAngles = mRotation;
		//Copy scale variables to transform
		transform.localScale = new Vector3(mScale.x, mScale.y, 1f);
		
		//Set layer
		gameObject.layer = pGUIQuadMgr.gameObject.layer;
		
		//Add sprite to manager if enabled
		mpGUISprite = pGUIQuadMgr.AddSprite(gameObject, mWidth, mHeight, mDepth, mUV);

		//Set color
		this.Tint = mColor;
		
		//Use default collider size if none is set.  We don't want zero sized colliders.
		if (mColliderSize.x == 0)
		{
			//User width as default size
			mColliderSize.x = mWidth;
		}
		if (mColliderSize.y == 0)
		{
			//User height as default size
			mColliderSize.y = mHeight;
		}
		//Create hit area if needed
		switch (mCollider)
		{
			case ColliderType.Square:
				gameObject.AddComponent("BoxCollider");
				break;
			case ColliderType.Circle:
				gameObject.AddComponent("SphereCollider");
				break;
			case ColliderType.None:
				break;
		}

		//Set hidden
		this.Visible = mVisible;
	}
	
	//Start frame animation
	public int StartFPS (int StartVal, int EndVal, float Speed, FrameMode AnimMode)
	{
		//Check input values
		if (StartVal < 1)
		{
			//Start frame is less than 1
			return -1;
		}
		if (EndVal > mAnimMaxFrames)
		{
			//End frame is greater then max frames
			return -1;
		}
		if ((Speed < 0f) || (Speed > mAnimMaxFrames))
		{
			//FPS is negative or more than max frames
			return -1;
		}
		//Check value ranges
		if (StartVal == EndVal)
		{
			//Start and End frames are the same.  No animation needed
			return -1;
		}
		switch (AnimMode)
		{
			case FrameMode.ForwardOneShot:
				if (mStartFrame > mEndFrame)
				{
					//Forward animation.  Start cannot be greater than end frame
					return -1;
				}
				mFrameDir = 1;
				break;
			case FrameMode.ForwardLoop:
				if (mStartFrame > mEndFrame)
				{
					//Forward animation.  Start cannot be greater than end frame
					return -1;
				}
				mFrameDir = 1;
				break;
			case FrameMode.BackwardOneShot:
				if (mStartFrame < mEndFrame)
				{
					//Backware animation.  Start cannot be less than end frame
					return -1;
				}
				mFrameDir = -1;
				break;
			case FrameMode.BackwardLoop:
				if (mStartFrame < mEndFrame)
				{
					//Backware animation.  Start cannot be less than end frame
					return -1;
				}
				mFrameDir = -1;
				break;
			case FrameMode.Bounce:
				if (mStartFrame > mEndFrame)
				{
					//Forward animation.  Start cannot be greater than end frame
					return -1;
				}
				mFrameDir = 1;
				break;
		}

		//Setup variables
		mStartFrame = StartVal;
		mEndFrame = EndVal;
		mCurFrame = StartVal;
		mFPS = Speed;
		mFrameMode = AnimMode;
		//Show the first frame
		ShowFrame(mCurFrame);
		//Cancel and current animation
		CancelInvoke("FrameHandler");
		//Initiate animation
		InvokeRepeating("FrameHandler", (1f/mFPS), (1f/mFPS));
		return 0;
	}
	
	//Stop frame animation
	public void StopFPS ()
	{
		//Reset variables
		mFPS = 0;
		//Cancel and current animation
		CancelInvoke("FrameHandler");
	}
	
	//Frame animation handler
	public void FrameHandler ()
	{
		//Move frame
		mCurFrame = mCurFrame + mFrameDir;

		switch (mFrameMode)
		{
			case FrameMode.ForwardOneShot:
				if (mCurFrame > mEndFrame)
				{
					StopFPS();
				}
				else
				{
					ShowFrame(mCurFrame);
				}
				break;
				
			case FrameMode.ForwardLoop:
				if (mCurFrame > mEndFrame)
				{
					mCurFrame = mStartFrame;
				}
				ShowFrame(mCurFrame);
				break;
				
			case FrameMode.BackwardOneShot:
				if (mCurFrame < mEndFrame)
				{
					StopFPS();
				}
				else
				{
					ShowFrame(mCurFrame);
				}
				break;
				
			case FrameMode.BackwardLoop:
				if (mCurFrame < mEndFrame)
				{
					mCurFrame = mStartFrame;
				}
				ShowFrame(mCurFrame);
				break;
			case FrameMode.Bounce:
				if (mFrameDir > 0)
				{
					if (mCurFrame > mEndFrame)
					{
						mCurFrame = mCurFrame - 2;
						mFrameDir = -1;
					}
				}
				else
				{
					if (mCurFrame < mStartFrame)
					{
						mCurFrame = mCurFrame + 2;
						mFrameDir = 1;
					}
				}
				ShowFrame(mCurFrame);
				break;
		}
	}
	
	//Animate To
	public void AnimateTo (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
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
	public void AnimateFrom (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
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
	public void AnimateBy (float Duration, GameObject CallbackObj, object CallbackMsg, object CallbackParams, params object[] args)
	{
		int Count = 0;
		object tmpProperty, tmpValue;
		AnimationObj tmpObj = new AnimationObj();
		
		//Setup new animation object
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
	public bool StartAnimation (Ani.Animate ModeType, GameObject CallbackObj, object CallbackMsg, object CallbackParams)
	{
		//Start animation is we're not already animating
		if (mAnimating == false)
		{
			mAnimating = true;
			mCallbackObj = CallbackObj;
			mCallbackMsg = (string) CallbackMsg;
			mCallbackParams = CallbackParams;
			mAnimateMode = ModeType;
			StartCoroutine(Animator());
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
		mAnimate.Clear();
	}
	
	//Manually update the transform
	public void UpdateTransform ()
	{
		mpGUISprite.Transform();
	}
	
	//Normalize anchor to lower left and screen 0,0 to lower left
	private void NormalizeToScreen ()
	{
		Vector2 ScreenOffset = new Vector2((ptrGUIMgr.ScreenWidth/2), (ptrGUIMgr.ScreenHeight/2));
		Vector3 tmpPosition = new Vector3(mLocation.x, mLocation.y, mDepth);
		tmpPosition.x = tmpPosition.x - ScreenOffset.x;
		tmpPosition.y = ScreenOffset.y - tmpPosition.y;
		gameObject.transform.localPosition = tmpPosition;
	}
	
	//Remake the collider if the size has changed
	private void UpdateCollider ()
	{
		switch (mCollider)
		{
			case ColliderType.Square:
				BoxCollider tmpSquare = (BoxCollider) gameObject.GetComponent(typeof(BoxCollider));
				tmpSquare.size = new Vector3(mColliderSize.x, mColliderSize.y, 0);
				break;
			case ColliderType.Circle:
				SphereCollider tmpCircle = (SphereCollider) gameObject.GetComponent(typeof(SphereCollider));
				if (mColliderSize.x > mColliderSize.y)
				{
					tmpCircle.radius = (float) mColliderSize.x / 2.0f;
				}
				else
				{
					tmpCircle.radius = (float) mColliderSize.y / 2.0f;
				}
				break;
			case ColliderType.None:
				break;
		}
	}
	
	//Disable collider to avoid input events
	private void DisableCollider ()
	{
		switch (mCollider)
		{
			case ColliderType.Square:
				BoxCollider tmpSquare = (BoxCollider) gameObject.GetComponent(typeof(BoxCollider));
				tmpSquare.size = new Vector3(0, 0, 0);
				break;
			case ColliderType.Circle:
				SphereCollider tmpCircle = (SphereCollider) gameObject.GetComponent(typeof(SphereCollider));
				tmpCircle.radius = 0;
				break;
		}
	}
	
	//Show animation frame
	private void ShowFrame (int FrameNum)
	{
		//Cap ranges
		if (FrameNum < 1)
		{
			FrameNum = 1;
		}
		if (FrameNum > mAnimMaxFrames)
		{
			FrameNum = mAnimMaxFrames;
		}
		//Get zero based frame number
		FrameNum--;
		//Get row/col position
		int row = FrameNum / mAnimCols;
		int col = FrameNum % mAnimCols;
		//Move UVs
		this.UV = new Vector2((col * (mWidth + 1)), (row * mHeight)) + mAnimUV;
	}
	
	//Coroutine animator
	IEnumerator Animator ()
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
						yield return Ani.Mate.To(this, item.Duration, item.Properties);
						break;
					case "From":
						yield return Ani.Mate.From(this, item.Duration, item.Properties);
						break;
					case "By":
						yield return Ani.Mate.By(this, item.Duration, item.Properties);
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

	/*-------------------------------------Unity Methods-------------------------------------*/
}
