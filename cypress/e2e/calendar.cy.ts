describe('Calendar Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button').contains('カレンダー').click();
  });

  it('displays calendar view', () => {
    cy.get('.rbc-calendar').should('be.visible');
  });

  it('switches between different views', () => {
    // Month view (default)
    cy.get('.rbc-month-view').should('be.visible');

    // Week view
    cy.get('button').contains('週').click();
    cy.get('.rbc-time-view').should('be.visible');

    // Day view
    cy.get('button').contains('日').click();
    cy.get('.rbc-time-view').should('be.visible');

    // Agenda view
    cy.get('button').contains('予定一覧').click();
    cy.get('.rbc-agenda-view').should('be.visible');
  });

  it('displays todo and note events', () => {
    // Add a todo
    cy.get('button').contains('Todo').click();
    cy.get('input[placeholder="新しいTodoを入力"]').type('Test Todo');
    cy.get('button').contains('追加').click();

    // Add a note
    cy.get('button').contains('メモ').click();
    cy.get('input[placeholder="タイトル"]').type('Test Note');
    cy.get('textarea[placeholder="メモを入力"]').type('Test Content');
    cy.get('button').contains('保存').click();

    // Check if events are displayed in calendar
    cy.get('.rbc-event').should('have.length.at.least', 2);
    cy.contains('Test Todo').should('be.visible');
    cy.contains('Test Note').should('be.visible');
  });
}); 