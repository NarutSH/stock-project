import axios from "axios";

// const token =
//   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTgyNjM3NTA3LCJqdGkiOiI5MjNkY2RmZWQ2NDU0MTY2ODBiYWQ0MDIzYTE4ODA0YiIsInVzZXJfaWQiOjF9.4MHb7KQNVaVapf1yN8oDM2CccZrHzKxcjmX00Ns6Zk4";

export const stockApi = axios.create({
  baseURL: "https://investing.skycdpcrm.com",
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
});

export const getScanStock = async () => {
  const res = await stockApi.get("/scanstock-api");

  return res.data;
};
