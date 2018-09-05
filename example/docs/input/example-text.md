---
order: 0
title:
  zh-CN: Text
  en-US: Text
subtitle: 
  zh-CN: 提供多种不同的buttons。
  en-US: Buttons for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
---

```js
function onChange(event) {
  console.log(event);
}

ReactDOM.render(
  <input type="text" onChange={onChange} />,
  mountNode
);
```