public var life = 100.0;
public var damage = 1;
public var penetration = 0;
public var squadron : GameObject;
public var weapon : GameObject;
public var target : Transform;
public var boom : GameObject;

function Start() {
	yield WaitForSeconds(life);
	
	if(target != null){
		// hit angle needed for directional damage modifications
		var angle = Vector3.Angle(target.transform.forward, -transform.forward);
		var hitData = new Array(damage, penetration, angle);
	
		target.SendMessage("OnDamage", hitData);
	
		// FIXME: we should store a ref to the squadron
		//  to tell the squad it gets XP,
		//  in case the shooter of this bullet dies
		if(weapon.transform.parent != null) {
			weapon.SendMessageUpwards("OnXP", damage);
		}
		else {
			weapon.BroadcastMessage("OnXP", damage);
		}
	}
	
	if(boom != null)
		Instantiate(boom, transform.position, transform.rotation);
	transform.DetachChildren();
	Destroy(gameObject);
	//gameObject.active = false;
}
	
