Shader "DiffuseUnlit" {
    Properties {
        _Color ("Main Color", Color) = (1,1,1,1)
        _Emissive ("Unlit Color", Color) = (1,1,1,1)
        _MainTex ("Base (RGB)", 2D) = "white" {}
        _EmissiveTex ("Emissive (RGB)", 2D) = "black" {}
    }
    Category {
		Tags { "RenderType"="Opaque" }
       ZWrite On
       Cull Back
       Blend SrcAlpha OneMinusSrcAlpha
       SubShader {
		    Pass {
				Material {
					Diffuse [_Color]
					Ambient [_Color]
				} 
				Lighting On				
				SetTexture [_MainTex] {
                    constantColor [_Color]
					Combine texture * primary DOUBLE, texture * primary
                 }
			}
			Pass {
				Lighting Off 
				SetTexture [_EmissiveTex] {
                    constantColor [_Emissive]
                    Combine texture * constant, texture * constant 
                 }
            }
        } 
    }
}