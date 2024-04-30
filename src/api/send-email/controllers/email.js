const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: async (ctx) => {
    try {
      const { email, body } = ctx.request.body;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "your_email",
          pass: "your_password",
        },
      });

      await transporter.sendMail({
        from: { name: "your_name", address: "your_email" },
        to: email,
        subject: "ลืมรหัสผ่าน",
        html: body,
      });

      ctx.send({ message: "Email sent successfully" });
    } catch (error) {
      ctx.throw(500, "Error sending email", { error });
    }
  },
};
