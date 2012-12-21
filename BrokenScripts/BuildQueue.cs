using UnityEngine;
using System.Collections.Generic;

public class BuildQueue : MonoBehaviour {
	
	public List<BuildOrder> queue;
	public int playerId = 0;
	
	//private Player player;
	
	// Use this for initialization
	void Start () {
		//player = Player.GetPlayer(playerId);
	}
	
	void Advance() {
		if(queue.Count <= 0) return;
		
		// look at the next thing in queue
		BuildOrder next = queue[0];
		
		// if we have enough money for it, submit the build order!
		
		// need to know where the hell to send the message, though!
		
	}
	
	private int GetTotalValue()
	{
		int total = 0;
		foreach(BuildOrder b in queue)
		{
			total += b.cost;
		}
		return total;
	}
}

public class BuildOrder
{
	public Texture2D icon;
	public string description;
	public int cost;
	public GameObject sender;	// wot sent the order
	public string buildMessage; // the message to use in SendMessage when the queue decides to build this order
}
