const React = require("react");
const {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
} = require("@react-email/components");
const { Tailwind } = require("@react-email/tailwind");

const OtpEmail = ({ otp }) => (
  React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(
      Tailwind,
      null,
      React.createElement(
        Body,
        { className: "bg-slate-900 font-sans" },
        React.createElement(
          Container,
          { className: "bg-white rounded-xl p-8 max-w-md mx-auto" },
          React.createElement(
            Heading,
            { className: "text-indigo-600 text-xl mb-4" },
            "ConnectX Verification"
          ),
          React.createElement(
            Text,
            { className: "text-gray-700 mb-2" },
            "Your One-Time Password (OTP):"
          ),
          React.createElement(
            Text,
            { className: "text-3xl font-bold tracking-widest text-gray-900 mb-4" },
            otp
          ),
          React.createElement(
            Text,
            { className: "text-gray-600 mb-6" },
            "This OTP is valid for 10 minutes."
          ),
          React.createElement(Hr, null),
          React.createElement(
            Text,
            { className: "text-xs text-gray-500 mt-4" },
            "This is an automated email. Please do not reply."
          )
        )
      )
    )
  )
);

module.exports = OtpEmail;
