using UnityEngine;
using System.Collections.Generic;
using LitJson;

public class Cargo : MonoBehaviour
{
	public float size = 10.0f;

	private float current_size = 0.0f;
	private GameObject parent;

	private Dictionary<string, float> slots = new Dictionary<string, float>();

	public bool holdsSlots = false;

	public bool Add (string obj, float amount) {
		if(current_size + amount > size) return false;
		
		if(!this.slots.ContainsKey(obj)) {
			this.slots[obj] = amount;
		}
		else {
			this.slots[obj] += amount;
		}
		current_size += amount;
		return true;
	}

	/// see if the cargo has enough of this resource
	public bool Has(string obj, float amount) {
		if (!this.slots.ContainsKey(obj)) return false;
		else if (this.slots[obj] >= amount) return true;
		else return false;
	}

	public bool Remove(string obj, float amount) {
		if(!this.Has(obj, amount)){
			return false;
		}
		
		this.slots[obj] -= amount;
		
		current_size -= amount;
		return true;
	}

	public Dictionary<string, float> GetCargo() {
		return slots;
	}

}