describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('button').contains('ダッシュボード').click();
  });

  it('displays dashboard view', () => {
    cy.get('.dashboard').should('be.visible');
  });

  it('shows statistics', () => {
    // Add a todo
    cy.get('button').contains('Todo').click();
    cy.get('input[placeholder="新しいTodoを入力"]').type('Test Todo');
    cy.get('button').contains('追加').click();

    // Add a note
    cy.get('button').contains('メモ').click();
    cy.get('input[placeholder="タイトル"]').type('Test Note');
    cy.get('textarea[placeholder="メモを入力"]').type('Test Content');
    cy.get('button').contains('保存').click();

    // Navigate to dashboard
    cy.get('button').contains('ダッシュボード').click();

    // Check statistics
    cy.get('.statistics').should('be.visible');
    cy.contains('Total Todos').should('be.visible');
    cy.contains('Completed Todos').should('be.visible');
    cy.contains('Total Notes').should('be.visible');
  });

  it('displays recent items', () => {
    // Add items first
    cy.get('button').contains('Todo').click();
    cy.get('input[placeholder="新しいTodoを入力"]').type('Test Todo');
    cy.get('button').contains('追加').click();

    cy.get('button').contains('メモ').click();
    cy.get('input[placeholder="タイトル"]').type('Test Note');
    cy.get('textarea[placeholder="メモを入力"]').type('Test Content');
    cy.get('button').contains('保存').click();

    // Navigate to dashboard
    cy.get('button').contains('ダッシュボード').click();

    // Check recent items
    cy.get('.recent-todos').should('be.visible');
    cy.get('.recent-notes').should('be.visible');
    cy.contains('Test Todo').should('be.visible');
    cy.contains('Test Note').should('be.visible');
  });

  it('shows completion rate', () => {
    // Add and complete a todo
    cy.get('button').contains('Todo').click();
    cy.get('input[placeholder="新しいTodoを入力"]').type('Test Todo');
    cy.get('button').contains('追加').click();
    cy.get('input[type="checkbox"]').first().check();

    // Navigate to dashboard
    cy.get('button').contains('ダッシュボード').click();

    // Check completion rate
    cy.get('.completion-rate').should('be.visible');
    cy.contains('100%').should('be.visible');
  });
}); 