using UnityEngine;
using System.Collections.Generic;
using LitJson;

public enum CardType
{
	CommandCard,
	ArtifexCard,
	FoldshipCard
};

public class Card
{
	public uint version = 1;
	
	public string name;
	public string iconName;
	private Texture2D icon;
	public CardType type;
	public Dictionary<string, int> stats = new Dictionary<string, int>();
	public string description;
	
	public Card()
	{
	}
	
	public int GetStat(string statName)
	{
		if(stats.ContainsKey(statName))
		{
			return stats[statName];
		}
		else
		{
			return 0;
		}
	}
	
	public void OnPlay()
	{
	}
	
	public void DrawCard(Vector2 cardPos)
	{
		int shipcardWidth = 100;
		int shipcardHeight = 140;
		
		// card-button contents
		GUI.BeginGroup(new Rect((int)cardPos.x, (int)cardPos.y, shipcardWidth, shipcardHeight));
		
		GUI.Label(new Rect(10, 5, shipcardWidth, 40), name);
		GUI.Label(new Rect(10,60, shipcardWidth,shipcardHeight-80), description);
		
		GUI.EndGroup();
	}
		
	public string Serialize()
	{
		return LitJson.JsonMapper.ToJson(this);
	}
	
	static public Card UnSerialize(string jsonString)
	{
		return LitJson.JsonMapper.ToObject<Card>(jsonString);
	}
}