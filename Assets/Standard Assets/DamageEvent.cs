using UnityEngine;
using System.Collections;

public class DamageEvent
{
	int damage = 0;
	int penetration = 0;
	
	DamageEvent(int damage, int penetration)
	{
		this.damage = damage;
		this.penetration = penetration;
	}
	
	static public int CalculateDamage(int damage, int penetration, int armor)
	{
		int total = 0;
		
		if(damage > 0) {
			// potential damage formula
			//var totaldamage = amount - Mathf.Max(0, armor - penetration);
			total = Mathf.Max(1, damage - Mathf.Max(0, armor - penetration) );
		}
		
		return total;
	}
}

