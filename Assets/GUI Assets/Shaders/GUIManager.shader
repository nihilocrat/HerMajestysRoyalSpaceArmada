Shader "GUIManager" {
	Properties {
		_Color ("Main Color", Color) = (1.0, 1.0, 1.0, 1.0)
		_MainTex ("Texture RGBA", 2D) = "white" {}
	}
	
	Category {
		Blend SrcAlpha OneMinusSrcAlpha
		Alphatest Off
		ColorMask RGB
		Cull Back
		Lighting Off
		ZWrite Off
		Fog {Mode Off}
		BindChannels {
			Bind "Color", color
			Bind "Vertex", vertex
			Bind "TexCoord", texcoord
		}
		
		// ---- Single texture cards (does not do color tint)
		SubShader {
			Tags {"Queue" = "Transparent" }
			Pass {
				SetTexture [_MainTex] {
					combine texture * primary, texture * primary
 				}
				
				SetTexture [_MainTex] {
					constantcolor [_Color]
					combine previous * constant, previous * constant
				}
			}
		}
	}
}
