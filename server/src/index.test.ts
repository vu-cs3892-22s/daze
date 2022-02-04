import * as index from "./index";
// @ponicode
describe("index.func", () => {
  test("0", () => {
    let result: any = index.func("Foo bar");
    expect(result).toMatchSnapshot();
  });

  test("1", () => {
    let result: any = index.func("foo bar");
    expect(result).toMatchSnapshot();
  });

  test("2", () => {
    let result: any = index.func("This is a Text");
    expect(result).toMatchSnapshot();
  });

  test("3", () => {
    let result: any = index.func("Hello, world!");
    expect(result).toMatchSnapshot();
  });

  test("4", () => {
    let result: any = index.func("");
    expect(result).toMatchSnapshot();
  });
});
