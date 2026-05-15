const { render } = require("@react-email/render");
const React = require("react");

exports.renderEmail = async (Component, props) => {
  return await render(React.createElement(Component, props));
};
