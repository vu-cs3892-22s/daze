import * as index from '../../../server/src/index';
// @ponicode
describe('index.func', () => {
  test('0', () => {
    const result: any = index.func('foo bar');
    expect(result).toMatchSnapshot();
  });

  test('1', () => {
    const result: any = index.func('Foo bar');
    expect(result).toMatchSnapshot();
  });

  test('2', () => {
    const result: any = index.func('Hello, world!');
    expect(result).toMatchSnapshot();
  });

  test('3', () => {
    const result: any = index.func('');
    expect(result).toMatchSnapshot();
  });
});
