import { migrationPaths } from "./vault/migration-paths.mjs";
/** Old site path -> new site path, without the /notes base or a file extension. */
const legacyRedirects = {
  "/C++/C++": "/C++/语言/C++",
  "/C++/C+++": "/C++/语言/C+++",
  "/C++/C++Lambda表达式": "/C++/语言/C++Lambda表达式",
  "/C++/C++STL": "/C++/语言/C++STL",
  "/C++/C++多线程": "/C++/语言/C++多线程",
  "/C++/C++异常": "/C++/语言/C++异常",
  "/C++/C++智能指针": "/C++/语言/C++智能指针",
  "/C++/C++模板": "/C++/语言/C++模板",
  "/C++/C++类": "/C++/语言/C++类",
  "/C++/C++类型转换": "/C++/语言/C++类型转换",
  "/C++/C++虚函数": "/C++/语言/C++虚函数",
  "/C++/C++运算符重载": "/C++/语言/C++运算符重载",
  "/C++/C++预处理": "/C++/语言/C++预处理",
  "/Python/flask/应用设置": "/Python/Flask/应用设置",
  "/Python/flask/快速上手": "/Python/Flask/快速上手",
  "/Python/flask/测试覆盖": "/Python/Flask/测试覆盖",
  "/Python/flask/简单应用": "/Python/Flask/简单应用",
  "/Python/flask/蓝图视图": "/Python/Flask/蓝图视图",
  "/Python/flask/项目可安装化": "/Python/Flask/项目可安装化",
  "/Python/flask/项目布局": "/Python/Flask/项目布局",
  "/Python/python基础/pythonJSON": "/Python/基础/pythonJSON",
  "/Python/python基础/pythonOS模块": "/Python/基础/pythonOS模块",
  "/Python/python基础/pythonPIP": "/Python/基础/pythonPIP",
  "/Python/python基础/pythonRegEx": "/Python/基础/pythonRegEx",
  "/Python/python基础/python内建函数": "/Python/基础/python内建函数",
  "/Python/python基础/python函数": "/Python/基础/python函数",
  "/Python/python基础/python发送邮件": "/Python/基础/python发送邮件",
  "/Python/python基础/python多线程": "/Python/基础/python多线程",
  "/Python/python基础/python字符串": "/Python/基础/python字符串",
  "/Python/python基础/python异常处理": "/Python/基础/python异常处理",
  "/Python/python基础/python循环": "/Python/基础/python循环",
  "/Python/python基础/python数据类型": "/Python/基础/python数据类型",
  "/Python/python基础/python日期": "/Python/基础/python日期",
  "/Python/python基础/python条件判断": "/Python/基础/python条件判断",
  "/Python/python基础/python简介": "/Python/基础/python简介",
  "/Python/python基础/python类和对象": "/Python/基础/python类和对象",
  "/Python/python基础/python网络编程": "/Python/基础/python网络编程",
  "/Python/python基础/python语法": "/Python/基础/python语法",
  "/Python/python基础/python运算符": "/Python/基础/python运算符",
  "/Python/python基础/python迭代器": "/Python/基础/python迭代器",
  "/Python/python基础/python集合": "/Python/基础/python集合",
  "/Study/Git": "/Tools/Git",
  "/Study/Java": "/Fundamentals/Java",
  "/Study/前端测试总结": "/Web/工程化/前端测试",
  "/Study/排序算法": "/Fundamentals/排序",
  "/Study/概率统计与实验": "/Fundamentals/概率统计",
  "/Study/正则表达式": "/Fundamentals/正则表达式",
  "/Study/汇编语言": "/Fundamentals/汇编",
  "/Study/测试与CI": "/Tools/测试与CI",
  "/Study/短路求值": "/Fundamentals/短路求值",
  "/Study/语法糖": "/Fundamentals/语法糖",
  "/Study/配置Hosts以及更改DNS": "/Tools/Hosts与DNS",
  "/Web/ESlint/Eslint": "/Web/工程化/ESLint",
  "/Web/Express/Express": "/Web/服务端/Express",
  "/Web/JS Lib/Ajax/AJAX": "/Web/JavaScript/Ajax/AJAX",
  "/Web/JS Lib/Ajax/AJAX 响应": "/Web/JavaScript/Ajax/AJAX 响应",
  "/Web/JS Lib/Ajax/AJAX 请求": "/Web/JavaScript/Ajax/AJAX 请求",
  "/Web/JS Lib/Ajax/axios": "/Web/JavaScript/Ajax/axios",
  "/Web/JS Lib/Chalk/Chalk": "/Web/库/Chalk",
  "/Web/JS Lib/Dexie/Dexie": "/Web/库/Dexie",
  "/Web/JS Lib/Jest/Jest": "/Web/工程化/Jest",
  "/Web/JS Lib/Joi/Joi": "/Web/库/Joi",
  "/Web/JS Lib/koa/koa 上下文": "/Web/服务端/Koa/koa 上下文",
  "/Web/JS Lib/koa/koa 响应": "/Web/服务端/Koa/koa 响应",
  "/Web/JS Lib/koa/koa 应用": "/Web/服务端/Koa/koa 应用",
  "/Web/JS Lib/koa/koa 请求": "/Web/服务端/Koa/koa 请求",
  "/Web/JS Lib/Node.js/Node.js": "/Web/服务端/Node.js/Node.js",
  "/Web/JS Lib/Node.js/Node.js Buffer": "/Web/服务端/Node.js/Node.js Buffer",
  "/Web/JS Lib/Node.js/Node.js EventEmitter":
    "/Web/服务端/Node.js/Node.js EventEmitter",
  "/Web/JS Lib/Node.js/Node.js Path": "/Web/服务端/Node.js/Node.js Path",
  "/Web/JS Lib/Node.js/Node.js Stream": "/Web/服务端/Node.js/Node.js Stream",
  "/Web/JS Lib/Node.js/Node.js Web 模块":
    "/Web/服务端/Node.js/Node.js Web 模块",
  "/Web/JS Lib/Node.js/Node.js 事件循环":
    "/Web/服务端/Node.js/Node.js 事件循环",
  "/Web/JS Lib/Node.js/Node.js 回调函数":
    "/Web/服务端/Node.js/Node.js 回调函数",
  "/Web/JS Lib/Node.js/Node.js 文件系统":
    "/Web/服务端/Node.js/Node.js 文件系统",
  "/Web/JS Lib/Node.js/使用 NPM 管理软件包":
    "/Web/服务端/Node.js/使用 NPM 管理软件包",
  "/Web/JS Lib/Node.js/配置文件": "/Web/服务端/Node.js/配置文件",
  "/Web/JS Lib/ora/ora": "/Web/库/ora",
  "/Web/MongoDB/MongoDB": "/Web/数据/MongoDB/MongoDB",
  "/Web/MongoDB/NoSQL": "/Web/数据/MongoDB/NoSQL",
  "/Web/TypeScript/TypeScript 高级类型及用法": "/Web/语言/TypeScript",
  "/Web/对象存储 OSS/Node.js SDK": "/Web/数据/对象存储/Node.js SDK",
  "/Web/对象存储 OSS/Quick Start": "/Web/数据/对象存储/Quick Start",
  "/Web/对象存储 OSS/访问控制RAM": "/Web/数据/对象存储/访问控制RAM",
  "/Web/数据库/SQL与数据建模": "/Web/数据/SQL与数据建模",
};

const stem = (id) => "/" + id.replace(/\.md$/, "");
const moves = Object.fromEntries(
  Object.entries(migrationPaths)
    .filter(([old, next]) => old !== next)
    .flatMap(([old, next]) => {
      const pairs = [[stem(old), stem(next)]];
      if (old.endsWith("/index.md"))
        pairs.push([stem(old).replace(/\/index$/, ""), stem(next)]);
      return pairs;
    }),
);
export const redirects = Object.fromEntries(
  Object.entries({ ...legacyRedirects, ...moves }).map(([from, to]) => [
    from,
    moves[to] || to,
  ]),
);

export function normalizePath(input) {
  if (!input) return "";
  let path = String(input);
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep the raw path */
  }
  path = path.split("?")[0].split("#")[0];
  if (path.startsWith("/notes/")) path = path.slice("/notes".length);
  else if (path === "/notes") path = "/";
  path = path.replace(/\.html$/, "").replace(/\.md$/, "");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (!path.startsWith("/")) path = "/" + path;
  return path;
}

export function redirectTarget(input) {
  return redirects[normalizePath(input)] ?? null;
}
