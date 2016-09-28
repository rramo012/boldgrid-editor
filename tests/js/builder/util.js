describe("Pixels to Ems Calculations", function() {
	
  it("Produces an number less than 1", function() {
	var ems = BOLDGRID.EDITOR.Util.convertPxToEm( 15, 17 );
    expect( ems ).toEqual( '0.9' );
  });
  it("Produces an number more than 1", function() {
	  var ems = BOLDGRID.EDITOR.Util.convertPxToEm( 199, 17 );
	  expect( ems ).toEqual( '11.7' );
  });
  it("Results in 0", function() {
	  var ems = BOLDGRID.EDITOR.Util.convertPxToEm( 0, 17 );
	  expect( ems ).toEqual( 0 );
  });
  
  it("Both arguments 0", function() {
	  var ems = BOLDGRID.EDITOR.Util.convertPxToEm( 0, 0 );
	  expect( ems ).toEqual( 0 );
  });
});