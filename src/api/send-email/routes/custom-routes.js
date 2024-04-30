module.exports = {
  routes: [
    {
      method: "POST",
      path: "/forgot-password",
      handler: "email.sendEmail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
