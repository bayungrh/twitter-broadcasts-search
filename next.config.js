module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
    return config
  },
  env: {
    TWITTER_BEARER_TOKEN: ''
  }
}