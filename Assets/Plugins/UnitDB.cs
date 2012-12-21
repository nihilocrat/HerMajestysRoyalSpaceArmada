using UnityEngine;
using System.Collections.Generic;

public class UnitDB : MonoBehaviour
{
	public GameObject get(string key) {
		//int idx = Array.IndexOf(keys, key);
		// what. the. fuck.
		int idx = -1;
		for(int i=0; i < keys.Length ; i++) {
			if(keys[i] == key) idx = i;
		}
		
		if(idx >= 0) return values[idx];
		else return null;
	}
	
	public string[] keys;
	public GameObject[] values;
	
	public GameObject foldship;
	
	public GameObject[] frigateFront;
	public GameObject[] frigateSupport;
	public GameObject[] frigateOfficer;
	
	public GameObject[] cruiserFront;
	public GameObject[] cruiserSupport;
	public GameObject[] cruiserOfficer;
	
	public GameObject[] battleshipFront;
	public GameObject[] battleshipSupport;
	public GameObject[] battleshipOfficer;
}