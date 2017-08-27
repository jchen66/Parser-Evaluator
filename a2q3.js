/*
 * Assignment 2 Question 3
 */

/*MUST ENTER PREVIOUS CODE*/





/*
tries to match the brackets --> assume that the first Open brackets if already taken out
@params: string s and an array(size 2) that contains the open bracke(at [0]) and a closing bracket([1]) we are looking for
assumptions: there is always a closing bracket
return: the index of the first closing bracket

ex: matchEnd("abc{{def}}ghi}}", ["{{","}}"]);
  returns -- > 13--> position of the first correctly matched "}"
*/

function matchEnd(s, tokenset){
  var newS=s;
  var start=tokenset[0];
  var end=tokenset[1];
  var tlength=start.length;
  var count=0;
  var i=0;
  for(i; i<newS.length; i=i+1){
    //if matches first char of start
    if(newS.charAt(i)==start.charAt(0)){
      //check if it matches the rest of it
      if(newS.slice(i, i+tlength)==start){
        //add to count
        count=count+1;
        i=i+tlength-1;  //update the i so that it won't parse at the next char
      }
      //else it doesn't mattter--> check the next char
    }
    
    
    //if matches first char of end
    if (newS.charAt(i)== end.charAt(0)){
      // check if it matches the rest of it
      if (newS.slice(i, i+tlength)==end){
        //if count !=0 ... update count
        //otherwise return the index i == the FIRST occurence of end
        if(count !=0){
          count=count-1;
          i=i+tlength-1;
        }else{
          return i;
        }
      }
    }
    
  }
  
}





/*
  s= string
  return first Node of the parse Tree for:
  <outer> :: = (OUTERTEXT| <template invocation> | <templatedef>)*
*/
function parseOuter(s){
  var newS=s;
  var outerTokenSet={OUTERTEXT: true};
  //construct the obj/node for the tree
  var firstNode={
    name: "outer",
    OUTERTEXT: null,
    templateinvocation:null,
    templatedef:null,
    next:null
  };
  
  var parsedObj="";
  //CASE 1 --> there is only an outertext
  //if newS.match(OUTERTEXT)==null  --> then there are no <templateinvoc> or <templatedef>
  if(newS.match(OUTERTEXT)==null){
    firstNode.OUTERTEXT=newS;
    return firstNode;
    //exits
  }
  //CASE2 --> THERE IS SOME <templateinvoc> or <templatedef>
  else{
    
    //if the first element is a TSTART or a DSTART
    if(newS.match(OUTERTEXT)[0]==""){//check if the first character is a template invoc or templatedef
    //so the first character is a template invoc
     if(newS.match(TSTART) != null){
       //then the next character is a <templateInvoc>
       //get the node returned from the parseTemplateInvocation function
       var templateInvoc= parseTemplateInvocation(newS);
       //assign it to the invocation
       firstNode.templateinvocation=templateInvoc;
       
       //take out the <templateinvocation> part from the string
       newS= newS.substring(2); //take out the beginning "{{"
       var token= ["{{", "}}"];
       var endBracketsPos= matchEnd(newS,token);
       newS=newS.substring(endBracketsPos);
       newS=newS.substring(2);//take out the end "}}"
      
       //add a closing bracket node to <template invocation>
       var closingNode={name:"templateinvocation",
                        itext:null,
                        targs:null, 
                        status:"}}",
                        next:null
                       };
       firstNode.templateinvocation.next=closingNode;
     }
     //then the first character is a templatedef
     else if(newS.match(DSTART) !=null){
       //then the next character is a <templatedef>
       //get the node returned from the parseTemplateDef function
       var templateDef= parseTemplateDef(newS);
       firstNode.templatedef=templateDef;
      
       //take out the <templatedef> part from the string
       newS= newS.substring(2); //take out the beginning {:"
       var token=["{:",":}"];
       var endBracketsPos=matchEnd(newS,token);
       newS=newS.substring(endBracketsPos);
       newS=newS.substring(2);//take out the end":}"
      
       //add a closing bracket node to <template def>
       var closingNode={name:"templatedefinition",
                        dtext:null,
                        PIPE:null, 
                        nextdtext:null,
                        next:null,
                        status:":}"
                       };
       firstNode.templatedefinition.next=closingNode;
     }
    }
    //otherwise it is an OUTERTEXT
    else{
      var outertext= scan(newS,outerTokenSet);
      //assign outertext to the first Node
      firstNode.OUTERTEXT=outertext.value;
      //trim the outertext off the string
      newS=newS.substr(outertext.value.length);
    } 
  }
  //if there are still string left... then it's the case of ()*
  //call the function again
  if(!isStringEmpty(newS)){
    //get the firstNode of the iteration and append it to the last node of firstNode
    var nextIteration= parseOuter(newS);
    var cNode= firstNode;
    while(cNode.next!=null){
      cNode=cNode.next;
    }
    cNode.next= nextIteration;  
  }
  //if we are here, then means that we parsed through the entire string
  return firstNode;
}


//<template invocation> ::=TSTART <itext> <targs> TEND
/*
@param: string
@return: first AST node
parses the inputed string according to the <templateinvocation> rules
*/
function parseTemplateInvocation(s){
  var newS=s;
  var templateInvocationTokenSet={TSTART:true, TEND:true};  
  
  //returns the TSTART obj
  var tStart= scan(newS,templateInvocationTokenSet);
  //updates the new string by trimming the {{
  newS=newS.substr(tStart.value.length);
  
  //set the first Node to return
  var firstNode={name: "templateinvocation",
                 itext:null,
                 targs:null,
                 next:null, 
                 status:"{{"
                };
  
  var lastNode={name: "templateinvocation",
                itext:null,
                targs:null,
                next:null,
                status:"}}"
               }
  
  //attach lastNode to firstNode
  firstNode.next=lastNode;
  
  //get the string between <TSTART> and <TEND>
  var token= ["{{", "}}"];
  var index= matchEnd(newS, token); //returns the index of the matching "}}"
  var subStr= newS.slice(0,index); //containst the <itext> <targs> part
  newS=newS.substring(index); //should only contain "}}" now
  
  
  //get <itext> --> can be empty
  var iTextNode= parseIText(subStr);
  
  //if the returned Node is empty (has null everywhere and the string is empty) set the firstNode.itext to null
  if(iTextNode.templateinvocation==null && iTextNode.templatedefinition==null && iTextNode.tparam==null && isStringEmpty(iTextNode.INNERTEXT)){
    firstNode.itext=null;
  }else{
    //attach itext to the first Node
    firstNode.itext=iTextNode;
  }
  
  
  //get <targs> --> can be empty 
  //attach targs to the firstNode
  var tNode=parseTArgs(newS);   //parseTArgs should return a 
  //if there are no itext in the targsNode --> then its an empty string ---> set targs param to null
  //don't have to check for "|" since for targs--> they itext MUST be preceded by a PIPE
  if(tNode.itext==null && tNode.next==null){
    firstNode.targs=null;
  }else{
    //attach targsNode to firstNode
    firstNode.targs=tNode;
  }
  
  return firstNode;
}


//<templatedef> ::= DSTART <dtext> (PIPE <dtext>)+ DEND
/*
@param: string
@return: AST tree Node (first)
follows the templatedef rule syntax
*/
function parseTemplateDef(s){
  var newS=s;
  //provide accepted set of tokens
  var templateDefTokenSet={DSTART:true, DEND:true, PIPE:true};
  
  //CREATE THE DSTART NODE
  //this should return a DSTART obj
  var parsedObj=scan(newS,templateDefTokenSet);
  //update the strin that we parsed by trimming the string off its first value
  newS= newS.substr(parsedObj.value.length);
  var firstNode={name: "templatedef",
                 dtext:null,
                 nextdtest:null,
                 status:"{:",
                 next:null
                };
  
  var lastNode={name:"templatedef",
                dtext:null,
                nextdtest:null,
                status:":}",
                next:null
               }
  
  //assign lastNode as firstNode's next
  firstNode.next=lastNode;
  
  //get the chunk of text before DEND
  var token= ["{:",":}"];
  var indexofDEND= matchEnd(newS,token);
  var subStr= newS.slice(0,indexofDEND); //containst the <dtext> (PIPE<dtext>)+ part
  newS=newS.substring(indexofDEND); //should only contain "}}" now
  

  //CREATE THE FIRST DTEXT NODE
  //this should return a dtext node
  var parsedObj=parseDText(newS,templateDefTokenSet);
  firstNode.dtext=parsedObj;
  
  //by here we would have parsed throught the entirety of the string
  //return the first node
  return firstNode;
  
}

//<tparam> ::= PSTART PNAME PEND
/*
Parses the string according to the rules of tparam
@returns a AST node
*/
function parseTParam(s){
  var newS=s;
  var paramTokenSet= {PSTART: true, PNAME: true, PEND:true};
  
  
  
  //CREATE THE PSTART NODE
  //this should return a PSTART obj
  var parsedObj=scan(newS, paramTokenSet);
  //update the string that we parsed by trimming the string off its first value
  newS=newS.substr(parsedObj.value.length);
  
  //CREATE THE PNAME NODE
  //this should return a PNAME obj
  parsedObj=scan(newS,paramTokenSet);
  //update the string that we parsed by trimming the string off its first value
  newS=newS.substr(parsedObj.value.length);
  var firstNode={name:"tparam",
                  PNAME: String(parsedObj.value),
                  next:null
                 };
 
  
  //CREATE THE PEND NODE
  //this should return a PEND obj
  parsedObj=scan(newS,paramTokenSet);
  //update the string that we parsed by trimming the string off its first value
  newS=newS.substr(parsedObj.value.length);

  //update the next value from secondNode
  return firstNode;

  
}

/*parses the string according to the rule of dtext
*/
function parseDText(s){
  var firstNode={name:"dtext",
                 INNERDTEXT:null,
                 templateinvocation: null,
                 templatedef:null,
                 tparamm:null,
                 next:null,
                };
  //if the string is empty --> then nothing to look for
  if(isStringEmpty(s)){
    return firstNode;
  }else{
    firstNode.INNERDTEXT=s;
  }
  return firstNode;
}


/*
parses the string according to the rule of targs
*/
function parseTArgs(s){
  var firstNode={name:"targs",
                 itext:null,
                 next:null,
                };
  //if the string is empty --> then nothing to look for
  if(isStringEmpty(s)){
    return firstNode;
  }else{
    firstNode.itext=null;
  }
  return firstNode;
}


/*
parses string according to the rules of itext
*/
function parseIText(s){
  
  var firstNode= {name: "itext",
                  INNERTEXT:"",
                  templateinvocation:null,
                  templatedef: null,
                  tparam:null, 
                  next:null,
                 }
  //if the string is empty ---> then nothing to look for
  if(isStringEmpty(s)){
    return firstNode;
  }else{
    firstNode.INNERTEXT=s;
  }
  return firstNode;
}

/*since parse can be connected to many rules when you apply recursion
sorry, didn't had the time to fix all the bugs and write an elaborate code'*/
function parse(s){
 
  var firstNode=parseOuter(s);
  return firstNode; 
  
}


/*
@param: string
@return: boolean
returns if the string is empty
*/
function isStringEmpty(s){
  if(s==null){
    return true;
  }
  
  for (var x=0; x<s.length;x++){
    if(s.charAt(x)!=""|| " "){
      return false;
    }
  }
  return true;
}



var t= "{{foo}}";
var m= parseTemplateInvocation(t);
m.itext.INNERTEXT;

