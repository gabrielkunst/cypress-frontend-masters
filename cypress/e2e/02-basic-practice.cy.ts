/// <reference types="cypress" />

describe('Basic Practice', () => {
  beforeEach(() => {
    cy.visit('/jetsetter');
  });

  describe('Adding a new item', () => {
    it('should put a new item on the page after clicking on "Add Item"', () => {
      cy.get('[data-test="items"]').as('itemList');
      cy.get('@itemList').find("li[data-test='item-container']").as('items');

      // get the length of the items before adding a new item
      cy.get('@items').then(($items) => {
        const newItem = 'Cypress Test Item';
        const itemsLength = $items.length;

        cy.get('[data-test="new-item-input"]').type(`${newItem}{enter}`);

        // verify that a new item was added
        cy.get('@items').should('have.length', itemsLength + 1);
        cy.get('@items').should('contain', newItem);
      });
    });

    it('should put a new item in the "Unpacked Items" list', () => {
      cy.get('[data-test="items-unpacked"]').as('unpackedItems');
      cy.get('@unpackedItems').find("li[data-test='item-container']").as('unpackedItemsList');

      cy.get('@unpackedItemsList').then(($items) => {
        const newItem = 'Cypress Test Item';
        const itemsLength = $items.length;

        cy.get("[data-test='new-item-input']").type(`${newItem}{enter}`);

        cy.get('@unpackedItemsList').should('have.length', itemsLength + 1);
        cy.get('@unpackedItemsList').last().should('contain', newItem);
      });
    });
  });

  describe('Filtering items', () => {
    it('should show items that match whatever is in the filter field', () => {
      const filterText = 'tooth';

      cy.get("[data-test='filter-items']").type(filterText);
      cy.get("[data-test='items']").should('contain', 'Tooth Brush');
      cy.get("[data-test='items']").should('contain', 'Tooth Paste');
    });

    it('should hide items that do not match whatever is in the filter field', () => {
      const filterText = 'tooth';

      cy.get("[data-test='filter-items']").type(filterText);
      cy.contains('Hoodie').should('not.exist');
    });
  });

  describe('Removing items', () => {
    describe('Remove all', () => {
      it('should remove all of the items', () => {
        cy.get("[data-test='remove-all']").click();
        cy.get("[data-test='items'] li").should('have.length', 0);
      });
    });

    describe('Remove individual items', () => {
      it('should have a remove button on an item', () => {
        cy.get("[data-test='item-container'").as('items');

        cy.get('@items').each(($item) => {
          cy.wrap($item).get("[data-test='remove']").should('exist');
        });
      });

      it('should remove an item from the page', () => {
        cy.get("[data-test='items'] li").as('items');
        cy.get('@items').first().as('firstItem');
        cy.get('@firstItem')
          .within(() => {
            cy.get("[data-test='remove']").click();
          })
          .should('not.exist');
      });
    });
  });

  describe('Mark all as unpacked', () => {
    it('should empty out the "Packed" list', () => {
      cy.get("[data-test='mark-all-as-unpacked']").click();
      cy.get("[data-test='items-packed'] li").should('not.exist');
    });

    it('should empty have all of the items in the "Unpacked" list', () => {
      cy.get("[data-test='items'] li").as('items');
      cy.get('@items')
        .its('length')
        .then((count) => {
          cy.get("[data-test='mark-all-as-unpacked']").click();
          cy.get("[data-test='items-unpacked'] li").its('length').should('eq', count);
        });
    });
  });

  describe.only('Mark individual item as packed', () => {
    it('should move an individual item from "Unpacked" to "Packed"', () => {
      cy.get("[data-test='items-unpacked'] li label").first().as('firstElement');

      cy.get('@firstElement')
        .within(() => cy.get("input[type='checkbox']").click())
        .then(($item) => {
          const itemText = $item.text();
          cy.get("[data-test='items-packed'] li label").first().should('have.text', itemText);
        });
    });
  });
});
