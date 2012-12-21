

var sliderValue = 1.0;
var maxSliderValue = 10.0;

function OnGUI()
{
	// Wrap everything in the designated GUI Area
	GUILayout.BeginArea (Rect (0,0,200,60));

	// Begin the singular Horizontal Group
	GUILayout.BeginHorizontal();

	// Place a Button normally
	if (GUILayout.RepeatButton ("Increase max\nSlider Value"))
	{
		maxSliderValue += 3.0 * Time.deltaTime;
	}

	// Arrange two more Controls vertically beside the Button
	GUILayout.BeginVertical();
	GUILayout.Box("Slider Value: " + Mathf.Round(sliderValue));
	sliderValue = GUILayout.HorizontalSlider (sliderValue, 0.0, maxSliderValue);

	// End the Groups and Area
	GUILayout.EndVertical();
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
}