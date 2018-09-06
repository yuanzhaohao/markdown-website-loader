---
order: 0
title:
  zh-CN: Checkbox
  en-US: Checkbox
subtitle: 
  zh-CN: 副标题可以使用markdown语法，例如`size`, `type`, `disabled`。
  en-US: Markdown grammar can be use here. Such as `size`, `type`, `disabled`.
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