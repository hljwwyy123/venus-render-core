const branch = require('git-branch');

if (branch.sync() !== 'master') {
  console.error('！！！ 请在master分支上发布 ！！！');
  process.exit(1);
}
process.exit(0);