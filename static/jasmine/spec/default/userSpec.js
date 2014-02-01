var path = function(){
  var loc = window.location.pathname.split("/");
  return {
      app: loc.length > 1? loc[1]: null,
      controller: loc.length > 2? loc[2]: null,
      function: loc.length > 3? loc[3]: null,
      args: loc.length > 4? loc.slice(4): null
      };
};

describe("index()", function(){
  it("URL", function(){
    var loc = path();
    expect(loc.app).toBe("fogger");    
    expect(loc.controller).toBe("default");    
    expect(loc.function).toBe("user");
    expect(loc.args.length>0).toEqual(true);
    view.render();
    if(loc.args[0]=="login") {
      /* inject username and password*/
      $('#auth_user_username').val("testuser");
      $('#auth_user_password').val("testpass");
      expect($('#auth_user_username').val())
        .toBe("testuser");
      expect($('#auth_user_password').val())
        .toBe("testpass");
      
      /* trigger login form submit */
      $('#web2py_user_form input[type="submit"]').trigger('click');
      
    } else if(loc.args[0]=="register") { 
      /* inject form data */
      $('#auth_user_username').val("testuser");
      $('#auth_user_username').val("testuser");
      $('#auth_user_password').val("testpass");
      $('#auth_user_password').val("testpass");
    } else {
      throw new Error("Undefined function.");
    }
  });
});
