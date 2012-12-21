@script RequireComponent(AudioSource)

public var loopLastClip = true;
public var musicQueue : AudioClip[];
private var index = 0;

function Start() {
	audio.clip = musicQueue[index];
	audio.Play();
}

function Update () {
	if(!audio.isPlaying) {
		if(index+1 >= musicQueue.Length) {
			audio.loop = true;
			audio.Play();
		}
		else {
			index += 1;
			audio.clip = musicQueue[index];
		}
		//if(index == musicQueue.Length) audio.loop = true;
	}
}