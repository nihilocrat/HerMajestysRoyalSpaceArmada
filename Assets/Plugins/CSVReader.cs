using System.IO;
using UnityEngine;

public class CSVReader {
	public static string[] read(string filename) {
		StreamReader sr = new StreamReader(Application.dataPath + "/" + filename);
		string fileContents = sr.ReadToEnd();
		sr.Close();

		string[] lines = fileContents.Split("\n"[0]);
		return lines;
	}
}