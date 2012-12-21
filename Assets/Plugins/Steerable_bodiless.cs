using UnityEngine;

[AddComponentMenu("Physics/Steerable - bodiless")]

public class Steerable_bodiless : MonoBehaviour
{
    public float yaw = 25.0f;
    public float pitch = 25.0f;
    public float roll = 35.0f;

    private Vector3 cursor = new Vector3(0.5f,0.5f,0.0f);
    private Ray aim_ray = new Ray(Vector3.zero, Vector3.forward);
    private Vector3 aim_position = Vector3.zero;

    private Vector3 forward = Vector3.zero;


    public void Awake ()
    {
        forward = transform.TransformDirection(Vector3.forward);
    }


    public void Turn(Vector3 direction) {
        float xrot = pitch * direction.x * Time.fixedDeltaTime;
        float yrot = yaw * direction.y * Time.fixedDeltaTime;
        float zrot = roll * direction.z * Time.fixedDeltaTime;
        Quaternion xQuaternion = Quaternion.AngleAxis (xrot, Vector3.right); 
        Quaternion yQuaternion = Quaternion.AngleAxis (yrot, Vector3.up); 
        Quaternion zQuaternion = Quaternion.AngleAxis (zrot, Vector3.forward); 

        //var deltaRotation = Quaternion.Euler(xQuaternion);
        Quaternion totalRotation = xQuaternion * yQuaternion * zQuaternion;
        //var totalRotation = Vector3(direction.x * pitch, direction.y * yaw, direction.z * roll);
        //totalRotation *= Time.fixedDeltaTime;

        //rigidbody.MoveRotation(rigidbody.rotation * totalRotation);
        //Debug.Log("Rotation is: " + rigidbody.rotation);
        //transform.Rotate(transform.rotation * totalRotation);
        //rigidbody.rotation = transform.rotation;
    }


    public float clamp(float value, float min, float max) {
        if(value < min){ value = min; }
        else if(value > max){ value = max; }
        return value;
    }

    public void turnTo(Vector3 direction) {
        Quaternion destination_rot = Quaternion.LookRotation(direction);
        //var difference = destination_rot - transform.rotation;

        float str = Mathf.Min (yaw * Time.deltaTime, 1); 

        transform.rotation = Quaternion.Slerp(transform.rotation, destination_rot, str);
        //RotateTowards(transform.rotation, destination_rot, str, 1.0);
    }


	public void steerToDirection2D(Vector3 targetDir) {
        Vector3 right = transform.TransformDirection(Vector3.right);
        int turnDir = 1;
        if(Vector3.Dot(right, targetDir) > 0) turnDir = 1;
        else turnDir = -1;
	
		//float step = Mathf.Min(yaw * Time.fixedDeltaTime, 1.0f);
        float step = yaw * Time.fixedDeltaTime;
		//Debug.Log(step * turnDir);
		float angle_between = Vector3.Angle(forward, targetDir);
		if(angle_between < 0.001) {
			return;
		}
		else if(angle_between < step) {
			transform.Rotate(0.0f, angle_between * turnDir, 0.0f);
		}
		else {
			transform.Rotate(0.0f,step * turnDir,0.0f);
		}
		
				/*
    	Quaternion destination_rot = Quaternion.LookRotation(targetDir, Vector3.forward*-1);
        //var difference = destination_rot - transform.rotation;

		Vector3 destination_vec = Vector3.RotateTowards(forward, targetDir,
											(Mathf.Deg2Rad(yaw)) * Time.fixedDeltaTime, 1.0f);
		//Debug.Log("destination vec:"+destination_vec);
		transform.LookAt(transform.TransformPoint(destination_vec));
		*/
    	//float step = Mathf.Min(yaw * Time.deltaTime, 1.0f);
        //transform.rotation = Quaternion.Slerp(transform.rotation, destination_rot, step);
    	//transform.rotation.eulerAngles.y = Mathf.Lerp(transform.rotation.eulerAngles.z, destination_angle, str);
        //RotateTowards(transform.rotation, destination_rot, str, 1.0);
	}
	
    public void turnTo2D(Vector3 aim_point) {
        steerToDirection2D(aim_point - transform.position);
    }

	public void avoid2D(Vector3 aim_point) {
        steerToDirection2D(transform.position - aim_point);
	}

    public void FixedUpdate() {
        forward = transform.TransformDirection(Vector3.forward);
        //transform.position = rigidbody.position;
        //transform.localRotation = rigidbody.rotation;
    }

    public void SetCursor(Vector3 c) {
        c.x = clamp(c.x, -1.0f, 1.0f);
        c.y = clamp(c.y, -1.0f, 1.0f);

        cursor = c;
    }

    public Vector3 GetCursor() {
        return cursor;
    }

    public Vector3 GetAimPos() {
        return aim_position;
    }

    public void SetAimPos(Vector3 value) {
        aim_position = value;
    }

}
