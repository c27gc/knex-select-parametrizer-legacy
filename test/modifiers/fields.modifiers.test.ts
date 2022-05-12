import FieldModifier from '../../src/modifiers/fields.modifier';



describe( 'Unmasked request' , () => {
  let filterMapping: { [key: string]: string };

  filterMapping = { 
    'profession.name': 'profession.name',
    'user.name': 'user.name ',
    'country.name': 'country.name',
  }


  test('without external alias', () => {
    const modifier = new FieldModifier(['profession.name', 'user.name', 'country.name'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as profession.name', 'user.name as user.name', 'country.name as country.name']);
  });


  test('with external alias', () => {
    const modifier = new FieldModifier(['profession.name as profession_name', 'user.name as user_name', 'country.name as country_name'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as profession_name', 'user.name as user_name', 'country.name as country_name']);
  
  });


  test('with cross alias', () => {

    const modifier = new FieldModifier(['profession.name as user.name', 'user.name as profession.name', 'country.name'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as user.name', 'user.name as profession.name', 'country.name as country.name']);
  });

  test('with reserved alias', () => {

    const modifier = new FieldModifier(['profession.name as user.name', 'user.name', 'country.name'], filterMapping);

    expect(() => { 
      modifier.execute() 
    }).toThrowError('Duplicated alias: user.name.');
  });

});

describe( 'Masked request', () => {

  let filterMapping: { [key: string]: string };
  
  filterMapping = { 
    'profession_name': 'profession.name',
    'user_name': 'user.name ',
    'country_name': 'country.name',
  }


  test('without external alias', () => {
    const modifier = new FieldModifier(['profession_name', 'user_name', 'country_name'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as profession_name', 'user.name as user_name', 'country.name as country_name']);
  });

  
  
  test('with external alias', () => {
    const modifier = new FieldModifier(['profession_name as profession_name_', 'user_name as user_name_', 'country_name as country_name_'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as profession_name_', 'user.name as user_name_', 'country.name as country_name_']);
  
  });


  test('with cross alias', () => {

    const modifier = new FieldModifier(['profession_name as user_name', 'user_name as profession_name', 'country_name'], filterMapping);
    const result = modifier.execute();

    expect(result).toEqual(['profession.name as user_name', 'user.name as profession_name', 'country.name as country_name']);
  });


  test('with reserved alias', () => {

    const modifier = new FieldModifier(['profession_name as user_name', 'user_name', 'country_name'], filterMapping);
    
    expect(() => {
      modifier.execute()
    }).toThrowError(new Error(`Duplicated alias: user_name.`));
  });


})

describe('Fields strict mode ', () => {

  let filterMapping: { [key: string]: string };

  filterMapping = { 
    'profession.name': 'profession.name',
    'user.name': 'user.name ',
    'country.name': 'country.name',
  }

  test('without match inside field array', () => {
    const modifier = new FieldModifier(["profession.name as prof_name", "user.name", "some_field"], filterMapping);
    const result = modifier.fieldStrictMode();

    expect(result).toEqual(["profession.name as prof_name", "user.name"]);
  })

  test('with duplicate valid field ', () => {
    const modifier = new FieldModifier(["profession.name as prof_name", "user.name", "some_field", "user.name as usrname"], filterMapping);
    const result = modifier.fieldStrictMode();

    expect(result).toEqual(["profession.name as prof_name", "user.name"]);
  })

  test('with duplicate valid field with diferent order', () => {
    const modifier = new FieldModifier(["profession.name as prof_name", "user.name as usrname", "user.name", "some_field"], filterMapping);
    const result = modifier.fieldStrictMode();

    expect(result).toEqual(["profession.name as prof_name", "user.name as usrname"]);
  })

})
