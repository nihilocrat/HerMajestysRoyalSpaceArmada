public var returnFire = true;

private var attackers = new Array();
private var combatTargets = new Array();

function OnEnemyAttack(attacker : Squadron) {
	attackers.Add(attacker);
}

function OnEnemyDisengage(attacker : Squadron) {
	attackers.Remove(attacker);
}

/*
function Attack(other : Squadron) {
	if(combatTargets.Count > 0 || status == "retreat") return;
	
	
	//if(team == TeamSettings.getSingleton().humanPlayer.team)
	//	audio.PlayOneShot(Chatter_engage);
	
	
	Messages.getSingleton().Add(team,
		fleetName +" have engaged the enemy");
	
	combatTarget = other;
	combatTargets.Add(other);
	
	// provide attack orders to squadmates
	for(var m in members) {
		var target = other.GetClosestMember(m.transform);
		m.SendMessage("Attack", target);
	}
	
	status = "combat";
}


function Disengage() {
	if(combatTarget != null) {
		combatTarget.SendMessage("OnEnemyDisengage", this);
	}
	if(combatTargetPlanet != null) {
		combatTargetPlanet.SendMessage("OnEnemyDisengage", this);
	}
	combatTarget = null;
	combatTargetPlanet = null;
	combatTargets.Clear();
	for(var m : FleetShip in members) m.Disengage();
}
*/


function SurrenderTo(lastAttacker : Squadron) {
	// I need to figure out who killed me, and switch to their team
	team = lastAttacker.team;
	hp = 100;
	// ugh
	lastAttacker.OnVictory();
	//SetTeamColor(lastAttacker.team);
	
	// we are assuming that ALL our attackers
	// are friendly to the new team. I think if this is not the case,
	// the unfriendly attacker will simply re-engage the planet.
	// therefore it's probably safe (and easiest) to just clear my attackers
	attackers.Clear();
}