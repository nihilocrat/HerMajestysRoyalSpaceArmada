public var squadron : Squadron;

function Start() {
    Physics.IgnoreCollision(collider, squadron.flagship.collider);
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

	if(squadron.GetStatus() == "retreat" ||
	   squadron.combatTargets.Contains(other)) return;

	//var influence = other.gameObject.GetComponent(SquadInfluence);
	var other_squad = other.gameObject.GetComponent(Squadron);
	var other_ship = other.gameObject.GetComponent(FleetShip);
	
	if(other_ship != null)  other_squad = other_ship.squadron;
	
	if(other_squad != null)
	{
		// attack enemies
		if(other_squad.team != squadron.team && other_squad.status != "retreat") {
			squadron.SendMessage("Attack", other_squad);
			// tell those ruffians that we have thrown down our glove!
			other_squad.SendMessage("OnEnemyAttack", squadron);
		}
	}
}

function OnTriggerExit(other : Collider)
{
	// if I got unparented and my squad is dead I should die too
	if(squadron == null) {
		Destroy(gameObject);
		return;
	}

	/*
	// stop fighting squads that run away
	var other_squad = other.gameObject.GetComponent(Squadron);
	if(other_squad != null) {
		Debug.Log("exitting influence!");
		squadron.SendMessage("OnDisengage", other_squad);
	}
	*/
	
	/*	
	// prevent my ships from leaving influence
	var my_ship = other.gameObject.GetComponent(FleetShip);
	if(my_ship != null && my_ship.squadron.team == squadron.team) {
		my_ship.Disengage();
	}
	*/
}