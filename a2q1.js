/*
 * assignment 2 question 1
 */

var TSTART = /^{{/;
var TEND = /^}}/;
var PIPE = /^\|/;
var OUTERTEXT = /^[\s\S]*?(?=({{|{:))/;      
                             // TSTART DSTART
var INNERTEXT = /^[\s\S]*?(?=({{|\||}}|{:|{{{))/;  
                             //TSTART PIPE TEND DSTART PSTART
var DSTART = /^{:/;
var DEND = /^:}/;
var INNERDTEXT = /^[\s\S]*?(?=({{|{:|:}|\|))/; 
                        //TSTART DSTART DEND PIPE
var PSTART = /^{{{/;
var PEND = /^}}}/;
var PNAME = /^[\s\S]*?(?=\||}}})/;  
                        //PIPE PEND
      //  \s= single white space character
      //  \S= single character other than white space
      //  *= matches the preceding expression 0 or 1 time
      //  ()--> Capturing parentheses: 
      //  x(?=y)  matches x onl if x is followed by y --> look ahead
