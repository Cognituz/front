module.exports = () => (scopeOrCtrl, fn) => {
  if (scopeOrCtrl.locked) return;
  scopeOrCtrl.locked = true;
  return fn().finally(_ => scopeOrCtrl.locked = false);
};
