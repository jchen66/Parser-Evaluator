/*
 * JiaYin CHEN
 * 260690708
 * assignment 2 question 2
 */


/*ASSUMES THAT AT LEAST ONE TOKENSET IS PRESENT */
function scan(s, TOKENSET){
  var newS=s;
  //parse all the variables in tokenset
  for(t in TOKENSET){
    //if the value of t is true
    //AND it matches something (i.e it is null)
    if (TOKENSET[t] && newS.match(window[t])!=null){
        var m= newS.match(window[t]);
        return {token: t,value: String(m[0])}; 
    }
  }
}
