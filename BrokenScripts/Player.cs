using UnityEngine;
using System.Collections.Generic;
//using Globals;
//using Utils;

public class Player : MonoBehaviour
{
	public string playerName = "Foobarius";
	public Material shipMaterial;
	public int team = 1;

	public int cash = 1000;

	public int squad_cap = 10;
	public int squadCount = 0;

	public Color[] colors;

	private static Player singleton;

	// to keep track of fleet numbering
	private int fleetsCreated = 0;
	// to display the rate at which this player accumulates cash
	private int cashRate;

	private Texture2D blazonTexture;

	void Awake() {
		singleton = this;
		
		blazonTexture = GetComponent(Blazon).GetBlazon();
	}

	public List<Squadron> getSquads() {
		var all_squads = FindObjectsOfType(typeof(Squadron));
		var my_squads = new List<Squadron>();
		foreach(var s in all_squads) {
			if(s.team == team) my_squads.Add(s);
		}
		
		return my_squads;
	}

	public List<Planet> getPlanets() {
		var all_planets = FindObjectsOfType(typeof(Planet));
		var mine = new List<Planet>();
		foreach(var p in all_planets) {
			if(p.team == team) mine.Add(p);
		}
		
		return mine;
	}


	public Texture2D getBlazon() {
		if(blazonTexture == null) blazonTexture = GetComponent(Blazon).GetBlazon();
		return blazonTexture;
	}


	public void resetCashRate() {
		var planets = getPlanets();
		
		var total_rate = 0;
		// count planet income
		foreach(var p in planets) {
			total_rate += p.stats["economy"] * Globals.cash_per_rank; //p.rank;
		}
		// count squadron maintanence
		
		cashRate = total_rate;
	}


	public void resetStats() {
		var planets = getPlanets();
		
		var total_rate = 0;
		var total_cap = 0;
		
		// count planet income
		foreach(var p in planets) {
			total_rate += p.stats["economy"] * Globals.cash_per_rank; //p.rank;
			total_cap += p.stats["industry"] * Globals.squads_per_rank; //p.rank;
		}
		// count squadron maintanence
		
		cashRate = total_rate;
		squad_cap = total_cap;	
	}


	public int getCashRate() {
		return cashRate;
	}

	public static Player getSingleton() {
		return singleton;
	}

	public static Player getPlayer(int team_id) {
		// hack : we should instead keep a list of players and send out references from there
		//var t = Transform.root.Find("player_" + team_id);
		Player foundPlayer;
		var players = FindObjectsOfType(Player);
		
		foreach(var p in players)
		{
			if(p.GetComponent(Player).team == team_id) return p;
		}
		
		return foundPlayer;
	}

	public string getNextFleetName(string baseFleetName) {
		fleetsCreated += 1;
		return Utils.toOrdinal(fleetsCreated) + " " + baseFleetName;
	}
}