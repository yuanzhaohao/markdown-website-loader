---
order: 0
title:
  zh-CN: Checkbox
  en-US: Checkbox
subtitle: 
  zh-CN: checkbox测试
  en-US: Buttons for actions in forms, dialogs, and more with support for multiple sizes, states, and more.
---

```js
function onChange(event) {
  console.log(event);
}

ReactDOM.render(
  <input type="checkbox" defaultChecked onChange={onChange} />,
  mountNode
);
```