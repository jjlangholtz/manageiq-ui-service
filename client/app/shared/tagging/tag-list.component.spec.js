describe('TagList component', () => {
  let parentScope, element;

  beforeEach(module('app.shared'));

  beforeEach(inject(($compile, $rootScope) => {
    parentScope = $rootScope.$new();
    parentScope.tags = [
      { categorization: { displayName: 'Location: Chicago' } },
      { categorization: { displayName: 'Service Level: Gold' } },
    ];

    element = angular.element(`
      <tag-list tags="tags" on-remove-tag="onRemoveTag"></tag-list>
    `);
    $compile(element)(parentScope);
    parentScope.$digest();
  }));

  it('displays a tag for each tag in the list', () => {
    const numTags = parentScope.tags.length;
    const tags = element[0].querySelectorAll('.tag-list__tag');

    expect(tags.length).to.eq(numTags);
  });

  it('displays icons to dismiss tags when onRemoveTag is set', () => {
    parentScope.onRemoveTag = angular.noop;
    parentScope.$digest();

    const numTags = parentScope.tags.length;
    const icons = element[0].querySelectorAll('.tag-list__dismiss-icon');

    expect(icons.length).to.eq(numTags);
  });

  it('displays a default message when there are no tags provided', () => {
    parentScope.tags = [];
    parentScope.$digest();

    const text = findIn(element, '.tag-list__empty-state').text();

    expect(text).to.eq('There are no tags for this item.');
  });
});
