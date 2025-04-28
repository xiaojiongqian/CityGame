module.exports = {
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/__tests__/helpers/'
  ],
  // 只将.test.js和.test.jsx文件视为测试文件
  testRegex: '(/__tests__/(?!helpers/).*\\.(test|spec))\\.[jt]sx?$'
}; 