const axios = require("axios");
const dayjs = require("dayjs");

module.exports = {
  //เปลี่ยนสถานะเป็น Done
  "55 10 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      await axios
        .get(
          "http://localhost:1337/api/rent-requests?filters[rent_date][$eq]=2024-04-06&filters[status_request][$eq]=Payed"
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("history", requests);
          if (requests.length > 0) {
            requests.forEach(async (item) => {
              const body = {
                data: {
                  status_request: "Done",
                },
              };
              console.log("body", body);
              await axios
                .put(`http://localhost:1337/api/rent-requests/${item.id}`, body)
                .then((res) => {
                  console.log(res.data.data);
                });
            });
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  },
};
