import * as index from "../../../server/src/index";
// @ponicode
describe("index.func", () => {
  test("0", () => {
    let result: any = index.func("foo bar");
    expect(result).toMatchSnapshot();
  });

  test("1", () => {
    let result: any = index.func("Foo bar");
    expect(result).toMatchSnapshot();
  });

  test("2", () => {
    let result: any = index.func("Hello, world!");
    expect(result).toMatchSnapshot();
  });

  test("3", () => {
    let result: any = index.func("");
    expect(result).toMatchSnapshot();
  });
});
