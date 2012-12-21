import Globals;
import System.Collections;

public var squadBannerPrefab : GameObject;
public var squadronName = "1st Royal Lancers";
public var squadronShipClass = "Frigate";
public var squadronDesign : GameObject[];

public var team = 1;
public var rank = 1;

public var foldshipSpawn = false;

private var myPlayer : Player;
private var team_material : Material;

function Start() {
	//team_material = TeamSettings.getSingleton().getMaterial(team);
	myPlayer = Player.getPlayer(team);
	team_material = myPlayer.shipMaterial;
	
	if( foldshipSpawn )
	{
		squadronDesign[0] = myPlayer.units.foldship;
		shipClass = "Single";
	}
	
	ComissionSquadron(squadronDesign, squadronShipClass);
	Destroy(gameObject);
}

function ComissionSquadron(squad_design, shipClass) : Squadron {
	ComissionSquadron(squad_design, shipClass, false);
}

function ComissionSquadron(squad_design, shipClass, free) : Squadron {
	// create that durn squadron
	//officer.GetComponent(FleetShip).team = team;
	if(squad_design.Length >= 3)
		var officer = squad_design[2];
	else
		officer = squad_design[0];
	// officer ship matches the front rank if the player has no special flagships
	if(officer == null) officer = squad_design[0];
	
	var spawnpoint = new Vector3(transform.position.x,0,transform.position.z);
	var flaggy = Instantiate(officer, spawnpoint, Quaternion.identity);
	var squad = Instantiate(squadBannerPrefab, spawnpoint, Quaternion.identity);
	squad.transform.parent = flaggy.transform;
	squad.transform.localPosition = new Vector3(0,1.5,0);
	
	// determine squad name
	//var baseName = squad_design[0].baseFleetName;
	var squad_component = squad.GetComponent(Squadron);
	
	squad_component.shipClass = shipClass;
	squad_component.design = squad_design;
	squad_component.fleetName = squadronName;
	squad_component.team = team;
	squad_component.spawnWithFullHP = true;
	
	squad_component.flagship = flaggy;
	var flaggy_ship = flaggy.GetComponent(FleetShip);
	flaggy_ship.squadron = squad_component;
	
	myPlayer.squadCount += 1;
	
	return squad_component;
}
