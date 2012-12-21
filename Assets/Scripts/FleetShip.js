public var shipName = "Frigate";
public var shipClass = "Frigate";
public var shipSubClass = "Light";
public var icon : Texture2D;
public var description : String;
public var cost = 1;
public var techLevel = 1;
public var weaponMounts = 1;
public var weaponPrefab : GameObject;

public var squadron : Squadron;

public var yaw = 20.0;
public var impulse = 100.0;
public var minimum_distance = 5.0;

public var max_hp = 100;
public var armor = 0;
public var explosionPrefab : GameObject;
public var isFoldship = false;

private var sideThrusterPower = 0.25; // percentage of total impulse

private var attackTarget : Transform;
private var moveTarget : Vector3;
private var alignTarget : Vector3;

private var boid : Steerable;
private var weapon : FleetWeapon;

private var hp : int;
public var alive = true;

private var suspendOrders = false;
private var selected = false;

function Awake() {
	hp = max_hp;
	
	boid = GetComponent(Steerable);
	
	// set up other components based on configuration
	boid.yaw = yaw;
	boid.SetImpulse(impulse);
	
	if(weapon == null && weaponPrefab != null)
	{
		weapon = AttachWeapon(weaponPrefab);
	}
	else
	{
		weapon = GetMainWeapon();
	}
}

function Start()
{
}

function Revive() {
	// figure out where I should be sitting in the formation
	var offset = squadron.GetMemberOffset(this);
	var flagship = squadron.flagship.transform;
	//m.Revive(flagship.transform.position + offset, flagship.transform.rotation,);
	
	var startTarget = squadron.GetMoveTarget();
	if(startTarget != Vector3.zero) {
		startingMove = moveTarget + offset;
	}
	// inherit the move order (if any) from my squad

	transform.position = flagship.position + offset;
	transform.rotation = flagship.rotation;
	moveTarget = startTarget;
	attackTarget = null;
	hp = 1;
	alive = true;
	gameObject.active = true; //renderer.enabled = false;
}


function AttachWeapon(newWeapon : GameObject)
{
	for(var mount = 1; mount <= weaponMounts; mount++)
	{
		var mountTransform = transform.Find("mount_" + mount);
		// remove any existing weapons
		for(var oldWeapon in mountTransform.children)
		{
			Destroy(oldWeapon.gameObject);
		}
		
		var weaponClone = Instantiate(newWeapon, mountTransform.position, mountTransform.rotation);
		weaponClone.transform.parent = mountTransform;
	}
	
	return weaponClone.GetComponent(FleetWeapon);
}


function Update() {
	if(!alive || suspendOrders) return;
	
	// if we are in combat but have no target, go find a target
	try {
		if ((squadron.combatTargets.Count > 0) &&
			squadron.GetStatus() != "retreat" &&
			(attackTarget == null || !attackTarget.gameObject.active) )//|| !attackTarget.GetComponent(FleetShip).alive)
		{
			//var squad_target = squadron.combatTargets[0];
			Debug.Log("Picking new target!");
			
			// look for a target in ALL of my squad's current combatants
			var new_target : Transform;
			var closest_dist = Mathf.Infinity;
			for(var t in squadron.combatTargets) {
				var closest_in_t = t.GetClosestMember(transform);
				var this_dist = (closest_in_t.position - transform.position).sqrMagnitude;
				if(this_dist < closest_dist) {
					closest_dist = this_dist;
					new_target = closest_in_t;
				}
			}
			
			//var new_target = squad_target.GetClosestMember(transform);
			if(new_target != null) attackTarget = new_target;
			else {
				Debug.Log("Couldn't find a target!");	
			}
		}
		else {
			// ask the squadron to try and engage any squadrons already in range
			
		}
	}
	catch(err) {
	}
}

function FixedUpdate() {
	if(!alive || suspendOrders) return;
	
	var dist2targ : float;

	// if my squad has no targets, I shouldn't be fighting
	if(squadron.combatTargets.Count == 0)
		Disengage();

	if(moveTarget != null && moveTarget != Vector3.zero && attackTarget == null) {
		dist2targ = Vector3.Distance(transform.position, moveTarget);
		
		if(dist2targ > minimum_distance) {
			seek(moveTarget);
		}
		else {
            // consider the move complete. Proceed to align.
            // after alignment, consider the entire order complete and clear my targets.
			//moveTarget = new Vector3();
			moveTarget = Vector3.zero;
		}
	}
	
	if(attackTarget != null) {
		dist2targ = Vector3.Distance(transform.position, attackTarget.position);
		
		if(dist2targ > weapon.range) {
			seek(attackTarget.position);
		}
		else {
			//Debug.Log("firing a "+ bulletPrefab.name + " range: "+ dist2targ);
			var direction2targ = (attackTarget.position - transform.position);
			var angle = Vector3.Angle(direction2targ, transform.forward);
			if(angle < Mathf.Max(weapon.arc/2, 10.0))
			{
				FireWeapon(attackTarget);
			}
			else
			{
				boid.turnTo2D(attackTarget.position);
			}
		}
		
		// see if the distance is too far away from the squadron's center
		// if so, we should disengage
		/*
		distFromSquad = Vector3.Distance(squadron.transform.position, attackTarget.position);
		if(distFromSquad >= squadron.GetEngageRange()) {
			Debug.Log("disengaging a retrating target...");
			Disengage();
		}
		*/
	}
	
}

function OnGUI() {
	if(!selected) return;
	
	/*
	var distFromCamera = (Camera.main.transform.position - transform.position).sqrMagnitude;
	if(distFromCamera > sqrIconViewDistance || distFromCamera <= sqrIconViewDistanceMin)
	{
		return;
	}
	*/

	var iconPos = Camera.main.WorldToScreenPoint(transform.position);

	if(iconPos.z >= 0 ) {
		//var iconSize = Mathf.Max(1, 32 * ((20.0-Camera.main.transform.position.y)/20.0));
		var iconSize = 16;

		/*var bannerRect = new Rect(iconPos.x-iconSize,
			Screen.height - iconPos.y-iconSize,
			iconSize*2, iconSize*2);*/

		GUIPanel.DrawHealthBarVertical(iconPos.x, Screen.height-iconPos.y+8, this);
	}
}

function GoTo(destination : Vector3) {
	moveTarget = destination;
	
}

function GoTo(destination : Vector3, alignment : Vector3) {
	moveTarget = destination;
    alignTarget = alignment;
}


function Attack(target : Transform) {
	if(target == null) attackTarget = null;
	attackTarget = target;
}

function Disengage() {
	// stupid workaround
	var no_target : Transform;
	attackTarget = no_target;
}


function FireWeapon(target : Transform) {
	BroadcastMessage("PewPew", target);
}


function turnTo(direction : Vector3) {
    var destination_rot = Quaternion.LookRotation(direction);
    //var difference = destination_rot - transform.rotation;

    var str = Mathf.Min (yaw * Time.deltaTime, 1); 

    transform.rotation = Quaternion.Slerp(transform.rotation, destination_rot, str);
    //RotateTowards(transform.rotation, destination_rot, str, 1.0);
}

function seek(destination : Vector3) {
    boid.turnTo2D(destination);
	
	// thrust
	var facing = transform.TransformDirection(Vector3.forward);
    var dir = (destination - transform.position).normalized;
	if(Vector3.Dot(facing, dir) > 0.5) {
		boid.Thrust(1.0);
	}
    else {
        // directional side thrusters
        boid.Push(sideThrusterPower, dir);
    }
}


function align(targetDir : Vector3) {
    boid.steerToDirection2D(targetDir);
}


function OnDamage(amount : int) {
	OnDamage([amount, 0, 0.0]);
}

function OnDamage(hitData : Array) {
	var amount = hitData[0];
	var penetration = hitData[1];
	var angle = hitData[2];

	if(angle >= 45.0 && angle < 135.0)
	{
		// side
		Debug.Log("side hit!");
		amount *= 1.5;
	}
	else if(angle >= 135.0)
	{
		// rear
		Debug.Log("rear hit!");
		amount *= 2.0;
	}

	if(amount > 0) {
		// potential damage formula
		//var totaldamage = amount - Mathf.Max(0, armor - penetration);
		//amount = Mathf.Max(1, amount - Mathf.Max(0, armor - penetration));
		// new percentage-based formula
		amount = Mathf.Max(1, amount * (1.0 - 0.1 * Mathf.Max(0, armor - penetration)) );
	}

	if(hp > 0){
		hp -= amount;
		// getting hurt will also hurt my squadron's morale
		if(amount > 0 && !isFoldship) {
			// if amount > remaining HP, don't cause too much morale damage
			var morale_damage = Mathf.Max(0, Mathf.Min(amount, hp-amount)) * 0.12;
			squadron.AddMorale(-morale_damage);
		}
	}
	if(hp <= 0){
		hp = 0;
		Kill();
	}
	else if(hp > max_hp) hp = max_hp;
}


function OnXP(amount : int) {
	squadron.AddXP(amount);
}


function OnSuspendOrders() {
	suspendOrders = true;
}

function OnResumeOrders() {
	suspendOrders = false;
}


function OnSelected() {
	selected = true;
}

function OnUnSelected() {
	selected = false;
}


function SetHP(value : int) {
	hp = value;
}

function GetHP() {
	return hp;
}

function GetMoveTarget() {
	return moveTarget;
}

function GetAttackTarget() {
	return attackTarget;
}

function GetMainWeapon() {
	if(weapon != null) return weapon;

	var waffe = GetComponent(FleetWeapon);
	if(waffe == null)
	{
		// FIXME: the super-paranoid version of this should look at ALL
		//  weapons and take the one with shortest range.
		//  just in case we have a ship with different types of weapons
		waffe = transform.GetComponentInChildren(FleetWeapon);
	}
	return waffe;
}

function Serialize()
{
	// only serialize values we would want to see in a new ship
	return LitJson.JsonMapper.ToJson(this);
}

function UnSerialize(json : String)
{
	//this = LitJson.JsonMapper.ToObject.<FleetShip>(json);	
}


function Kill()
{
	// don't kill a dead horse
	if(!alive) return;

	alive = false;
	hp = 0;
	gameObject.active = false; //renderer.enabled = false;
	
	// send word to the squadron!
	squadron.SendMessage("OnMemberKilled", this);
	
	Instantiate(explosionPrefab, transform.position, transform.rotation);
}