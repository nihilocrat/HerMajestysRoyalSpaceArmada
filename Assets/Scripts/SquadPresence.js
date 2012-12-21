public var squadron : Squadron;

function Start() {
    Physics.IgnoreCollision(collider, squadron.flagship.collider);
}

function OnSelected()
{
}

function OnUnSelected()
{
}

function OnTriggerStay(other : Collider)
{
	//if(squadron.combatTargets.Count > 0) return;
	OnTriggerEnter(other);
}

function OnTriggerEnter(other : Collider)
{
	// if I got unparented and my squad is dead I should die too
	if(squadron == null) {
		Destroy(gameObject);
		return;
	}
	
	var other_squadpres = other.GetComponent(SquadPresence);
	if(other_squadpres != null)
	{
		// stop all orders and try to push away from the other squad
	}
	
	// FIXME : this looks kind of ugly and bug-prone
	var other_healarea = other.GetComponent(HealArea);
	if(other_healarea != null)
	{
		var other_planet = other_healarea.transform.parent.GetComponent(Planet);
		
		if(squadron.GetStatus() == "retreat" || squadron.GetCombatTargetPlanet() == other_planet) return;
		
		if(other_planet != null &&
		   (other_planet.GetCaptureTeam() == 0 || other_planet.GetCaptureTeam() == squadron.team))
		{
			if(other_planet.team != squadron.team) {
				squadron.SendMessage("AttackPlanet", other_planet);
				other_planet.SendMessage("OnEnemyAttack", squadron);
			}
		}
	}
}

function OnTriggerExit(other : Collider)
{
}