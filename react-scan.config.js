module.exports = {
  // Specify the directories to scan
  include: [
    'src/**/*.{ts,tsx,js,jsx}',
  ],
  
  // Exclude node_modules and other directories you don't want to scan
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
  ],

  // Configure rules
  rules: {
    'no-unused-props': 'warn',
    'no-unused-state': 'warn',
    'no-unused-vars': 'warn',
    'no-direct-mutation': 'warn',
    'hooks-deps': 'warn',
    'jsx-key': 'warn',
  },

  // Output configuration
  output: {
    format: 'text', // or 'json'
    file: 'react-scan-report.txt',
  },
}; 