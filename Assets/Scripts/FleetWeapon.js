public var weaponName = "Frigate";

public var explosionPrefab : GameObject;

public var range = 10.0;
public var max_cooldown = 1.0;
public var volleySize = 1;
public var volleyDuration = 1.0;
public var arc = 90.0;

public var bulletPrefab : GameObject;
public var bulletSpeed = 100.0;
public var bulletDamage = 10;
public var bulletPenetration = 0;
public var bulletDefaultLife = 1.0;
private var cooldown = 0.0;
private var baseBulletDamage : int;

private var bulletObjects : GameObject[];

private var volleyRate = volleyDuration / volleySize;
private var volleyCooldown = 0.0;

function Start() {
	baseBulletDamage = bulletDamage;
	
	// generate bullets
	// note : bullet pool assumes you will not be able to fire another volley until the old one is deactivated
	bulletObjects = new GameObject[volleySize];
	for(var i=0; i < volleySize; i++)
	{
		var bullet = Instantiate(bulletPrefab, transform.position, Quaternion.identity);
		bullet.active = false;
		bulletObjects[i] = bullet;
	}
}

function FixedUpdate() {
	if(cooldown > 0) cooldown -= Time.fixedDeltaTime;
	if(cooldown < 0) cooldown = 0;
}

function PewPew(target : Transform) {
	if(cooldown > 0) return;
	
	FireBullet( Instantiate(bulletPrefab, transform.position, Quaternion.identity), target);
	/*for(var vNum = 0; vNum < volleySize; vNum++)
	{
		FireBullet(bulletObjects[vNum], target);
		yield WaitForSeconds(volleyRate);
	}*/
}
	
function FireBullet(bullet : GameObject, target : Transform) {
	cooldown = max_cooldown;
	
	//var rot = Quaternion.LookRotation(target.position - transform.position);
	//var bullet = Instantiate(bulletPrefab, transform.position, Quaternion.identity);
	bullet.active = true;
	bullet.transform.position = transform.position;
	
	var destination = target.position + Random.insideUnitSphere * 0.1;
	bullet.transform.LookAt(destination);
	
	var bulletLife = bulletDefaultLife;
	//var force_vec = bullet.transform.TransformDirection(Vector3.forward);
	var beam = bullet.GetComponent(LineRenderer);
	if(beam)
	{
		// beam laser
		beam.SetPosition(0, transform.position);
		beam.SetPosition(1, destination); 
	}
	else
	{
		var force_vec = (destination - transform.position).normalized;
		bullet.rigidbody.AddForce(force_vec * bulletSpeed);
		
		var dist2targ = Vector3.Distance(transform.position, destination);
		// FIXME : why is there a magic number here?
		bulletLife = dist2targ / (bulletSpeed*0.02);
	}
	
	var b = bullet.GetComponent(Bullet);
	if(b != null) {
		b.life = bulletLife;
		b.damage = bulletDamage;
		b.penetration = bulletPenetration;
		b.weapon = this.gameObject;
		b.target = target;
		b.boom = explosionPrefab;
	}
	else {
		// FIXME:  this shouldn't work this way.... too lazy
		// move this yield into the bullet object
		yield WaitForSeconds(bulletLife);
		if(explosionPrefab != null)
			Instantiate(explosionPrefab, bullet.transform.position, bullet.transform.rotation);
		bullet.transform.DetachChildren();
		Destroy(bullet);
		if(target != null){
			target.SendMessage("OnDamage", bulletDamage);
			
			if(transform.parent != null) {
				transform.SendMessageUpwards("OnXP", bulletDamage);
			}
			else {
				transform.BroadcastMessage("OnXP", bulletDamage);
			}
		}
	}
}

function GetBaseDamage() {
	return baseBulletDamage;
}

function SetDamagePercent(percent : float) {
	bulletDamage = Mathf.Ceil(parseFloat(baseBulletDamage) * percent);
}

function GetDPS() {
	return bulletDamage / max_cooldown;
}

function GetPPS() {
	return bulletPenetration / max_cooldown;
}
