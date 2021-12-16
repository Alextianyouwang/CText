var miniutsSinceStart = 0;
var timeSinceStart = 0;
var startingTime = new Date().getSeconds();

const densitySlider = document.querySelector("div.a input[name = 'cell_density']");
const densityValue = document.querySelector("div.a span[name = 'cell_density']");

const blendSlider = document.querySelector("div.b input[name = 'blend']");
const blendValue = document.querySelector("div.b span[name = 'blend']");

const edgeOneSlider = document.querySelector("div.c input[name = 'edge_one']");
const edgeOneValue= document.querySelector("div.c span[name = 'edge_one']");

const edgeTwoSlider = document.querySelector("div.d input[name = 'edge_two']");
const edgeTwoValue = document.querySelector("div.d span[name = 'edge_two']");

const dispMulSlider = document.querySelector("div.e input[name = 'displace_multiplier']");
const dispMulValue = document.querySelector("div.e span[name = 'displace_multiplier']");


const dispXSlider = document.querySelector("div.f input[name = 'displacement_X']");
const dispXValue = document.querySelector("div.f span[name = 'displacement_X']");

const circleDisSlider = document.querySelector("div.g input[name = 'circle_distortion_factor']");
const circleDisValue = document.querySelector("div.g span[name = 'circle_distortion_factor']");

const subdivSlider = document.querySelector("div.h input[name = 'subdivisions']");
const subdivValue = document.querySelector("div.h span[name = 'subdivisions']");


const rgSepScaleSlider = document.querySelector("div.i input[name = 'RG_seperation']");
const rgSepScaleValue = document.querySelector("div.i span[name = 'RG_seperation']");

const noiseWeightSlider = document.querySelector("div.j input[name = 'noise_weight']");
const noiseWeightValue = document.querySelector("div.j span[name = 'noise_weight']");


densitySlider.oninput = UpdateShaderValue;
blendSlider.oninput = UpdateShaderValue;
edgeOneSlider.oninput = UpdateShaderValue;
edgeTwoSlider.oninput = UpdateShaderValue;
dispMulSlider.oninput = UpdateShaderValue;
dispXSlider.oninput = UpdateShaderValue;
circleDisSlider.oninput = UpdateShaderValue;
subdivSlider.oninput = UpdateShaderValue;
rgSepScaleSlider.oninput = UpdateShaderValue;
noiseWeightSlider.oninput = UpdateShaderValue;


const textInput = document.querySelector("div.text_Inputs textarea[name = 'text_Inputs']");
var targetText;
textInput.oninput = ()=>{
  targetText = textInput.value;

  UpdateNLP();
}


function Initialize()
{
  InitShader();
  UpdateShaderValue();
  ResetDisplayValue();
  Clear();
}
function Clear()
{
  densitySlider.value =densitySlider.defaultValue;
  blendSlider.value =blendSlider.defaultValue;
  edgeOneSlider.value = edgeOneSlider.defaultValue;
  edgeTwoSlider.value = edgeTwoSlider.defaultValue;
  dispMulSlider.value = dispMulSlider.defaultValue;
  dispXSlider.value = dispXSlider.defaultValue;
  circleDisSlider.value = circleDisSlider.defaultValue;
  subdivSlider.value = subdivSlider.defaultValue;
  rgSepScaleSlider.value = rgSepScaleSlider.defaultValue;
  noiseWeightSlider.value = noiseWeightSlider.defaultValue;

  textInput.value = "";

  UpdateShaderValue();
}
function OnSwitchingControl()
{
  var button = document.querySelector("div.controls button[name = 'switcher']");

  var params = document.querySelector("div.parameters");
  var textarea = document.querySelector("div.text_Inputs");
  if (params.style.display === "none")
  {
    button.textContent = "Use Text Input"
    textarea.style.display = "none";
    params.style.display = "block";
  }else
  {
    button.textContent = "Use Parameters"
    textarea.style.display = "block";
    params.style.display = "none";
  }


}

function ResetDisplayValue()
{
  densityValue.textContent = twoDecimal(densitySlider.value) ;
  blendValue.textContent = twoDecimal(blendSlider.value);
  edgeOneValue.textContent = twoDecimal(edgeOneSlider.value);
  edgeTwoValue.textContent = twoDecimal(edgeTwoSlider.value);
  dispMulValue.textContent = twoDecimal(dispMulSlider.value);
  dispXValue.textContent = twoDecimal(dispXSlider.value);
  circleDisValue.textContent = twoDecimal(circleDisSlider.value);
  subdivValue.textContent = twoDecimal(subdivSlider.value);
  rgSepScaleValue.textContent = twoDecimal(rgSepScaleSlider.value);
  noiseWeightValue.textContent = twoDecimal(noiseWeightSlider.value);

}

function UpdateShaderValue ()
{
  ResetDisplayValue();

    UpdateShader(
      densitySlider.value,
      blendSlider.value,
      edgeOneSlider.value,
      edgeTwoSlider.value,
      dispMulSlider.value,
      dispXSlider.value,
      circleDisSlider.value,
      subdivSlider.value,
      rgSepScaleSlider.value,
      noiseWeightSlider.value
      );
}
