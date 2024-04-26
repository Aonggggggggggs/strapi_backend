const axios = require("axios");
const dayjs = require("dayjs");

module.exports = {
  //เปลี่ยนสถานะเป็น D
  "12 15 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      await axios
        .get(
          `http://localhost:1337/api/rent-requests?filters[rent_date][$eq]=${yesterday}&filters[status_request][$eq]=W`
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("requests", requests);
          if (requests.length > 0) {
            requests.forEach(async (item) => {
              const body = {
                data: {
                  status_request: "D",
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
  //เปลี่ยนสถานะเป็น U
  "41 10 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      await axios
        .get(
          "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=I"
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("requests", requests);
          if (requests.length > 0) {
            requests.forEach(async (item) => {
              const body = {
                data: {
                  status_request: "U",
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
  //เปลี่ยนสถานะเป็น W
  "*/5 * * * *": async () => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      await axios
        .get(
          "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=P"
        )
        .then((res) => {
          const requests = res.data.data;
          console.log("requests", requests);
          if (requests.length > 0) {
            requests.forEach(async (item) => {
              const body = {
                data: {
                  status_request: "W",
                },
              };
              console.log(
                dayjs(item?.attributes?.rent_date).diff(dayjs(today), "day")
              );
              if (
                dayjs(item?.attributes?.rent_date).diff(dayjs(today), "day") ===
                1
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
              if (
                dayjs(item?.attributes?.rent_date).format("YYYY-MM-DD") ===
                today
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
