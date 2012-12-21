using UnityEngine;
using System.Collections.Generic;
	
public class BuildOrder
{
	public Texture2D icon;
	public string description;
	public int cost;
	public GameObject sender;	// wot sent the order
	public string buildMessage; // the message to use in SendMessage when the queue decides to build this order
	public object buildArgs;    // arguments to the message
}
