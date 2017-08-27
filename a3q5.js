/*
 * JiaYin Chen
 * 260690708
 * A3Q5
 */


//MUST DEFINE THESE FUNCTION BEFORE CALLING THE PREFIX SUM FUNCTION
{:subN|n|churchNum|{{#ifeq|{{{n}}}|0|{{{churchNum}}}x|{{subN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}{:makeN|n|{{subN|{{{n}}}|}}:}{:isZero|n|{{#ifeq|{{{n}}}|x|true|false}}:}{:succ|n1|f{{{n1}}}:}{:addSub|n1|n2|counter|{{#ifeq|{{{counter}}}|{{{n1}}}|{{{n2}}}|{{addSub|{{{n1}}}|{{succ|{{{n2}}}}}|{{succ|{{{counter}}}}}}}}}:}{:add|n1|n2|{{addSub|{{{n1}}}|{{{n2}}}|x}}:}{:pSum|n1|counter|solution|{{#ifeq|{{{n1}}}|{{{counter}}}|lambdafx.{{add|{{{solution}}}|{{{counter}}}}}|{{pSum|{{{n1}}}|{{succ|{{{counter}}}}}|{{add|{{{solution}}}|{{{counter}}}}}}}}}:}{:prefixSum|lambdaNum|{{pSum|{{{lambdaNum}}}|x|x}}:}
//CALL THE FUNCTION USING THIS ---> change 5 for whatever you want to put in there
{{prefixSum|{{makeN|5}}}}



//readable form of the definitions 

//MAKEN FUNCTION AND HELPER FUNCTION 
{:subN|n|churchNum|{{#ifeq|{{{n}}}|0|{{{churchNum}}}x|{{subN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}
{:makeN|n|{{subN|{{{n}}}|}}:}
//ISZERO FUNCTION
{:isZero|n|{{#ifeq|{{{n}}}|x|true|false}}:}
//SUCC FUNCTION
{:succ|n1|f{{{n1}}}:}
//ADD FUNCTION AND HELPER FUNCTION
{:addSub|n1|n2|counter|{{#ifeq|{{{counter}}}|{{{n1}}}|{{{n2}}}|{{addSub|{{{n1}}}|{{succ|{{{n2}}}}}|{{succ|{{{counter}}}}}}}}}:}
{:add|n1|n2|{{addSub|{{{n1}}}|{{{n2}}}|x}}:}
//PREFIXSUM FUNCTION AND HELPER FUNCTION 
{:pSum|n1|counter|solution|{{#ifeq|{{{n1}}}|{{{counter}}}|lambdafx.{{add|{{{solution}}}|{{{counter}}}}}|{{pSum|{{{n1}}}|{{succ|{{{counter}}}}}|{{add|{{{solution}}}|{{{counter}}}}}}}}}:}
{:prefixSum|lambdaNum|{{pSum|{{{lambdaNum}}}|x|x}}:}




////////////////////////////////////////////////////////BELOW ARE MORE READABLE VERSION OF THE CODe////////////////////////////////////////////////////////










//one
{:makeN|n|churchNum|{{#ifeq|{{{n}}}|0|lambdafx.{{{churchNum}}}x|{{makeN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}

//helper function part:
{:isZero|n|{{#ifeq|{{{n}}}|x|true|false}}:}{:subN|n|churchNum|{{#ifeq|{{{n}}}|0|{{{churchNum}}}x|{{subN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}{:makeN|n|{{subN|{{{n}}}|}}:}{:succ|n1|f{{{n1}}}:}{:add|n1|n2|counter|{{#ifeq|{{{counter}}}|{{{n2}}}|{{{n1}}}|{{add|{{succ|{{{n1}}}}}|{{{n2}}}|{{succ|{{{counter}}}}}}}}}:}{:pSum|n1|counter|solution|{{#ifeq|{{{n1}}}|{{{counter}}}|lambdafx.{{{solution}}}|{{pSum|{{{n1}}}|{{succ|{{{counter}}}}}|{{add|{{{solution}}}|{{{counter}}}}}}}}}:}{:prefixSum|lambdaNum|{{pSum|{{{lambdaNum}}}|x|x}}:}
//^ must put that in the string before these are helper functions
//to test the function: use
{{prefixSum|{{makeN|YOUR NUMBER HERE!!! IN NORMAL INTEGER FORM, NO SPACES}} }}

//subN
//adds n amount of f infront of x --> n= interger intered
{:subN|n|churchNum|{{#ifeq|{{{n}}}|0|{{{churchNum}}}x|{{subN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}
{:makeN|n|{{subN|{{{n}}}|}}:}

////////////////////////////////////////////////////////MAKEN FUNCTION IN MORE READABLE FORM//////////////////////////////////
{:makeN|n|{{subN|{{{n}}}| }}:}
//calls a subfunction
{:subN|n
      |churchNum
      |{{#ifeq|{{{n}}}|0
              |{{{churchNum}}}x
              |{{subN|{{#expr|{{{n}}}-1}}|f{{{churchNum}}}}}}}:}

              //repeatedly add f i nfront of churchNum--> supposed to be an empty string when initialized
              //recursively call the function by subtracting 1 for n until it reaches 0 --> adds a x at the end of churchNum

//js form
/*function subN(n, churchNum){
  if(n==0){
    return churchNum+ "x";
  }
  else{
    churchNum="f"+churchNum;
    return subN(n-1,churchNum);
  }
}

function makeN(n){
  return subN(n,"");
}
*/




///////////////////////////////////////////////////////////////ISZERO FUNCTION IN MORE READABLE FORM////////////////////////////////////////////
{:isZero|n|{{#ifeq|{{{n}}}|x|true|false}}:}
//checks if the n==x (0 in lambda form) --> returns true if it is zero, returns false if it isn't x
//js form
/*
function isZero(num){

  if(num==x){
    return true;
  }
  return false; 
}
*/

/////////////////////////////////////////////////////////////SUCC FUNCTIO NIN MORE READABLE FORM/////////////////////////////////////////////////
//SUCC FUNCTION
{:succ|n1|f{{{n1}}}:}  //adds a "f" to the number
//js form
/*function succ(n1){
  return "f"+n1;
}*/


{:addSub|n1|n2|counter|{{#ifeq|{{{counter}}}|{{{n1}}}|{{{n2}}}|{{addSub|{{{n1}}}|{{succ|{{{n2}}}}}|{{succ|{{{counter}}}}}}}}}:}
{:add|n1|n2|{{addSub|{{{n1}}}|{{{n2}}}|x}}:}

///////////////////////////////////////////////////////////ADD FUNCTION IN MORE READABLE FORM//////////////////////////////////////////////
//MY ADD FUNCTION ---> IN MORE READABLE FORM
{:addSub
    |n1 
    |n2
    |counter
    |{{#ifeq|{{{counter}}}|{{{n1}}}          //if counter(that we increment) ==n1 (that we keep fixed)
            |{{{n2}}}
            |{{addSub|{{{n1}}}|{{succ|{{{n2}}}}}|{{succ|{{{counter}}}}}}}
      }}
:}
{:add|n1|n2|{{addSub|{{{n1}}}|{{{n2}}}|x}}:}
//has a counter to keep track of the the answer --> initially set to 0
//if n1==counter --> then return n2
//else: call add again and 1.pass in the incremented n2 by one(using succ) as the arg for n1 
                        //2. pass in the n1 as n1(don't change it)
                        //3. pass in the incremented counter by one(usinc succ)
//add function JS FORM
/*function addSub(n1,n2,counter){
  if(counter==n1){
    return n2;
  }
  else{
    return addSub(n1,succ(n2), succ(counter));
  }

}

function add(n1,n2){
  return addSub(n1,n2,"x");
}
*/





//ha
/////////////////////////////////////////PREFIX SUM IN MORE READABLE FORM//////////////////////////////////////////////////////////////
{:prefixSum|lambdaNum|{{pSum|{{{lambdaNum}}}|x|x}}:}

//x are innertext

{:pSum
  |n1
  |counter
  |solution
  |{{#ifeq|{{{n1}}}|{{{counter}}}
          |lambdafx.{{add|{{{solution}}}|{{{counter}}}}}
          |{{pSum|{{{n1}}}|{{succ|{{{counter}}}}}|{{add|{{{solution}}}|{{{counter}}}}} 
          }}
    }}
:}
//has a counter to keep track of the answer ---> intially set to 0
//if n1==counter --> add counter to solution ---> because it it is 1 to n inclusif -->return 
//else: call prefixSum again and 1. pass in the n1 as the counter --> never increment it;
                              //2. pass in a incremented counter --> always increment it by one
                              //3. pass in the solution (nitially set to 0)+counter... as to keep track<-- this is what we return in the end 

//js form
/*function pSum(n1,counter,solution){
  if(n1==counter){
    return "lambdafx."+add(solution,counter);
  }
  else{
    return pSum(n1, succ(counter), add(solution, counter));
  }
}
function prefixSum(lambdaNum){
  return pSum(lambdaNum,"x","x");
}*/










