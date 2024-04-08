const axios = require("axios");
const dayjs = require("dayjs");

module.exports = {
  //เปลี่ยนสถานะเป็น Done
  "17 10 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      await axios
        .get(
          `http://localhost:1337/api/rent-requests?filters[rent_date][$eq]=${yesterday}&filters[status_request][$eq]=Payed`
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("requests", requests);
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
  //เปลี่ยนสถานะเป็น Unpaid
  "30 11 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      await axios
        .get(
          "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=In Progress"
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("requests", requests);
          if (requests.length > 0) {
            requests.forEach(async (item) => {
              const body = {
                data: {
                  status_request: "Unpaid",
                },
              };
              if (
                dayjs(item?.attributes?.rent_date)
                  .subtract(6, "day")
                  .format("YYYY-MM-DD") === yesterday
              ) {
                await axios
                  .put(
                    `http://localhost:1337/api/rent-requests/${item.id}`,
                    body
                  )
                  .then((res) => {
                    console.log(res.data.data);
                  });
              }
            });
          }
        });
    } catch (error) {
      console.log(error.message);
    }
  },
};
