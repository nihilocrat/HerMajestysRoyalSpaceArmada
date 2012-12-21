using UnityEngine;

class Destructible : MonoBehaviour
{
	public int max_hp = 100;
	
	private int hp;
	
	public void Awake() {
		hp = max_hp;
	}
	
	public void OnDamage(int amount) {
		// potential damage formula
		//var totaldamage = amount - Mathf.Max(0, armor - penetration);

		if(hp > 0) hp -= amount;
		if(hp <= 0){
			hp = 0;
			gameObject.BroadcastMessage("Kill");
		}
		else if(hp > max_hp) hp = max_hp;
	}


	public int GetHP() {
		return hp;
	}

}
