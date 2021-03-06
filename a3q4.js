/*
 * A3Q2
 */
/*creates a new environment
 * @params: parent--> the parent of the new environment
 */
function createEnv(parent) {
  var envName = String(Math.random()); //creates a random floaitng point number 
  var binding = {
  }; //creates an empty Array
  return {
    name: envName, //must be a floating point number given byy Math.random()
    bindings: binding, //binding is an array
    parent: parent
  };
} /*
 * searches through given environment and then parents
 *@return:  null if no binding found
 *@params: binding key name
 */
function lookup(name, env) {
  if (Object.keys(env.bindings).length == 0 && env.parent == null) {
    return null;
  } //get the bindings of the environment

  var bObject = env.bindings;
  for (var key in bObject) {
    if (key == name) {
      return bObject[name];
    }
  }
  if (env.parent == null) {
    return null;
  }
  return lookup(name, env.parent);
} 
////////////////////////////////////////////////////////////////////////////////////////////
/*param: an ast node with name=='dtext' and the env it is declared in
 return: a INNERDTEXT, templateinvoc, templatedef or a tparam, 
 */
function getName(ast,env0){
  var cAST=ast;
  var nameStr="";
  while(cAST!=null){
    var dStr=evalDText(cAST,env0);
    nameStr=nameStr+dStr;
    cAST=cAST.next;
  }
  return nameStr;  
}


/*input: start of a dparams ast node
 * @return: an array of all the parameters present
 * TAKE CARE OF CASES IF THE PARAMS ARE TEMPLATE DEF OR TEMPLATE INVOC!!!!
*/  
function getParams(ast,env0) {
  var cAST =ast;
  var arrayOfParams =[];

  //while there is still an dparam AST node
  //skips the last node(which is the body)
  while (cAST.next != null) {
    //add cNode's dtext(should be a parameter name) dtext can be INNERDTEXT, templateinvoc, templatedef or tparam
    var paramStr=evalDText(cAST.dtext,env0);
    arrayOfParams.push(String(paramStr));
    cAST = cAST.next;
  }
  return arrayOfParams;
} 

/*params: an ast node,assume that it is a dparams node
 return: the last dparams node --> should be the body
*/
function getBody(ast,env0){
  var cNode= ast;
  //the body is the last dparams, so we have to parse though all the node that has dparams as name
  while(cNode.next!=null){
    cNode=cNode.next;
  }
  return cNode.dtext; 
}


/*
param: an templateinvocation node, and the environment it is in
CREATES A NEW ENVIRONMENT
return: a string in which it is evaluated it
*/
function evalTemplateInvocation(ast, env0){
  //create a new env that points to the parent env
  var env1=createEnv(env0);
  //add env1 binding to env0
  //env0.bindings[String(env1.name)]=env1; 

  var iStr="";

  //get the name of the function to look for
  var invocName=getFuncName(ast.itext,env1);
  //if empty ---> might be because  ---> it is a anonymous function or function declaration 
  
  //if the templatedef of the function is not null ---> check if it is a anonymous function
  //check if it is a template declaration 
  if(ast.itext.templatedef!=null && invocName==""){
    //if anonymous function ---->

    // if it has a name ----> look in current
    //get the name of the 
    var closureName=getName(ast.itext.templatedef.dtext);
    closureName=closureName.substr(1);
    //if anonymous function ---->
    if(closureName==""){
      //it is a anonymous function : it must be in an invocation for it to work
      var aBody= getBody(ast.itext.templatedef.dparams,env1);
      var aParams= getParams(ast.itext.templatedef.dparams,env1);
      // stringify it and unstringify it?

      //try to look for bindings for the params
      for(var i=0; i<aParams.length;i=i+1){
        var v=lookup(String(aParams[i]),env1);
        env1.bindings[String(aParams[i])]==v;
      }
      var bStr= evalBody(aBody, env1);
    
      iStr=iStr+bStr;

      return iStr;
    }

    //look for the function name
    var temp= lookup(closureName, env1);
    //unstringify the struct
    if(typeof(temp)=='string'){
        temp=unstringify(temp);
    }

    var bStr=evalBody(temp.body,env1);


    return bStr;
  }

  //LOOK FOR SPECIAL FUNCTIONS!!! (LOOK FOR #if, #ifeq, #exp)
  switch(invocName){
    case "#if":
      //eval targs as #if's args
      var ifEval=evalIF(ast.targs,env1);
      iStr=iStr+ifEval;
      return iStr;
      break;
    case "#ifeq":
      //eval targs as a #ifeq args
      var ifeqEval=evalIFEQ(ast.targs,env1);
      iStr=iStr+ifeqEval;
      return iStr;
      break;
    case "#expr":
      var expEval=evalEXP(ast.targs,env1);
      iStr=iStr+expEval;
      return iStr;
      break;
  }
  //if we are here, then the code we are dealing with is not a special function


  //get the params for the function
  //ast.targs-->contains all the parameters necessary for ast.itext
  var invocArgs= getArgs(ast.targs,env1);


  //match the params of invoc to def
  var defStruct=lookup(String(invocName),env1);
  if(typeof(defStruct)=='string'){
    defStruct=unstringify(defStruct);
  }

  //if we can't find a function with the name==? return empty str
  if(defStruct==null){
    return "{{"+"}}";
  }
  //else continue with assigning function
  //defParam is a struct of a definition containing {the params, the bod and the env}
  var defParam=defStruct.params;
  for(var i=0; i<defParam.length; i=i+1){
    //add new bindings in the current environment
    //assign the value of args to param
    env1.bindings[defParam[i]]=String(invocArgs[i]);
  }

  //defBody is an AST NODE --> a 'dparams' node
  var defBody=defStruct.body;
  
  //evaluate the body
  //while(defBody!=null){
  var bStr= evalBody(defBody, env1);
    
  iStr=iStr+bStr;
    
    //get next part
  //defBody=defBody.next;
  //}

  return iStr;
}


/*
param: a 'dparams' node --> not to be confused by the real parameters... dparamas contains body, the environment
return: a string
*/
function evalBody(ast, env0){
  var cAST=ast; 
  //initialize a str to return 
  var bStr="";

  //evaluate the dparams node
  //dparams contains dtext --> we can use our evalDText function

  var temp= evalDText(cAST, env0);
  bStr=bStr+temp;
  
  //cAST=cAST.next;
  
  return bStr;

}

/*
param: 'targs' node, and its environment
return: an array of all the args 
*/
function getArgs(ast,env0){
  var cAST =ast;
  var arrayOfArgs =[];

  //while there is still an dparam AST node
  //skips the last node(which is the body)
  while (cAST != null) {
    //add cNode's itext(should be an arg name) itext can be INNERTEXT, templateinvoc, templatedef or tparam
    var argStr=evalIText(cAST.itext,env0);
    arrayOfArgs.push(String(argStr));
    cAST = cAST.next;
  }
  return arrayOfArgs;
}
/*
param: 'itext' node, and its environment
return: the string it is evaluated to --> INNERTEXT, templateinvocation, templatedef,tparam
*/
function getTypeIText(ast){
  var typeStr="";
  if(ast.INNERTEXT!=null){
    return 'INNERTEXT';
  }
  else if(ast.templateinvocation!=null){
    return 'templateinvocation';
  }
  else if(ast.templatedef!=null){
    return 'templatedef';
  }
  else if(ast.tparam!=null){
    return 'tparam';
  }
  return typeStr;
}

/*
param: 'itext' node, and its environment
return: a str containing the name of the functoin
*/
function getFuncName(ast,env0){
  var cAST=ast;
  var nameStr="";
  while(cAST!=null){
    var dStr=evalIText(cAST,env0);
    if(dStr!=null ||dStr!=""){
      nameStr=nameStr+dStr;
      return nameStr;
    }
    cAST=cAST.next;
  }
  return nameStr;  
}
/*
param: 'itext' node, and its environment
return: the string it is evaluated to
*/
function evalIText(ast, env0){
  var cAST=ast;
  var itextStr="";

  //isalways an 'itext' Node
  while(cAST!=null){
    var astType=getTypeIText(cAST);
    switch(astType){
      case 'INNERTEXT':
        //easyL add string stored in INNERDTEXT to the str
        itextStr=itextStr+cAST.INNERTEXT;
        break;
      case 'templateinvocation':
        //look up for function
        var invocStr=evalTemplateInvocation(cAST.templateinvocation, env0);
        itextStr=itextStr+invocStr;
        break;
      case 'templatedef':
        //define the function in the environment
        //don't add anything to the return str--> only add binding
        evalTemplateDef(cAST.templatedef,env0);
        break;
      case 'tparam':
        //lookup for binding in the environment
        var paramStr= evalTParam(cAST.tparam,env0);
        itextStr=itextStr+paramStr;
        break;
    }
    cAST=cAST.next;
  }
  return itextStr;
}
/*
param: 'dtext' ast node, it's environment
return: a string to what dtext is
*/
function evalDText(ast, env0){
  var cAST=ast;
  var dtextStr="";

  //is always a dtext node
  while(cAST!=null){
    var astType=getTypeDText(cAST);

    switch(astType){
      case 'INNERDTEXT':
        //easyL add string stored in INNERDTEXT to the str
        dtextStr=dtextStr+cAST.INNERDTEXT;
        break;
      case 'templateinvocation':
        //look up for function
        var invocStr=evalTemplateInvocation(cAST.templateinvocation, env0);
        dtextStr=dtextStr+invocStr;
        break;
      case 'templatedef':
        //define the function in the environment
        //don't add anything to the return str--> only add binding
        evalTemplateDef(cAST.templatedef,env0);
        break;
      case 'tparam':
        //lookup for binding in the environment
        var paramStr= evalTParam(cAST.tparam,env0);
        dtextStr=dtextStr+paramStr;
        break;
    }
    cAST=cAST.next;
  }
  return dtextStr;
}



/*
param: tparam ast node, the env it is in
return: the real value that should be in the tparam (a str)
*/
function evalTParam(ast, env0){
  var param=String(ast.pname);
  var value=lookup(String(param), env0); //should be a str, since its a pname
  if(value==null){
    value="[no binding]";
  }
  return String(value);
}

/*
param: dtext ast Node
return: string with innerdtext, templateinvoc, templatedef or tparam
*/
function getTypeDText(ast){
  var returnStr="";
  if(ast.INNERDTEXT!=null){
    return "INNERDTEXT";
  }
  else if(ast.templateinvocation!=null){
    return "templateinvocation";
  }
  else if(ast.templatedef!=null){
    return "templatedef";
  }
  else if(ast.tparam!=null){
    return "tparam";
  }
  //should never end up here
  return returnStr;
}


///////////////////////////////////
//@param: a "outer" ast node, and its environment
//@return: the evaluated thing
function evalWML(ast, env0){
  //the string that we are going to return 
  var returnStr="";
  var cAST=ast; //the current ast node



  //while there is and ast---> eval the ast node... it is either a templateinvoc or templatedef or an OUTERTEXT
  //will always 
  while(cAST!=null){
    
    //get if the outer ast node is a invoc, def or OUTERTEXT
    var astName= getTypeOfOuter(cAST);

    switch(astName){
      case 'OUTERTEXT':
        //if the outer is an outertext--> directly append the value in Outertext to the returned String
        returnStr=returnStr+cAST.OUTERTEXT;
        break;
      case 'templateinvocation':
        //create a new environment and attach it to parent environment
        var invocNode= cAST.templateinvocation; 

        //the ast node should have the name templateinvoc
        //this should return a stirn git should be evaluated to 
        var invocStr= evalTemplateInvocation(invocNode,env0); 

        //add the invocation to the returning str
        returnStr=returnStr+invocStr;

        break;

      case 'templatedef':
        //get the templatedef node
        var defNode=cAST.templatedef;

        evalTemplateDef(defNode,env0);

        break;
    }

    //get the next node in the list
    cAST=cAST.next;
  }
  //return p;
  return returnStr;

}


/*
param: functionName str, astNode, env0
create a binding for the function to its body in it's parent environment
*/
function evalTemplateDeclaration(functionName, ast, env0){
    //no need to strip off the " ' "--> already did that before calling this function 
    //var subName=functionName.substr(1);
    //also create a binding fo rhte function Name in the parent's environment
  
    //if we are here, then the function def is not a closure -->continue as if binding a reg function 

    //get the params <-- an array
    var functionParams= getParams(ast.dparams,env0);
    //get the body: AST NODE
    var functionBody= getBody(ast.dparams,env0);
    //set the struct of the function(params: body: env:)
    var functionStruct={params: functionParams,
                       body: functionBody,
                        env: env0.parent //it's body it is declared in (the parent environment)
    };

    //set the binding of the function to its struct in the environment
    env0.parent.bindings[functionName]= stringify(functionStruct);
    return;
    
}

/*
    param: a function Nam
    return: true if it is an anonymous function, return false if it is  not a anonymous function
*/

function isAnonymousFunction(functionName){
    //if the function name is empty after "'" ---> return true
    //also trims the ws at the beginning of the function names
    if (functionName.substr(1).trim()==""){
        return true;
    }
    return false; 
}

/*param: astnode of a "templatedef", the environment the definition was declared in
  return: nothing, it makes the changes in the function
*/
function evalTemplateDef(astDef, env0){
  //create a binding functionName: struct
  //get the function's name
  var functionName= getName(astDef.dtext,env0);

  //check if it has a " ' " at the beginning of the function name
  if(isTemplateDeclaration(functionName)==true){
    //do nothing if it is an anonymous function ---> DEAL WITH IT IN TEMPLATE INVOCATION!!!!
    if(isAnonymousFunction(functionName)==true){
        return;
    }
    //otherwise it is a template declaration with a function name
    functionName=functionName.substr(1); //if it is a closure, take out the " ' ", and bind it as an normal functionName
    evalTemplateDeclaration(functionName, astDef,env0);

  }


  //if we are here, then the function def is not a closure -->continue as if binding a reg function 

  //get the params <-- an array
  var functionParams= getParams(astDef.dparams,env0);
  //get the body: AST NODE
  var functionBody= getBody(astDef.dparams,env0);
  //set the struct of the function(params: body: env:)
  var functionStruct={params: functionParams,
                      body: functionBody,
                      env: env0 //it's body it is declared in
  };

  //set the binding of the function to its struct in the environment
  env0.bindings[functionName]= functionStruct;
  return;
}

/*param: an ast node
return: return if it contains a outertext, templateinvocation or templatedef
*/
function getTypeOfOuter(ast){
  if(ast.OUTERTEXT!=null){
    return "OUTERTEXT";
  }
  else if(ast.templateinvocation!=null){
    return "templateinvocation";
  }
  else if(ast.templatedef!=null){
    return "templatedef";
  }
  return "";
}


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




// Convert a closure (template binding) into a serialized string.
// This is assumed to be an object with fields params, body, env.
function stringify(b) {
    // We'll need to keep track of all environments seen.  This
    // variable maps environment names to environments.
    var envs = {};
    // A function to gather all environments referenced.
    // to convert environment references into references to their
    // names.
    function collectEnvs(env) {
        // Record the env, unless we've already done so.
        if (envs[env.name])
            return;
        envs[env.name] = env;
        // Now go through the bindings and look for more env references.
        for (var b in env.bindings) {
            var c = env.bindings[b];
            if (c!==null && typeof(c)==="object") {
                if ("env" in c) {
                    collectEnvs(c.env);
                }
            }
        }
        if (env.parent!==null)
            collectEnvs(env.parent);
    }
    // Ok, first step gather all the environments.
    collectEnvs(b.env);
    // This is the actual structure we will serialize.
    var thunk = { envs:envs ,
                  binding:b
                };
    // And serialize it.  Here we use a feature of JSON.stringify, which lets us
    // examine the current key:value pair being serialized, and override the
    // value.  We do this to convert environment references to environment names,
    // in order to avoid circular references, which JSON.stringify cannot handle.
    var s = JSON.stringify(thunk,function(key,value) {
        if ((key=='env' || key=='parent') && typeof(value)==='object' && value!==null && ("name" in value)) {
            return value.name;
        }
        return value;
    });
    return s;
}

// Convert a serialized closure back into an appropriate structure.
function unstringify(s) {
    var envs;
    // A function to convert environment names back to objects (well, pointers).
    function restoreEnvs(env) {
        // Indicate that we're already restoring this environmnet.
        env.unrestored = false;
        // Fixup parent pointer.
        if (env.parent!==null && typeof(env.parent)==='number') {
            env.parent = envs[env.parent];
            // And if parent is unrestored, recursively restore it.
            if (env.parent.unrestored)
                restoreEnvs(env.parent);
        }
        // Now, go through all the bindings.
        for (var b in env.bindings) {
            var c = env.bindings[b];
            // If we have a template binding, with an unrestored env field
            if (c!==null && typeof(c)==='object' && c.env!==null && typeof(c.env)==='number') {
                // Restore the env pointer.
                c.env = envs[c.env];
                // And if that env is not restored, fix it too.
                if (c.env.unrestored)
                    restoreEnvs(c.env);
            }
        }
    }
    var thunk;
    try {
        thunk = JSON.parse(s);
        // Some validation that it is a thunk, and not random text.
        if (typeof(thunk)!=='object' ||
            !("binding" in thunk) ||
            !("envs" in thunk))
            return null;

        // Pull out our set of environments.
        envs = thunk.envs;
        // Mark them all as unrestored.
        for (var e in envs) {
            envs[e].unrestored = true;
        }
        // Now, recursively, fixup env pointers, starting from
        // the binding env.
        thunk.binding.env = envs[thunk.binding.env];
        restoreEnvs(thunk.binding.env);
        // And return the binding that started it all.
        return thunk.binding;
    } catch(e) {
        // A failure in unparsing it somehow.
        return null;
    }
}

/*
    param: a name of a function
    return: true if it is a closure, false if it isn't
*/
function isTemplateDeclaration(funcName){
    if(funcName.charAt(0)=="'"){
        return true;
    }
    else{
        return false;
    }
}



