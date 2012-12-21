using UnityEngine;
using System.Collections.Generic;

public class Globals
{
	static public string version = "alpha 4.1";
	
	static public int xp_per_level = 100;
	static public float xp_scale = 1.2f;
	static public int planet_upgrade_cost_per_rank = 50;
	// cash flow per economy rank
	static public int cash_per_rank = 1;
	// squad cap increase per industry? command? rank
	static public int squads_per_rank = 1;
	
	static public float flagshipReviveDelay = 10.0f;
	
	static public int[] rank_xp_reqs = {
		0,
		2000,
		4000,
		6000
	};
	
	// FIXME: smarter way to do this?
	static public Color[] colorChoices = {
		new Color(1.000f, 1.000f, 1.000f, 1.000f),
		new Color(0.635f, 0.635f, 0.635f, 1.000f),
		new Color(0.322f, 0.322f, 0.322f, 1.000f),
		new Color(0.102f, 0.102f, 0.102f, 1.000f),
		new Color(0.314f, 0.655f, 0.969f, 1.000f),
		new Color(0.180f, 0.380f, 0.549f, 1.000f),
		new Color(0.165f, 0.082f, 0.980f, 1.000f),
		new Color(0.047f, 0.000f, 0.471f, 1.000f),
		new Color(0.992f, 0.082f, 0.082f, 1.000f),
		new Color(0.635f, 0.235f, 0.153f, 1.000f),
		new Color(0.506f, 0.047f, 0.047f, 1.000f),
		new Color(0.000f, 0.953f, 0.314f, 1.000f),
		new Color(0.000f, 0.553f, 0.184f, 1.000f),
		new Color(0.071f, 0.902f, 0.027f, 1.000f),
		new Color(0.090f, 0.392f, 0.071f, 1.000f),
		new Color(0.369f, 0.627f, 0.357f, 1.000f),
		new Color(0.184f, 0.322f, 0.176f, 1.000f),
		new Color(0.996f, 0.906f, 0.000f, 1.000f),
		new Color(0.992f, 0.624f, 0.059f, 1.000f),
		new Color(0.635f, 0.404f, 0.039f, 1.000f),
		new Color(0.498f, 0.000f, 0.996f, 1.000f),
		new Color(0.243f, 0.004f, 0.475f, 1.000f),
		new Color(0.996f, 0.000f, 0.200f, 1.000f),
		new Color(0.557f, 0.000f, 0.114f, 1.000f)
	};
	
	static public Color[] glowChoices = {
		new Color(0.996f, 0.996f, 0.996f, 1.000f),
		new Color(0.376f, 0.373f, 0.992f, 1.000f),
		new Color(0.463f, 0.754f, 1.000f, 1.000f),
		new Color(0.192f, 0.961f, 0.996f, 1.000f),
		new Color(0.187f, 1.000f, 0.386f, 1.000f),
		new Color(0.683f, 1.000f, 0.231f, 1.000f),
		new Color(0.975f, 1.000f, 0.187f, 1.000f),
		new Color(1.000f, 0.728f, 0.313f, 1.000f),
		new Color(0.996f, 0.098f, 0.098f, 1.000f),
		new Color(0.996f, 0.082f, 0.373f, 1.000f),
		new Color(0.996f, 0.098f, 0.831f, 1.000f),
		new Color(0.784f, 0.239f, 0.996f, 1.000f)
	};
	
	static public GUISkin skin;
}