public var healAmount = 5;
public var moraleRecoveryAmount = 1;

private var max_healCooldown = 1.0;
private var healCooldown = 0.0;

private var healTarget : FleetShip;

private var team = 0;

function Start()
{
}

function OnSetPlayer(team_id : int)
{
	var planet = transform.parent.GetComponent(Planet);
	var shipyard = transform.parent.GetComponent(Shipyard);
	
	if(planet != null) team = planet.team;
	else if (shipyard != null) team = shipyard.team;
}

function Update()
{
	//if(healCooldown > 0) healCooldown -= Time.deltaTime;
}

function OnTriggerStay(other : Collider) {
	// FIXME : there should probably be seperate cooldowns for each squad,
	// thus, make the squad keep track of its own healcooldown
	//if(healCooldown > 0) return;
	
	//Debug.Log("in healarea! " + other.gameObject.name);
	//var ship = other.GetComponent(FleetShip);
	//var squad = ship.squadron;
	var squad = other.GetComponent(Squadron);
	
	// can only heal friendly squads NOT in combat
	if(squad != null && squad.team == team && squad.GetHealCooldown() <= 0)
    {  
        if(squad.combatTargets.Count <= 0)
        {
            // heal the weakest member of the squad
            var weakest = squad.GetWeakestMember();
            if(weakest != null) {
                weakest.SendMessage("OnDamage", -healAmount);
                //Debug.Log("healzzz! " + weakest.gameObject.name);
            }
        }
        
        // recover morale both in and out of combat
        // this leads to a defense advantage, more likely that squads will
        // fight to the death when defending
        squad.AddMorale(moraleRecoveryAmount);
		squad.ResetHealCooldown();
    }
}
