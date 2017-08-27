/*
*A3Q3
*/

//#if ---> 
/*
#if
condition: non-empty str==true --> do then
            empty str---> do else
ASSUME THAT THERE ARE ONLY TWO
param: 3 targs node
      --> eval the first targs node--> it is the condition
*/
function evalIF(ast, env0){
  var ifStr="";
  var cond= ast; //an targ node
  var doThen=ast.next;
  var doElse=ast.next.next;

  //get the value in cond
  var condValue=evalIText(cond.itext,env0);
  //if empty--> do else... 
  //if non-empty --> do then
  if(condValue==null || condValue==""){
    var tempStr=evalIText(doElse.itext,env0);
    ifStr=ifStr+tempStr;
  }
  else{
    var tempStr=evalIText(doThen.itext,env0);
    ifStr=ifStr+tempStr;
  }

  return ifStr;

}

//#exp
/*
param: 'targs' node , the env
return: a java evaluated str
ASSUME JUST ONE TARGS
*/
function evalEXP(ast,env0){
  var expStr="#exp:";
  var body=ast.itext;

  //evaluate it as an itext
  expStr=evalIText(body, env0);

  return eval(String(expStr));
}

//#ifeq
/*
ASSUME THAT THE INVOC IS A 
{{#ifeq|a|b|then|else}}
ALSO ASSUME THAT THERE ARE 4 TARGS

param: a 'targs' node from a invocation
return: then--> if a=b
        else--> if a!=b
*/
function evalIFEQ(ast, env0){
  var ifeqStr="";
  var evalA=ast;//is a targsnode
  var evalB=ast.next;//is a targsnode
  var doThen=ast.next.next;
  var doElse=ast.next.next.next;

  var aStr=evalIText(evalA.itext,env0);
  var bStr=evalIText(evalB.itext,env0);

  if(aStr==bStr){
    var tempStr=evalIText(doThen.itext,env0);
    ifeqStr=ifeqStr+tempStr;
  }
  else{
    var tempStr=evalIText(doElse.itext,env0);
    ifeqStr=ifeqStr+tempStr;
  }

  return ifeqStr;
}
