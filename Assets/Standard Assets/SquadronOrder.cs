using UnityEngine;
	
public class SquadronOrder
{
	//public Texture2D icon;
	//public string description;
	public OrderType type;
	public Vector3 position;
	public Vector3 direction;
	public GameObject target;
	public GameObject sender;	// wot sent the order
	public string message; // the message to use in SendMessage when the queue decides to build this order
	public object args;    // arguments to the message
}

public enum OrderType
{
	GoTo,
	Follow,
	Retreat,
	Build
}
