import { delimiter, dots, hyphen, isPathLetter, numbersWithDots, pathLetters } from "@/graphic/utils/regex";
import { getBBoxWithoutTransform } from "@/graphic/utils/box";

/**
 * 将路径的格式化数组转换为字符串
 *
 * @returns 路径字符串
 * @param a 路径的格式化数组
 */
function arrayToString(a) {
  for (var i = 0, il = a.length, s = ""; i < il; i++) {
    s += a[i][0];

    if (a[i][1] != null) {
      s += a[i][1];

      if (a[i][2] != null) {
        s += " ";
        s += a[i][2];

        if (a[i][3] != null) {
          s += " ";
          s += a[i][3];
          s += " ";
          s += a[i][4];

          if (a[i][5] != null) {
            s += " ";
            s += a[i][5];
            s += " ";
            s += a[i][6];

            if (a[i][7] != null) {
              s += " ";
              s += a[i][7];
            }
          }
        }
      }
    }
  }

  return s + " ";
}

/**
 * 将路径的字符串格式化
 *
 * @returns 格式化结果
 * @param a
 * @param b
 * @param c
 * @param d
 */
export function pathRegReplace(a, b, c, d) {
  return c + d.replace(dots, " .");
}

const pathHandlers = {
  M: function (c, p, p0) {
    p.x = p0.x = c[0];
    p.y = p0.y = c[1];

    return ["M", p.x, p.y];
  },
  L: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ["L", c[0], c[1]];
  },
  H: function (c, p) {
    p.x = c[0];
    return ["H", c[0]];
  },
  V: function (c, p) {
    p.y = c[0];
    return ["V", c[0]];
  },
  C: function (c, p) {
    p.x = c[4];
    p.y = c[5];
    return ["C", c[0], c[1], c[2], c[3], c[4], c[5]];
  },
  S: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ["S", c[0], c[1], c[2], c[3]];
  },
  Q: function (c, p) {
    p.x = c[2];
    p.y = c[3];
    return ["Q", c[0], c[1], c[2], c[3]];
  },
  T: function (c, p) {
    p.x = c[0];
    p.y = c[1];
    return ["T", c[0], c[1]];
  },
  Z: function (c, p, p0) {
    p.x = p0.x;
    p.y = p0.y;
    return ["Z"];
  },
  A: function (c, p) {
    p.x = c[5];
    p.y = c[6];
    return ["A", c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
  },
};

const mlhvqtcsaz = "mlhvqtcsaz".split("");

for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
  pathHandlers[mlhvqtcsaz[i]] = (function (i) {
    return function (c, p, p0) {
      if (i === "H") c[0] = c[0] + p.x;
      else if (i === "V") c[0] = c[0] + p.y;
      else if (i === "A") {
        c[5] = c[5] + p.x;
        c[6] = c[6] + p.y;
      } else {
        for (var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }
      }

      return pathHandlers[i](c, p, p0);
    };
  })(mlhvqtcsaz[i].toUpperCase());
}

/**
 * 将路径的字符串转换为格式化数组
 *
 * @returns 格式化数组
 * @param array 路径的字符串
 */
export function parseDToArray(array) {
  // prepare for parsing
  var s;
  var paramCnt = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

  array = array
    .replace(numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
    .replace(pathLetters, " $& ") // put some room between letters and numbers
    .replace(hyphen, "$1 -") // add space before hyphen
    .trim() // trim
    .split(delimiter); // split into array

  // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
  var result = [];
  var p = { x: 0, y: 0 };
  var p0 = { x: 0, y: 0 };
  var index = 0;
  var len = array.length;

  do {
    // Test if we have a path letter
    if (isPathLetter.test(array[index])) {
      s = array[index];
      ++index;
      // If last letter was a move command and we got no new, it defaults to [L]ine
    } else if (s === "M") {
      s = "L";
    } else if (s === "m") {
      s = "l";
    }

    result.push(pathHandlers[s].call(null, array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat), p, p0));
  } while (len > index);

  return result;
}

/**
 * 将路径移动至指定坐标
 *
 * @param path 路径对象
 * @param x x坐标
 * @param y y坐标
 */
export function movePath(path, x, y) {
  // get bounding box of current situation
  var box = getBBoxWithoutTransform(path);
  const { d } = path;
  const pathArray = parseDToArray(d);
  // get relative offset
  x -= box.x;
  y -= box.y;

  if (!isNaN(x) && !isNaN(y)) {
    // move every point
    for (var l, i = pathArray.length - 1; i >= 0; i--) {
      l = pathArray[i][0];

      if (l === "M" || l === "L" || l === "T") {
        pathArray[i][1] += x;
        pathArray[i][2] += y;
      } else if (l === "H") {
        pathArray[i][1] += x;
      } else if (l === "V") {
        pathArray[i][1] += y;
      } else if (l === "C" || l === "S" || l === "Q") {
        pathArray[i][1] += x;
        pathArray[i][2] += y;
        pathArray[i][3] += x;
        pathArray[i][4] += y;

        if (l === "C") {
          pathArray[i][5] += x;
          pathArray[i][6] += y;
        }
      } else if (l === "A") {
        pathArray[i][6] += x;
        pathArray[i][7] += y;
      }
    }
  }

  return arrayToString(pathArray);
}
