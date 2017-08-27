/*
 * assignment 2 question 4
 */


/*like a depth first search*/
function printAST(firstNode){
  var pString="";
  var stack=[];
  var sString="";
  var tString="";
  stack.push(firstNode);
  //ssString=sString+" "+firstNode.name;
  var cNode=firstNode;
  while(stack[0] != undefined){
    //get the first value in the stack
    cNode=stack.pop();
    sString=sString+" "+cNode.name;
    if(cNode.name=="itext"){
      tString=tString+"true ";
    }
    else{
      tString=tString+"false ";
    }
    
    
    
    //if the nextNode is not null, push it into the stack
    if(cNode.next!=(null || undefined)){
      stack.push(cNode.next);
   
    }
    
    //IF IT IS OUTER
    if(cNode.name=="outer"){
      //push a non-null templatedef to the stack
      if(cNode.templatedef!=null){
        stack.push(cNode.templatedef);
      }
      
      //push a non-null templateinvocation to the stack (push this after templatedef because using a stack)
      if(cNode.templateinvocation!=null){
        stack.push(cNode.templateinvocation);
      }
      
      
      //if the outertext is not null ---> print the outertext
      if(cNode.OUTERTEXT!=null){
        pString= pString+cNode.OUTERTEXT;
      }
    }
    
    //TEMPLATEINVOCATION CASE
    else if(cNode.name=="templateinvocation"){
      
      //the order of how we push the node onto the stack matters
      //push a non-null targs to the stack
      if(cNode.targs!=null){
        stack.push(cNode.targs);
      }
      //push a non=null itext to the stack
      if(cNode.itext!=null){
        stack.push(cNode.itext);
      }
      
      
      //prints a "{{" or a "}}" depending on its cNode.status
      if(cNode.status=="{{"){
        pString= pString+"{{";
      }
      if(cNode.status=="}}"){
        pString= pString+"}}";
      }
      
    }
    
    
    //ITEXTCASE
    else if(cNode.name=="itext"){
      //push a non-null templateinvocation to the stack
      if(cNode.templateinvocation!=null){
        stack.push(cNode.templateinvocation);
      }
      //push a non-null templatedef to the stack
      if(cNode.templatedef!=null){
        stack.push(cNode.templatedef);
      }
      //push a non=null tparam to the stack
      if(cNode.tparam!=null){
        stack.push(cNode.tparam);
      }
      
      if(cNode.INNERTEXT !=null){
      pString=pString+cNode.INNERTEXT;
      }
    }
    
    //TEMPLATEDEF CASE
    else if(cNode.name=="templatedef"){
      //push a non-null nextdtext to the stack
      if(cNode.nextdtext!=null){
        stack.push(cNode.nextdtext);
      }
      //push a non-null dtext to the stack
      if(cNode.dtext!=null){
        stack.push(cNode.dtext);
      }
      
      //print a "{:" or a ":}" or nothing depending on the situation
      if(cNode.status!=null){
        if(cNode.status=="{:"){
          pString=pString+"{:";
        }
        if(cNode.status==":}"){
          pString=pString+":}";
        }
        
      }
      
      //print a "|" or nothign depending on the situation
      if(cNode.PIPE=="|"){
        pString=pString+"|";
      }
    }
    
    //DTEXT CASE
    else if(cNode.name=="dtext"){
      //push a non-null templateinvocation to the stack
      if(cNode.templateinvocation!=null){
        stack.push(cNode.templateinvocation);
      }
      //push a non-null templatedef to the stack
      if(cNode.templatedef!=null){
        stack.push(cNode.templatedef);
      }
      //push a non=null tparam to the stack
      if(cNode.tparam!=null){
        stack.push(cNode.tparam);
      }
      
      //print a INNERDTEXT IF ITS NOT NULL
      if(cNode.INNERDTEXT!=null){
        pString=pString+cNode.INNERDTEXT;
      }
    }
    
    //TPARAM CASE
    else if(cNode.name=="tparam"){
      pString= pString+"{{{"+cNode.PNAME+"}}}";
    }
    
    //TARGS CASE
    else if(cNode.name=="targs"){
      //push a non-null itext to the stack
      if(cNode.itext!=null){
        stack.push(cNode.itext);
      }
      pString=pString+"|";
    }
  }
  return pString;
  //return sString;
  //return tString;
}


var n6={name:"templateinvocation",
    itext: null,
    targs:null,
    next:null,
    status:"}}"
   };
var n5={name:"itext",
    INNERTEXT:"foo",
    templateinvocation: null,
    templatedef:null,
    tparam:null,
    next:null
   };
var n4={name:"outer",
    OUTERTEXT: "def",
    templateinvocation:null,
    templatedef:null,
    next:null};

var n2={name:"outer",
        OUTERTEXT: null,
       templateinvocation:n3,
       templatedef:null,
       next:n4};
var n1={name:"outer",
        OUTERTEXT: "abc",
       templateinvocation:null,
       templatedef:null,
       next:n2};
var n3={name:"templateinvocation",
    itext: n5,
    targs:null,
    next:n6,
    status:"{{"
   };





var t= printAST(n1);
t;



/*
abc{{foo}}def
*/