using UnityEngine;
using System.IO;

public class Utils
{
	static public bool pointInsideAABB(Vector2 min, Vector2 max, Vector2 point)
	{
		return (point.x >= min.x && point.x <= max.x) &&
			(point.y >= min.y && point.y <= max.y);
	}
	
	static public bool AABBcollide(Vector2 min, Vector2 max, Vector2 min2, Vector2 max2)
	{
		return (min.x <= max2.x && max.x >= min2.x) &&
			(max.y >= min2.y && min.y <= max2.y);
	}
	
	static public float StepRound(float value, float step)
	{
		float step2 = step / 2;
		float remain = value % step;
		if(remain > step2)
		{
			value += (step - remain);
		}
		else
		{
			value -= remain;
		}
		
		return value;
	}
	
	static public string GetFileNameFromFleetName(string name, string fileType)
	{
		var output = "";
		foreach(string nameBit in name.Split(' '))
		{
			string bit = nameBit.ToLower();
			
			// do some smarter replacement here
			string[] invalidChars = { "'", "\"", ",", "." };
			foreach(var c in invalidChars)
			{
				bit = bit.Replace(c, "");
			}
			
			output += bit + "_";
		}
		output = output.Remove(output.Length-1,1);
		
		output += "."+ fileType +".json";
		
		return output;
	}

	
	static public string Serialize(object pocoObject)
	{
		return LitJson.JsonMapper.ToJson(pocoObject);
	}
	
	static public string LoadJsonFromFile(string path)
	{
		path = Application.dataPath + "/Data/" + path;
		
	    var streamReader = new StreamReader(path);
		var text = streamReader.ReadToEnd();
		streamReader.Close();
		
		return text;
	}
	
	static public bool SaveJsonToFile(string filename, string jsonString)
	{
		// this is a bit dumb, I think?
		FileStream fs;
		fs = File.Open(Application.dataPath + "/Data/" + filename, FileMode.Create, FileAccess.Write, FileShare.None);
		
		System.Byte[] info;
		info = new System.Text.UTF8Encoding(true).GetBytes(jsonString);
		fs.Write(info, 0, info.Length);
		fs.Close();
		
		Debug.Log("Wrote to " + filename);
		return true;
	}

	
	/// convert carinal number (1,2,3,4) to ordinal (1st,2nd,3rd,4th)
	static public string toOrdinal(int number) {
		string ending;
		if(number % 10 == 1) ending = "st";
		else if(number % 10 == 2) ending = "nd";
		else if(number % 10 == 3) ending = "rd";
		else ending = "th";
		
		return number.ToString() + ending;
	}
	
	
	
	// these two lists serves as building blocks to construt any number
	// just like coin denominations.
	// 1000->"M", 900->"CM", 500->"D"...keep on going 
	static int[] decimalDens={1000,900,500,400,100,90,50,40,10,9,5,4,1};
	static string[] romanDens={"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
	
/*
def toRoman(dec):
	"""
	Perform sanity check on decimal and throws exceptions when necessary
	"""		
        if dec <=0:
	  raise ValueError, "It must be a positive"
         # to avoid MMMM
	elif dec>=4000:  
	  raise ValueError, "It must be lower than MMMM(4000)"
  
	return decToRoman(dec,"",decimalDens,romanDens)

def decToRoman(num,s,decs,romans):
	"""
	  convert a Decimal number to Roman numeral recursively
	  num: the decimal number
	  s: the roman numerial string
	  decs: current list of decimal denomination
	  romans: current list of roman denomination
	"""
	if decs:
	  if (num < decs[0]):
	    # deal with the rest denomination
	    return decToRoman(num,s,decs[1:],romans[1:])		  
	  else:
	    # deduce this denomation till num<desc[0]
	    return decToRoman(num-decs[0],s+romans[0],decs,romans)	  
	else:
	  # we run out of denomination, we are done 
	  return s
	*/
}