describe("Login Test", function(){
  it("Correct Page", function(){
    expect(window.location.pathname).toBe("/fogger/default/user/login");
  });
});