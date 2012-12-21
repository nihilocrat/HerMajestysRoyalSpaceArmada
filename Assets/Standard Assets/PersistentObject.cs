using UnityEngine;

public class PersistentObject : MonoBehaviour {
	public void Awake() {
		DontDestroyOnLoad(gameObject);
	}
}