/*
 * JiaYin Chen
 * 260690708
 * A3Q1
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
  console.log(name);
  if (Object.keys(env.bindings).length==0 && env.parent==null) {
    return null;
  } //get the bindings of the environment

  var bObject = env.bindings;
  for (var key in bObject) {
    if (key == name) {
      return bObject[name];
    }
  }
  //if it doesn't have a parent--_> and we can't find a binding --? then return null b/c no such binding
  if (env.parent == null) {
    return null;
  }
  return lookup(name, env.parent);
} 