var nlp = window.nlp;

let doc;
let terms;
let sentencesCount;
let sentence;
let nouns;
let verbs;
let adjs;
let nounAdj;
let adverbs;
let verbsAdverb;
let pronouns;
let prepositions;
let conjunc;
let abbrev;
let topics;
let subjects;
let people;
let wordCount;


let nounVerbRatio;
let adjNoneRatio;
let verbadvVerbRatio;
let pronSentRatio;
let prepSentRatio;
let wordsSentRatio;
let nounSentRatio;
let nounAdjAdjsRatio;
let conjSentRatio;
let verbSentRatio;

let mostFrequentNounMatch;
let mostFrequentVerbMatch;
let mostFrequentNouns;
let mostFrequentVerbs;
let verbConjugates;



function UpdateNLP()
{
  doc = nlp(targetText);
  wordCount = doc.wordCount();
  terms = doc.terms().out("array");
  nouns= doc.nouns().out('array');
  verbs= doc.verbs().out('array');
  adjs = doc.adjectives().out('array');
  nounAdj = doc.nouns().adjectives().out('array');
  adverbs = doc.adverbs().out('array');
  verbsAdverb = doc.verbs().adverbs().out('array');
  pronouns= doc.pronouns().out('array');
  conjunc = doc.conjunctions().out('array');
  prepositions = doc.prepositions().out('array');
  abbrev = doc .abbreviations().out('array');
  topics = doc.topics().out('array');
  sentence = doc.sentences().json();
  sentencesCount = doc.sentences().length;

  verbConjugates = doc.verbs(mostFrequentVerbs).conjugate();

  mostFrequentNouns = GetMostFrequent(nouns);
  mostFrequentVerbs = GetMostFrequent(verbs);

  //Sentence structures;
  // lerp the scale of the grid from 15 - 2 base on words/sentence.
  gl.uniform1f(gl.getUniformLocation (program,"displacementMapX"),wordCount);

  wordsSentRatio = GetRatio (wordCount,sentencesCount,0.0,28.0,15.0,2.0);
  gl.uniform1f(gl.getUniformLocation (program,"cell_density"),wordsSentRatio);
  densitySlider.value = wordsSentRatio;
  densityValue.textContent = twoDecimal(wordsSentRatio);

  // lerp the chunk noise subdivisions from 0-5 base on prepositions/sentence.
  prepSentRatio = GetRatio(prepositions.length,sentencesCount,0.7,3.0,0.0,4.0);
  gl.uniform1f(gl.getUniformLocation (program,"subdivisions"),Math.round(prepSentRatio));
  subdivSlider.value = prepSentRatio;
  subdivValue.textContent =twoDecimal(Math.round(prepSentRatio));

  // lerp the inner-edge of smoothstep from 0-0.5 base on nouns/sentenc.
  nounSentRatio = GetRatio(nouns.length,sentencesCount,1.0,4,0.0,0.3);
  nounSentRatio = nounSentRatio > 0.4? 0.4:nounSentRatio;
  gl.uniform1f(gl.getUniformLocation (program,"edge_one"),nounSentRatio);
  edgeOneSlider. value = nounSentRatio;
  edgeOneValue.textContent = twoDecimal(nounSentRatio);

  // lerp the outer-edge of smoothstep from 1-nounSentRatio to 1 base on nounsAdj/Adjs.
  nounAdjAdjsRatio = GetRatio(nounAdj.length,adjs.length,0.4,1.0,0.7,0.3);
  gl.uniform1f(gl.getUniformLocation (program,"edge_two"),nounSentRatio+nounAdjAdjsRatio);
  edgeTwoSlider.value = nounSentRatio+nounAdjAdjsRatio;
  edgeTwoValue.textContent = twoDecimal(nounSentRatio+nounAdjAdjsRatio);

  // lerp the blend factor from 0.1-0.8 base on conjunc/sentence.
  conjSentRatio = GetRatio(conjunc.length,sentencesCount,0.2,1.5,0.0,0.5);
  conjSentRatio = conjSentRatio > 0.5? 0.5:conjSentRatio;
  gl.uniform1f(gl.getUniformLocation (program,"circle_distortion_factor"),conjSentRatio);
  circleDisSlider.value = conjSentRatio;
  circleDisValue.textContent = twoDecimal(conjSentRatio);
  // lerp the RB_seperation from 0.0-0.3 base on pronouns/sentence.
  pronSentRatio = GetRatio (pronouns.length,sentencesCount,0.3,2.5,0.0,0.3);
  gl.uniform1f(gl.getUniformLocation (program,"RB_seperation_scale"), pronSentRatio );
  rgSepScaleSlider.value = pronSentRatio;
  rgSepScaleValue.textContent = twoDecimal(pronSentRatio);

// lerp blend from 0.1 -0.8 base on verbs/sentence;
  verbSentRatio = GetRatio(verbs.length, sentencesCount,1.0,4.0,0.1,0.4);
  verbSentRatio = verbSentRatio > 0.4? 0.4: verbSentRatio;
  gl.uniform1f(gl.getUniformLocation (program,"global_displace_multiplier"), verbSentRatio);
  dispMulSlider.value = verbSentRatio;
  dispMulValue.textContent = twoDecimal(verbSentRatio);

  // lerp uv_Offset from 0-1 base on verbsAdverb/verbs;

  verbadvVerbRatio = GetRatio(verbsAdverb.length,verbs.length,0.0,1.0,0.0,0.5);

  gl.uniform1f(gl.getUniformLocation (program,"blend"),   verbadvVerbRatio);
  gl.uniform1f(gl.getUniformLocation (program,"noise_weight"),   verbadvVerbRatio);
  blendSlider.value = verbadvVerbRatio;
  blendValue.textContent = twoDecimal(verbadvVerbRatio);
  noiseWeightSlider.value = verbadvVerbRatio;
  noiseWeightValue.textContent =twoDecimal(verbadvVerbRatio);

  gl.drawElements(gl.TRIANGLES,indices.length, gl.UNSIGNED_SHORT,0);

}

var twoDecimal = (value) => (Math.round(value* 100) / 100).toFixed(2);
const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

function GetRatio(a,b,x1,y1,x2,y2)
{
  var ratio = 0;
  var aValue = a;
  var bValue = b;

  if (aValue != 0 &&  bValue!= 0)
  {
    ratio = aValue/bValue;
    ratio = map(ratio,x1,y1,x2,y2);
  }
  else if (aValue == 0)
  {
    ratio = 0;
  }
  else if (bValue == 0)
  {
    ratio = 1;
  }
  return ratio;
}

// Will be used in newer versions;


function GetMostFrequent(terms)
{
  var termDataArray = [];
  var mostFrequent = 1;
  for (var i = 0; i< terms.length; i++ )
  {
    var termData = {
      "name": terms[i],
      "count": 0
    }
    for (var j = 0; j< terms.length; j++ )
    {
      if (terms[i] === terms[j] && i != j)
      {
        termData.count += 1;
      }
    }
    mostFrequent = Math.max(mostFrequent,termData.count);
    termDataArray.push(termData);
  }
  var allFrequentItem =termDataArray
  .filter (a => a.count == mostFrequent)
  .map(a => a.name)
  .filter((v,i,a)=> a.indexOf(v)===i);
return allFrequentItem;
}
