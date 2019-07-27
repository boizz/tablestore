module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true
    },
    "rules": {
        "no-restricted-syntax": ["error", "iterators/generators"],
        "no-await-in-loop": [0],
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-underscore-dangle": [0],
        "guard-for-in": [0],
    }
};