/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 *
 * ```typescript
 * // Or you can specify the language explicitly
 * const instance = new TestDoc();
 * ```
 */

export class TestDoc {
  /**
   * Returns the average of two numbers.
   *
   * @remarks
   * This method is part of the {@link testdoc#getmaxnumber | TestDoc subsystem}.
   *
   * @param x - The first input number
   * @param y - The second input number
   * @returns The arithmetic mean of `x` and `y`
   *
   * @beta version
   */
  public static getAverage(x: number, y: number): number {
    return (x + y) / 2.0;
  }

  /**
   * 返回数组中的最大值
   *
   * @param Arr - 传入的数组
   * @returns 返回数组中的最大值
   *
   * @Release 版本
   */
  private static getMaxNumber(Arr: Array<number>) {
    return Math.max.apply(null, Arr);
  }
}
