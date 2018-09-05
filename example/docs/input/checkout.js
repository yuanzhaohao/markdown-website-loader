function onChange(checked) {
  console.log(`switch to ${checked}`);
}

ReactDOM.render(
  <input type="checkbox" defaultChecked onChange={onChange} />,
  mountNode
);