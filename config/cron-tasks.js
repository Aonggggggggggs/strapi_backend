const axios = require("axios");
const dayjs = require("dayjs");

module.exports = {
  //เปลี่ยนสถานะเป็น D , U
  "00 00 * * *": async () => {
    try {
      const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
      //เปลี่ยนสถานะเป็น D
      await axios
        .get(
          `http://localhost:1337/api/rent-requests?filters[rent_date][$eq]=${yesterday}&filters[status_request][$eq]=W`
        )
        .then((res) => {
          const requests = res.data.data;
          // console.log("requests", requests);
          const filteredRequests = requests.filter((request) => {
            return (
              request.attributes.type_request === "เช่าแบบประจำ" ||
              request.attributes.type_request === "เช่าแบบธรรมดา"
            );
          });
          // console.log("filters", filteredRequests);
          if (filteredRequests.length > 0) {
            filteredRequests.forEach(async (item) => {
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
      await axios
        .get(
          `http://localhost:1337/api/rent-requests?filters[rent_date_end][$eq]=${yesterday}&filters[status_request][$eq]=W`
        )
        .then((res) => {
          const requests = res.data.data;
          // console.log("requests", requests);
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
      //เปลี่ยนสถานะเป็น U
      await axios
        .get(
          "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=I"
        )
        .then((res) => {
          const requests = res.data.data;
          // console.log("requests", requests);
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
  // "41 18 * * *": async () => {
  //   try {
  //     const yesterday6day = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  //     await axios
  //       .get(
  //         "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=I"
  //       )
  //       .then((res) => {
  //         const requests = res.data.data;
  //         console.log("requests", requests);
  //         if (requests.length > 0) {
  //           requests.forEach(async (item) => {
  //             const body = {
  //               data: {
  //                 status_request: "U",
  //               },
  //             };
  //             if (
  //               dayjs(item?.attributes?.rent_date)
  //                 .subtract(6, "day")
  //                 .format("YYYY-MM-DD") === yesterday6day
  //             ) {
  //               await axios
  //                 .put(
  //                   `http://localhost:1337/api/rent-requests/${item.id}`,
  //                   body
  //                 )
  //                 .then((res) => {
  //                   console.log(res.data.data);
  //                 });
  //             }
  //           });
  //         }
  //       });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // },
  //เปลี่ยนสถานะเป็น W
  "* * * * *": async () => {
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
              // console.log(
              //   dayjs(item?.attributes?.rent_date).diff(dayjs(today), "day")
              // );
              console.log(
                "day diff :",
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
