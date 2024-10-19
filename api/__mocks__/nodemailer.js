// api/__mocks__/nodemailer.js
const nodemailer = {
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ response: "Mock email sent" }),
  }),
};

export default nodemailer;
