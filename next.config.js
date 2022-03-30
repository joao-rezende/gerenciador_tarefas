module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/tasks/:slug*',
        destination: 'https://api-tasks-sd.herokuapp.com/:slug*'
      },
    ]
  },
}