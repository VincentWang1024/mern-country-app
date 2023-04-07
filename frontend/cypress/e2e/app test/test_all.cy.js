
const testUser = {
  username: 'testuser'+generateRandomString(10),
  password: 'testpassword'+generateRandomString(10)
};

const url = 'http://localhost:3000'


describe('Register', () => {
  it('Registers a new user', () => {
    cy.visit('http://localhost:3000');
    cy.get('a[href="/register"]').click();
    cy.get('input[name=username]').type(testUser.username);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('input[name=confirm_password]').type(testUser.password);
    cy.get('button[type=button]').click();
    cy.url().should('include', '/');
    cy.get('div.swal-modal').should('contain', 'Registered Successfully.');
  });
});


describe('Login', () => {
  it('Logs in a user', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name=username]').type(testUser.username);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('button[type=button]').click();
    cy.url().should('include', '/dashboard');
  });
});

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('Country Input Test', () => {
  it('search a country', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name=username]').type(testUser.username);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('button[type=button]').click();
    cy.url().should('include', '/dashboard');
    cy.get('input[name=search]').type('United States');
    // cy.get('form').submit();
    // cy.get('td.innerText()').should('contain', 'United States');
    cy.get('.MuiTable-root').within(() => {
      cy.contains('td', 'United States');
    });
  });

});


describe('Logout functionality', () => {
  it('should logout user successfully', () => {
    // login the user first
    cy.visit(url);
    cy.get('input[name=username]').type(testUser.username);
    cy.get('input[name=password]').type(testUser.password);
    cy.get('button[type=button]').click();
    // logout the user
    cy.get('button[name=logout]').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});