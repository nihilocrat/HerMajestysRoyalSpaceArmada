#define DEBUG

using UnityEngine;

#if UNITY_IPHONE
	#if DEBUG
		 //Iphone controls
		public class iTouch : MonoBehaviour 
		{
		}
	#else
		//Iphone with PC controls
		public enum iPhoneTouchPhase
		{
			Began = 1,
			Moved = 2,
			Stationary = 3,
			Ended = 4,
			Canceled = 5
		}
		
		public enum iPhoneOrientation
		{
			Unknown = 1,
			Portrait = 2,
			PortraitUpsideDown = 3,
			LandscapeLeft = 4,
			LandscapeRight = 5,
			FaceUp = 6,
			FaceDown = 7
		}

		public enum iPhoneScreenOrientation
		{
			Portrait = 1,
			PortraitUpsideDown = 2,
			LandscapeLeft = 3,
			LandscapeRight = 4,
			Landscape = 5
		}
		
		public struct iPhoneTouch
		{
			public int fingerId;
			public Vector2 position;
			public Vector2 positionDelta;
			public float timeDelta;
			public int tapCount;
			public iPhoneTouchPhase phase;
		}
		
		public class iPhoneSettings
		{
			static public iPhoneScreenOrientation screenOrientation = iPhoneScreenOrientation.LandscapeLeft;
			static public bool screenCanDarken = true;
			static public string uniqueIdentifier = "PC";
			static public string name = "PC";
			static public string model = "PC";
			static public string systemName = "PC";
			static public string systemVersion = "PC";
		}
		
		public class iPhoneInput
		{
			static public iPhoneTouch[] touches;
			static public int touchCount;
			static public bool multiTouchEnabled;
			static public iPhoneOrientation orientation;
			
			static public iPhoneTouch GetTouch (int index)	
			{
				return touches[0];
			}
		}
		
		public class iTouch : MonoBehaviour {
		
			//-----------------------------------Public Variables------------------------------------
			
			//-----------------------------------Private Variables-----------------------------------
			private Vector2 pSpeed;
			private Vector3 pLastPos;
		
			//----------------------------------------Methods----------------------------------------
			
			//-------------------------------------Unity Methods-------------------------------------
			void Awake ()
			{
				//Setup input
				iPhoneInput.touches = new iPhoneTouch[1];
				iPhoneInput.touches[0] = new iPhoneTouch();
				iPhoneInput.touches[0].fingerId = 0;
				iPhoneInput.touches[0].position = (Vector2) Input.mousePosition;
				iPhoneInput.touches[0].positionDelta = new Vector2(0,0);
				iPhoneInput.touches[0].timeDelta = Time.time;
				iPhoneInput.touches[0].tapCount = 0;
				iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
				iPhoneInput.touchCount = 0;
				iPhoneInput.multiTouchEnabled = false;
				iPhoneInput.orientation = iPhoneOrientation.LandscapeLeft;
			}
			
			void Update ()
			{
				Vector2 CurMousePos = (Vector2) Input.mousePosition;
				
				if ((iPhoneInput.touchCount == 0) && (iPhoneInput.touches[0].phase != iPhoneTouchPhase.Canceled))
				{
					//Reset to began state if there are no touches
					iPhoneInput.touches[0].timeDelta = Time.time;
					iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
					iPhoneInput.touchCount = 0;
				}
				else
				{
					//Handle touch states
					switch (iPhoneInput.touches[0].phase)
					{
						case iPhoneTouchPhase.Canceled: //Default state
							if (Input.GetMouseButtonDown(0) == true)
							{
								//Debug.Log("Set Began");
								iPhoneInput.touches[0].fingerId = 0;
								iPhoneInput.touches[0].position = CurMousePos;
								iPhoneInput.touches[0].positionDelta = new Vector2(0,0);
								iPhoneInput.touches[0].timeDelta = Time.time;
								iPhoneInput.touches[0].tapCount = 0;
								iPhoneInput.touches[0].phase = iPhoneTouchPhase.Began;
								iPhoneInput.touchCount = 1;
							}
							break;
							
						case iPhoneTouchPhase.Began:  //Mouse down
							//Debug.Log("Set Stationary");
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Stationary;
							break;
							
						case iPhoneTouchPhase.Stationary:
							//Check for motion
							if (iPhoneInput.touches[0].position != CurMousePos)
							{
								//Debug.Log("Set Moved");
								iPhoneInput.touches[0].positionDelta.x = CurMousePos.x - iPhoneInput.touches[0].position.x;
								iPhoneInput.touches[0].positionDelta.y = CurMousePos.y - iPhoneInput.touches[0].position.y;
								iPhoneInput.touches[0].position = CurMousePos;
								iPhoneInput.touches[0].timeDelta = Time.time;
								iPhoneInput.touches[0].phase  = iPhoneTouchPhase.Moved;
							}
							//Check for mouse up
							if (Input.GetMouseButtonUp(0) == true)
							{
								//Debug.Log("Set Ended");
								iPhoneInput.touches[0].timeDelta = Time.time;
								iPhoneInput.touches[0].phase = iPhoneTouchPhase.Ended;
							}
							break;
						
						case iPhoneTouchPhase.Moved:
							//Check for motion
							if (iPhoneInput.touches[0].position != CurMousePos)
							{
								iPhoneInput.touches[0].positionDelta.x = CurMousePos.x - iPhoneInput.touches[0].position.x;
								iPhoneInput.touches[0].positionDelta.y = CurMousePos.y - iPhoneInput.touches[0].position.y;
								iPhoneInput.touches[0].position = CurMousePos;
								iPhoneInput.touches[0].timeDelta = Time.time;
							}
							else
							{
								//Debug.Log("Stationary");
								iPhoneInput.touches[0].positionDelta = new Vector2(0, 0);
								iPhoneInput.touches[0].timeDelta = Time.time;
								iPhoneInput.touches[0].phase = iPhoneTouchPhase.Stationary;
							}
							//Check for mouse up
							if (Input.GetMouseButtonUp(0) == true)
							{
								//Debug.Log("Set Ended");
								iPhoneInput.touches[0].timeDelta = Time.time;
								iPhoneInput.touches[0].phase = iPhoneTouchPhase.Ended;
							}
							break;
							
						case iPhoneTouchPhase.Ended: //mouse up
							//Debug.Log("Set Cancelled");
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
							iPhoneInput.touchCount = 0;
							break;
					}
				}
			}
		}
	#endif

#else
	//PC controls
	public enum iPhoneTouchPhase
	{
		Began = 1,
		Moved = 2,
		Stationary = 3,
		Ended = 4,
		Canceled = 5
	}
	
	public enum iPhoneOrientation
	{
		Unknown = 1,
		Portrait = 2,
		PortraitUpsideDown = 3,
		LandscapeLeft = 4,
		LandscapeRight = 5,
		FaceUp = 6,
		FaceDown = 7
	}

	public enum iPhoneScreenOrientation
	{
		Portrait = 1,
		PortraitUpsideDown = 2,
		LandscapeLeft = 3,
		LandscapeRight = 4,
		Landscape = 5
	}
	
	public struct iPhoneTouch
	{
		public int fingerId;
		public Vector2 position;
		public Vector2 positionDelta;
		public float timeDelta;
		public int tapCount;
		public iPhoneTouchPhase phase;
	}
	
	public class iPhoneSettings
	{
		static public iPhoneScreenOrientation screenOrientation = iPhoneScreenOrientation.LandscapeLeft;
		static public bool screenCanDarken = true;
		static public string uniqueIdentifier = "PC";
		static public string name = "PC";
		static public string model = "PC";
		static public string systemName = "PC";
		static public string systemVersion = "PC";
	}
	
	public class iPhoneInput
	{
		static public iPhoneTouch[] touches;
		static public int touchCount;
		static public bool multiTouchEnabled;
		static public iPhoneOrientation orientation;
		
		static public iPhoneTouch GetTouch (int index)	
		{
			return touches[0];
		}
	}
	
	public class iTouch : MonoBehaviour {
	
		//-----------------------------------Public Variables------------------------------------
		
		//-----------------------------------Private Variables-----------------------------------
		private Vector2 pSpeed;
		private Vector3 pLastPos;
	
		//----------------------------------------Methods----------------------------------------
		
		//-------------------------------------Unity Methods-------------------------------------
		void Awake ()
		{
			//Setup input
			iPhoneInput.touches = new iPhoneTouch[1];
			iPhoneInput.touches[0] = new iPhoneTouch();
			iPhoneInput.touches[0].fingerId = 0;
			iPhoneInput.touches[0].position = (Vector2) Input.mousePosition;
			iPhoneInput.touches[0].positionDelta = new Vector2(0,0);
			iPhoneInput.touches[0].timeDelta = Time.time;
			iPhoneInput.touches[0].tapCount = 0;
			iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
			iPhoneInput.touchCount = 0;
			iPhoneInput.multiTouchEnabled = false;
			iPhoneInput.orientation = iPhoneOrientation.LandscapeLeft;
		}
		
		void Update ()
		{
			Vector2 CurMousePos = (Vector2) Input.mousePosition;
			
			if ((iPhoneInput.touchCount == 0) && (iPhoneInput.touches[0].phase != iPhoneTouchPhase.Canceled))
			{
				//Reset to began state if there are no touches
				iPhoneInput.touches[0].timeDelta = Time.time;
				iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
				iPhoneInput.touchCount = 0;
			}
			else
			{
				//Handle touch states
				switch (iPhoneInput.touches[0].phase)
				{
					case iPhoneTouchPhase.Canceled: //Default state
						if (Input.GetMouseButtonDown(0) == true)
						{
							//Debug.Log("Set Began");
							iPhoneInput.touches[0].fingerId = 0;
							iPhoneInput.touches[0].position = CurMousePos;
							iPhoneInput.touches[0].positionDelta = new Vector2(0,0);
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].tapCount = 0;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Began;
							iPhoneInput.touchCount = 1;
						}
						break;
						
					case iPhoneTouchPhase.Began:  //Mouse down
						//Debug.Log("Set Stationary");
						iPhoneInput.touches[0].timeDelta = Time.time;
						iPhoneInput.touches[0].phase = iPhoneTouchPhase.Stationary;
						break;
						
					case iPhoneTouchPhase.Stationary:
						//Check for motion
						if (iPhoneInput.touches[0].position != CurMousePos)
						{
							//Debug.Log("Set Moved");
							iPhoneInput.touches[0].positionDelta.x = CurMousePos.x - iPhoneInput.touches[0].position.x;
							iPhoneInput.touches[0].positionDelta.y = CurMousePos.y - iPhoneInput.touches[0].position.y;
							iPhoneInput.touches[0].position = CurMousePos;
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase  = iPhoneTouchPhase.Moved;
						}
						//Check for mouse up
						if (Input.GetMouseButtonUp(0) == true)
						{
							//Debug.Log("Set Ended");
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Ended;
						}
						break;
					
					case iPhoneTouchPhase.Moved:
						//Check for motion
						if (iPhoneInput.touches[0].position != CurMousePos)
						{
							iPhoneInput.touches[0].positionDelta.x = CurMousePos.x - iPhoneInput.touches[0].position.x;
							iPhoneInput.touches[0].positionDelta.y = CurMousePos.y - iPhoneInput.touches[0].position.y;
							iPhoneInput.touches[0].position = CurMousePos;
							iPhoneInput.touches[0].timeDelta = Time.time;
						}
						else
						{
							//Debug.Log("Stationary");
							iPhoneInput.touches[0].positionDelta = new Vector2(0, 0);
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Stationary;
						}
						//Check for mouse up
						if (Input.GetMouseButtonUp(0) == true)
						{
							//Debug.Log("Set Ended");
							iPhoneInput.touches[0].timeDelta = Time.time;
							iPhoneInput.touches[0].phase = iPhoneTouchPhase.Ended;
						}
						break;
						
					case iPhoneTouchPhase.Ended: //mouse up
						//Debug.Log("Set Cancelled");
						iPhoneInput.touches[0].timeDelta = Time.time;
						iPhoneInput.touches[0].phase = iPhoneTouchPhase.Canceled;
						iPhoneInput.touchCount = 0;
						break;
				}
			}
		}
	}

#endif
