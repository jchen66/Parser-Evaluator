/*
 *Assignment 4
 *Question 1
*/


var e=createEnv(null);
var test="{:plastic|pName|chemicals|{:`|boo|{{{boo}}}:}:}{{{{plastic|polyester|idk}}|hey}}";
var tree=parseOuter(test);
var m=evalWML(tree, e);

//////////////////////////MATERIAL//////////////////////////////////////////////////
{:plastic|pName|chemicals|
	{:`|fName|{{#ifeq|{{{fName}}}|getname|{:getname|{{{pName}}}:}{{getname}}|no function}}:}
	}
:}	

{:plastic|pName|chemicals|{:`|fName|{{#ifeq|{{{fName}}}|getname|{:getname|{{{pName}}}:}{{getname}}|no function}}:}:}	

{:plastic|pName|chemicals|{:getname|{{{pName}}}:}{:`|fName|{{fName}}:}:}

{:plastic|pName|chemicals|{:getname|{{{pName}}}:}{:`|fName|{{fName}}:}:}
