# Vite-plugin-saltify-pinia-stores

## Description
Makes pinia-stores names unique between builds.

This matters if you are developing MFE, because you can intersect in pinia-stores names and this breaks application flow.
This plugin solves this problem because stores names become unique between builds and it never intersects with other applications.

## Using
You can add the plugin to `vite.config` such as any other plugin and give it any salt you want:
```typescript
plugins: [
  saltifyPiniaStores({
    salt: `${salt}_${pkg.name}`,
    logEnable: true,
  })
]
```

### Options:
- `salt` - value to be added in pinia-stores names. If the option is not passed plugin generates unique value as salt
- `logEnable` - log display flag

### Testing
You need to disable plugin for test environment.

```typescript
plugins: [
  isTesting ? saltifyPiniaStores({
    salt: `${salt}_${pkg.name}`,
    logEnable: true,
  }) : false
].filter(Boolean)
```
