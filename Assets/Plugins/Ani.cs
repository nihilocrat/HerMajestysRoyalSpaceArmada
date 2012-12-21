// AniMate animation helper class for Unity3D
// Version 1.0.1 - 16. April 2008
// Copyright (C) 2008  Adrian Stutz
// 
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// -------------------------------------------------------------------------------
//
// Leslie: Changed it from Boo to C#. Lots of changes to make code work in C#
// statically typed environment and to make it work on iPhone .Net limitations
// Disabled all physics related animations. Will look at it and fix when needed

using UnityEngine;
using System.Collections;
using System.Reflection;

public class Ani : MonoBehaviour
{

	public enum AniType
	{
		To, From, By
	}

	public enum Animate
	{
		OneShot = 0, Loop = 1
	}

	public delegate void DefaultCallback(System.Object val);

	// ---------------------------------------- //
	// CONFIGURATION PROPERTIES


	public float defaultDelay = 0;								// default delay
	//public bool defaultPhysics = false;							// default physics behaviour
	public DefaultCallback defaultCallback = null;				// default callback
	public AnimationEasingType defaultEasing = AnimationEasingType.LinearEasing; // default easing
	public EasingType defaultDirection = EasingType.In;			// default easing direction

	// ---------------------------------------- //
	// INTERNAL FIELDS

	ArrayList animations = new ArrayList();
	ArrayList fixedAnimations = new ArrayList();

	// ---------------------------------------- //
	// SINGLETON

	// Singleton instance
	private static Ani _mate;
	public static Ani Mate
	{
		get
		{
			// Create instance if none exists yet
			if (_mate == null)
			{
				GameObject go = new GameObject("AniMate");	// Create GameObject to attach to				
				_mate = (Ani)go.AddComponent("Ani");		// Attach Ani to GameObject
			}
			return _mate;
		}
	}

	// Save instance
	public void Awake()
	{
		Ani._mate = this;
	}

	// ---------------------------------------- //
	// CREATE NEW ANIMATION

	public WaitForSeconds To(UnityEngine.Object obj, float duration, Hashtable _properties)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = ExtractOptions(ref properties);
		CreateAnimations(obj, properties, duration, options, AniType.To);
		return new WaitForSeconds(duration);
	}

	public WaitForSeconds To(System.Object obj, float duration, Hashtable _properties, Hashtable _options)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = (Hashtable)_options.Clone();
		options = ExtractOptions(ref options);
		CreateAnimations(obj, properties, duration, options, AniType.To);
		return new WaitForSeconds(duration);
	}

	public WaitForSeconds From(System.Object obj, float duration, Hashtable _properties)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = ExtractOptions(ref properties);
		CreateAnimations(obj, properties, duration, options, AniType.From);
		return new WaitForSeconds(duration);
	}

	public WaitForSeconds From(System.Object obj, float duration, Hashtable _properties, Hashtable _options)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = (Hashtable)_options.Clone();
		options = ExtractOptions(ref options);
		CreateAnimations(obj, properties, duration, options, AniType.From);
		return new WaitForSeconds(duration);
	}

	public WaitForSeconds By(System.Object obj, float duration, Hashtable _properties)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = ExtractOptions(ref properties);
		CreateAnimations(obj, properties, duration, options, AniType.By);
		return new WaitForSeconds(duration);
	}

	public WaitForSeconds By(System.Object obj, float duration, Hashtable _properties, Hashtable _options)
	{
		Hashtable properties = (Hashtable)_properties.Clone();
		Hashtable options = (Hashtable)_options.Clone();
		options = ExtractOptions(ref options);
		CreateAnimations(obj, properties, duration, options, AniType.By);
		return new WaitForSeconds(duration);
	}

	// ---------------------------------------- //
	// MANAGE ANIMATIONS

	// Stop all animations of an object
	public void StopAll(System.Object obj)
	{
		Remove(obj, null, ref animations);		// Regular Animations
		Remove(obj, null, ref fixedAnimations);	// Fixed Animations
	}

	// Stop all animations of an object for a property
	public void Stop(System.Object obj, string name)
	{
		Remove(obj, name, ref animations);		// Regular Animations
		Remove(obj, name, ref fixedAnimations);	// Fixed Animations
	}

	// Remove animations
	private void Remove(System.Object obj, string name, ref ArrayList anims)
	{
		ArrayList remove = new ArrayList();
		foreach (System.Object[] anim in anims)
		{
			AniValue val = (anim[0] as AniValue);
			if ((name == null && val.Is(obj)) ||
				(name != null && val.Is(obj, name)))
			{
				remove.Add(anim);
			}
		}
		foreach (System.Object[] anim in remove)
		{
			animations.Remove(anim);
		}
	}

	// ---------------------------------------- //
	// MAIN ANIMATION LOOPS

	private void DoAnimation(ref ArrayList anims)
	{
		ArrayList finished = new ArrayList();

		foreach (System.Object[] anim in anims)
		{	// Loop through animations
			AniValue val = (anim[0] as AniValue);
			AniMator mat = (anim[1] as AniMator);
			DefaultCallback callback = (anim[2] as DefaultCallback);
			if (!mat.Running()) continue;
			//if (callback == null) val.Set(mat.GetValue());
			//else callback(mat.GetValue());
			val.Set(mat.GetValue());
			if (callback != null) callback(mat.GetValue());
			if (mat.Finished()) finished.Add(anim);
		}

		// Remove finished animations
		foreach (System.Object[] fin in finished)
		{
			anims.Remove(fin);
		}
	}

	// Regular animations
	public void Update()
	{
		DoAnimation(ref animations);
	}

	/*// Physics animations
	public void FixedUpdate()
	{
		DoAnimation(ref fixedAnimations);
	}*/

	// ---------------------------------------- //
	// INTERNAL METHODS

	// Exctract options for Hash and fill defaults where needed
	private Hashtable ExtractOptions(ref Hashtable options)
	{
		Hashtable exct = new Hashtable();
		// Delay
		if (options["delay"] == null)
		{
			exct["delay"] = defaultDelay;
		}
		else
		{
			exct["delay"] = (float)options["delay"];
			options.Remove("delay");
		}
		/*// Physics
		if (options["physics"] == null)
		{
			exct["physics"] = defaultPhysics;
		}
		else
		{
			exct["physics"] = (bool)options["physics"];
			options.Remove("physics");
		}*/
		// Callback
		if (options["callback"] == null)
		{
			exct["callback"] = defaultCallback;
		}
		else
		{
			exct["callback"] = (DefaultCallback)options["callback"];
			options.Remove("callback");
		}
		// Easing
		if (options["easing"] == null)
		{
			exct["easing"] = defaultEasing;
			exct["easing"] = 5;
		}
		else
		{
			exct["easing"] = (AnimationEasingType)options["easing"];
			options.Remove("easing");
		}
		// Easing Direction
		if (options["direction"] == null)
		{
			exct["direction"] = defaultDirection;
		}
		else
		{
			exct["direction"] = (EasingType)options["direction"];
			options.Remove("direction");
		}
		// Animation drive
		if (options["drive"] == null)
		{
			exct["drive"] = AnimationDriveType.RegularDrive;
		}
		else
		{
			exct["drive"] = (AnimationDriveType)options["drive"];
			options.Remove("drive");
		}
		// Animation drive
		if (options["rigidbody"] == null)
		{
			exct["rigidbody"] = null;
		}
		else
		{
			exct["rigidbody"] = (Rigidbody)options["rigidbody"];
			options.Remove("rigidbody");
		}

		return exct; // Return hash with all values
	}

	// Extract animation properties from Hash
	private void CreateAnimations(System.Object obj, Hashtable properties, float duration, Hashtable options, AniType type)
	{
		foreach (DictionaryEntry item in properties)
		{

			name = (string)item.Key;				// Extract name and value
			System.Object value = item.Value;
			AniValue aniv = new AniValue(obj, name);// Create value object
			System.Object current = aniv.Get();		// Get current value

			System.Object start = null;
			System.Object target = null;
			System.Object diff = null;

			// Setup variables
			if (type == AniType.To)
			{
				start = current;
				target = value;
			}
			else if (type == AniType.From)
			{
				start = value;
				target = current;
			}
			else if (type == AniType.By)
			{
				start = current;
				diff = value;
			}
			// Calculate difference for To and From
			if ((type == AniType.To || type == AniType.From) && DriveNeedsDiff((AnimationDriveType)options["drive"]))
			{
				try
				{
					//diff = target - start;
					//test = start + 0.1 * diff;

					System.Type startType = start.GetType();

					// --- Builtin types
					if (startType != target.GetType()) diff = (float)target - (float)start;
					else if (startType == typeof(short)) diff = (short)target - (short)start;
					else if (startType == typeof(int)) diff = (int)target - (int)start;
					else if (startType == typeof(long)) diff = (long)target - (long)start;
					else if (startType == typeof(float)) diff = (float)target - (float)start;
					else if (startType == typeof(double)) diff = (double)target - (double)start;
					else if (startType == typeof(decimal)) diff = (decimal)target - (decimal)start;

					// --- Unity types
					else if (startType == typeof(Vector2)) diff = (Vector2)target - (Vector2)start;
					else if (startType == typeof(Vector3)) diff = (Vector3)target - (Vector3)start;
					else if (startType == typeof(Vector4)) diff = (Vector4)target - (Vector4)start;
					else if (startType == typeof(Color)) diff = (Color)target - (Color)start;

					// --- Fallback
					else diff = (float)target - (float)start;
				}
				catch
				{
					throw new System.Exception("Cannot find diff between " + start.GetType() + " and " + target.GetType() + ": Operation +, - or * not supported.");
				}
			}

			// Create animation object
			AniMator mat = new AniMator(start, target, diff, duration, (float)options["delay"], (AnimationEasingType)options["easing"], (EasingType)options["direction"], (AnimationDriveType)options["drive"]);
			// Add to animations
			//if ((bool)options["physics"] == false && options["rigidbody"] == null)
			//{
				// Regular animation
				animations.Add(new System.Object[] { aniv, mat, options["callback"] });
			//}
			/*else
			{
				// Rigidbody animation
				DefaultCallback callback;
				//if (options["rigidbody"] != null && name == "position") {
				//	callback = (options["rigidbody"] as Rigidbody).MovePosition;
				//} else if (options["rigidbody"] != null && name == "rotation") {
				//	callback = (options["rigidbody"] as Rigidbody).MoveRotation;
				// Other callback 
				//} else {
				callback = (DefaultCallback)options["callback"];
				//}
				// Physics animation
				fixedAnimations.Add(new System.Object[] { aniv, mat, callback });
			}*/
			// From: Set to starting value
			if (type == AniType.From)
			{
				aniv.Set(start);
			}
		}
	}

	private bool DriveNeedsDiff(AnimationDriveType drive)
	{
		AnimationDrive d = new AnimationDrive(drive);
		return d.CalculateDiff();
	}

	// ---------------------------------------- //
	// ---------------------------------------- //

	// ---------------------------------------- //
	// WRAPPER FOR A SINGLE VALUE

	public class AniValue
	{
		// ---------------------------------------- //
		// CONFIGURATION

		static BindingFlags bFlags = BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static;

		// ---------------------------------------- //
		// PRIVATE FIELDS

		System.Object obj;			// Object a field or property is animated on
		string name;				// Name of the field or property

		System.Type objType;		// Type object
		FieldInfo fieldInfo;		// FieldInfo object
		PropertyInfo propertyInfo;	// PropertyInfo object

		// ---------------------------------------- //
		// CONSTRUCTOR

		public AniValue(System.Object o, string n)
		{
			obj = o;
			name = n;
			objType = obj.GetType();
			fieldInfo = objType.GetField(n, AniValue.bFlags);
			propertyInfo = objType.GetProperty(n, AniValue.bFlags);
			if (fieldInfo == null && propertyInfo == null)
			{
				throw new System.MissingMethodException("Property or field '" + n + "' not found on " + obj);
			}
		}

		// ---------------------------------------- //
		// UTILITY METHODS

		// Get type of field/property for debug purposes
		public System.Type ValueType()
		{
			if (propertyInfo != null) return propertyInfo.PropertyType;
			else return fieldInfo.FieldType;
		}

		// Check if AniValue is from given object
		public bool Is(System.Object checkObj)
		{
			return (obj == checkObj);
		}

		// Check if AniValue is from given object and value
		public bool Is(System.Object checkObject, string checkName)
		{
			return (Is(checkObject) && checkName == name);
		}

		// ---------------------------------------- //
		// GET AND SET VALUE

		// Get field or property
		public System.Object Get()
		{
			if (propertyInfo != null) return propertyInfo.GetValue(obj, null);
			else return fieldInfo.GetValue(obj);
		}

		// Set field or property
		public void Set(System.Object value)
		{
			if (propertyInfo != null) propertyInfo.SetValue(obj, value, null);
			else fieldInfo.SetValue(obj, value);
		}
	}

	// ---------------------------------------- //
	// ANIMATOR CLASS

	public class AniMator
	{

		System.Object startValue;	// Initial value
		System.Object endValue;		// End value
		System.Object change;		// Change over duration

		float startTime;			// Time of animation start
		float duration;				// Length of animation
		AnimationEasing easing;		// Easing class
		EasingType easingType;		// Easing type
		AnimationDrive drive;		// Animation drive

		// Fallback with dynamic typing
		public AniMator(System.Object sta, System.Object end, System.Object chg, float dur, float delay, AnimationEasingType eas, EasingType typ, AnimationDriveType d)
		{
			startValue = sta;
			endValue = end;
			change = chg;
			Setup(dur, delay, eas, typ, d);
		}

		// Create Animator
		private void Setup(float dur, float delay, AnimationEasingType eas, EasingType typ, AnimationDriveType d)
		{
			startTime = Time.time + delay;
			duration = dur;
			easingType = typ;
			easing = new AnimationEasing(eas);
			drive = new AnimationDrive(d);
		}

		// Get easing with correct type
		public float GetEasing(float time)
		{
			if (easingType == EasingType.In) return easing.In(time);
			else if (easingType == EasingType.Out) return easing.Out(time);
			else if (easingType == EasingType.InOut) return easing.InOut(time);
			return 0;
		}

		// Get current animation position (from 0 to 1)
		public float GetPosition()
		{
			return Mathf.Clamp01((Time.time - startTime) / duration);
		}

		// Check if animation is running
		public bool Running()
		{
			return startTime < Time.time;
		}

		// Check if aniamtion is finished
		public bool Finished()
		{
			return (startTime + duration) < Time.time;
		}

		// Get current animation value
		public System.Object GetValue()
		{
			float easPos = GetEasing(GetPosition());
			return drive.Animate(startValue, endValue, change, easPos * duration, duration);
		}
	}

	// ---------------------------------------- //
	// ANIMATION DRIVES

	public enum AnimationDriveType : int
	{
		RegularDrive = 0,
		SlerpDrive = 1
	}

	public class AnimationDrive
	{
		private AnimationDriveType type = AnimationDriveType.RegularDrive;

		public AnimationDrive(AnimationDriveType type)
		{
			this.type = type;
		}

		public System.Object Animate(System.Object start, System.Object end, System.Object diff, float time, float duration)
		{
			switch (type)
			{
				case AnimationDriveType.RegularDrive: return Animate_RegularDrive(start, end, diff, time, duration);
				case AnimationDriveType.SlerpDrive: return Animate_SlerpDrive(start, end, diff, time, duration);
			}
			return null;
		}

		public bool CalculateDiff()
		{
			switch (type)
			{
				case AnimationDriveType.RegularDrive: return true;
				case AnimationDriveType.SlerpDrive: return false;
			}
			return true;
		}

		public System.Object Animate_RegularDrive(System.Object start, System.Object end, System.Object diff, float time, float duration)
		{
			float easPos = time / duration;				// Positon
			System.Type startType = start.GetType();	// Cast to known types for performance

			// --- Builtin types
			if (startType != diff.GetType()) return (float)start + easPos * (float)diff;
			else if (startType == typeof(short)) return (short)start + easPos * (short)diff;
			else if (startType == typeof(int)) return (int)start + easPos * (int)diff;
			else if (startType == typeof(long)) return (long)start + easPos * (long)diff;
			else if (startType == typeof(float)) return (float)start + easPos * (float)diff;
			else if (startType == typeof(double)) return (double)start + easPos * (double)diff;
			else if (startType == typeof(decimal)) return (decimal)start + (decimal)easPos * (decimal)diff;

			// --- Unity types
			else if (startType == typeof(Vector2)) return (Vector2)start + easPos * (Vector2)diff;
			else if (startType == typeof(Vector3)) return (Vector3)start + easPos * (Vector3)diff;
			else if (startType == typeof(Vector4)) return (Vector4)start + easPos * (Vector4)diff;
			else if (startType == typeof(Color)) return (Color)start + easPos * (Color)diff;

			// --- Fallback
			return ((float)start + easPos * (float)diff);
		}

		public System.Object Animate_SlerpDrive(System.Object start, System.Object end, System.Object diff, float time, float duration)
		{
			return Quaternion.Slerp((Quaternion)start, (Quaternion)end, (time / duration));
		}
	}

	// ---------------------------------------- //
	// EASING FUNCTIONS

	public enum EasingType : int
	{
		In = 0,
		Out = 1,
		InOut = 2
	}

	public enum AnimationEasingType : int
	{
		LinearEasing = 0,
		QuadraticEasing = 1,
		CubicEasing = 2,
		QuarticEasing = 3,
		QuinticEasing = 4,
		SinusoidalEasing = 5,
		ExponentialEasing = 6,
		CircularEasing = 7,
		BounceEasing = 8,
		BackEasing = 9,
		ElasticEasing = 10
	}

	public class AnimationEasing
	{
		private AnimationEasingType type = AnimationEasingType.LinearEasing;

		public AnimationEasing(AnimationEasingType type)
		{
			this.type = type;
		}

		public float In(float time)
		{
			switch (type)
			{
				case AnimationEasingType.LinearEasing: return time;
				case AnimationEasingType.QuadraticEasing: return (time * time);
				case AnimationEasingType.CubicEasing: return (time * time * time);
				case AnimationEasingType.QuarticEasing: return Mathf.Pow(time, 4);
				case AnimationEasingType.QuinticEasing: return Mathf.Pow(time, 5);
				case AnimationEasingType.SinusoidalEasing: return Mathf.Sin((time - 1) * (Mathf.PI / 2)) + 1;
				case AnimationEasingType.ExponentialEasing: return Mathf.Pow(2, 10 * (time - 1));
				case AnimationEasingType.CircularEasing: return (-1 * Mathf.Sqrt(1 - time * time) + 1);
				case AnimationEasingType.BounceEasing: return (1 - Out(1-time));
				case AnimationEasingType.BackEasing: return EasingHelper.BackIn(time);
				case AnimationEasingType.ElasticEasing: return ElasticIn(time);
			}
			return time;
		}

		public float Out(float time)
		{
			switch (type)
			{
				case AnimationEasingType.LinearEasing: return time;
				case AnimationEasingType.QuadraticEasing: return (time * (time - 2) * -1);
				case AnimationEasingType.CubicEasing: return (Mathf.Pow(time - 1, 3) + 1);
				case AnimationEasingType.QuarticEasing: return (Mathf.Pow(time - 1, 4) - 1) * -1;
				case AnimationEasingType.QuinticEasing: return (Mathf.Pow(time - 1, 5) + 1);
				case AnimationEasingType.SinusoidalEasing: return Mathf.Sin(time * (Mathf.PI / 2));
				case AnimationEasingType.ExponentialEasing: return (-1 * Mathf.Pow(2, -10 * time) + 1);
				case AnimationEasingType.CircularEasing: return Mathf.Sqrt(1 - Mathf.Pow(time - 1, 2));
				case AnimationEasingType.BounceEasing: return EasingHelper.BounceOut(time);
				case AnimationEasingType.BackEasing: return EasingHelper.BackOut(time);
				case AnimationEasingType.ElasticEasing: return ElasticOut(time);
			}
			return time;
		}

		public float InOut(float time)
		{
			switch (type)
			{
				case AnimationEasingType.LinearEasing: return time;
				case AnimationEasingType.QuadraticEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.CubicEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.QuarticEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.QuinticEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.SinusoidalEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.ExponentialEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.CircularEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.BounceEasing: return EasingHelper.InOut(this, time);
				case AnimationEasingType.BackEasing: return EasingHelper.BackInOut(time);
				case AnimationEasingType.ElasticEasing: return EasingHelper.InOut(this, time);
			}
			return time;
		}

		private double p = 0.3;
		private double a = 1;
		public float ElasticIn(float time)
		{
			double s;
			if ((time == 1) || (time == 0))
			{
				return time;
			}
			if (a < 1)
			{
				s = p/4;
			}
			else
			{
				s = p/(2*Mathf.PI) * Mathf.Asin((float)(1/a));
            }
			time -= 1;
			return (float)(-(a*Mathf.Pow(2,10*time)) * Mathf.Sin((float)((time-s)*(2*Mathf.PI)/p)));
		}
		
		public float ElasticOut(float time)
		{
			double s;
			if ((time == 1) || (time == 0))
			{
				return time;
			}
			if (a < 1)
			{
				s = p/4;
			}
			else
			{
				s = p/(2*Mathf.PI) * Mathf.Asin((float)(1/a));
            }
            
			return (float)( a*Mathf.Pow(2,-10*time) * Mathf.Sin((float)((time-s)*(2*Mathf.PI)/p)) + 1 );
		}
	}

	public class EasingHelper
	{
		static public float InOut(AnimationEasing eas, float time)
		{
			if (time <= 0.5f) return eas.In(time * 2) / 2;
			else return (eas.Out((time - 0.5f) * 2) / 2) + 0.5f;
		}

		static public float BounceOut(float time)
		{
			if (time < (1/2.75))
			{
				return (float)(7.5625*time*time);
			}
			if (time < (2/2.75))
			{
				time -=  (float)(1.5/2.75);
				return (float)(7.5625*time*time + .75);
			}
			if (time < (2.5/2.75))
			{
				time -=  (float)(2.25/2.75);
				return (float)(7.5625*time*time + .9375) ;
			}
			else
			{
				time -= (float)(2.625/2.75);
				return (float)(7.5625*time*time + .984375) ;
			}
		}
		
		static public float BackOut(float time)
		{
			double s = 1.70158;
      
			time = time - 1;
			return (float)(time*time*((s+1)*time + s) + 1);
		}
		
		static public float BackIn(float time)
		{
			double s = 1.70158;
      
			return (float)(time*time*((s+1)*time - s));
		}
		
		static public float BackInOut(float time)
		{
			double s2 = 1.70158 * 1.525;
      
			time = time*2;
			if (time < 1)
			{
				return (float)(0.5*(time*time*((s2+1)*time - s2)));
			}
			else
			{
				time -= 2;
				return (float)(0.5*((time)*time*((s2+1)*time + s2) + 2));
			}
		}
	}
}
