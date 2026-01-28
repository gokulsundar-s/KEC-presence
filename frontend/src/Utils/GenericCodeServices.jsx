import axios from "axios";
import { baseUrl } from "./Constants";

let genericCodesCache = [];

export const getGenericCodesData = async (token, setLoading = () => {}) => {
  if (!token) return;
  setLoading(true);

  const response = await axios.get(`${baseUrl}/generic-codes`, {
    params: {
      pageNumber: -1,
      pageSize: -1,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.data.status === 200) {
    genericCodesCache = response.data.data.data;
    setLoading(false);
  }
};

export const getGenericCodeByType = (codeType) => {
  if (!codeType) return [];

  return genericCodesCache
    .filter((code) => code.codeType === codeType)
    .sort((a, b) => {
      if (a.codeDescription < b.codeDescription) return -1;
      if (a.codeDescription > b.codeDescription) return 1;
      return 0;
    });
};

export const getGenericCodeNameByValue = (codeValue) => {
  if (!codeValue) return "";
  const codeItem = genericCodesCache.find((code) => code.code === codeValue);
  return codeItem
    ? codeItem.codeDescription
    : codeValue.charAt(0).toUpperCase() + codeValue.slice(1).toLowerCase();
};
