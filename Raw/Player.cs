using UnityEngine;
using Utils;

class Player : MonoBehaviour
{
    public String playerName = "Foobarius";
    public int team = 1;
    public int cash = 1000;
    public int squad_cap = 10;

    private static Player singleton;

    // to keep track of fleet numbering
    private int fleetsCreated = 0;
    // to display the rate at which this player accumulates cash
    private int cashRate;

    public void Awake() {
        singleton = this;
    }

    public Array getSquads() {
        var all_squads = FindObjectsOfType(Squadron);
        Array my_squads = new Array();
        for(S s in all_squads) {
            if(s.team == team) my_squads.Add(s);
        }
        
        return my_squads;
    }

    function getPlanets() {
        var all_planets = FindObjectsOfType(Planet);
        var mine = new Array();
        for(var p in all_planets) {
            if(p.team == team) mine.Add(p);
        }
        
        return mine;
    }


    function resetCashRate() {
        var planets = getPlanets();
        
        var total_rate = 0;
        // count planet income
        for(var p in planets) {
            total_rate += p.rank;
        }
        // count squadron maintanence
        
        cashRate = total_rate;
    }

    function getCashRate() {
        return cashRate;
    }

    public static Player getSingleton() {
        return singleton;
    }

    public static Player getPlayer(team_id : int) : Player {
        // hack : we should instead keep a list of players and send out references from there
        //var t = Transform.root.Find("player_" + team_id);
        var foundPlayer : Player;
        var players = FindObjectsOfType(Player);
        
        for(var p in players)
        {
            if(p.GetComponent(Player).team == team_id) return p;
        }
        
        return foundPlayer;
    }

    function getNextFleetName(baseFleetName : String) {
        fleetsCreated += 1;
        return Utils.toOrdinal(fleetsCreated) + " " + baseFleetName;
    }

}