const { share, withModuleFederationPlugin } = require("@angular-architects/module-federation/webpack");
const { sharedModules } = require("../newSharedDependencies.config");

module.exports = withModuleFederationPlugin({
  name: "mfConsolidatedBalanceFilex",

  exposes: {
    "./main": "./src/bootstrap.ts",
  },

  shared: share(sharedModules),
});
