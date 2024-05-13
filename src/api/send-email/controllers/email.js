const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: async (ctx) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
        },
      });

      await transporter.sendMail({
        to: email,
        html: body,
      });

      ctx.send({ message: "Email sent successfully" });
    } catch (error) {
      ctx.throw(500, "Error sending email", { error });
    }
  },
};
