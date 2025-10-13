import { authorizedFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export default function useAuthFetchV1<DTO, OUT>(
  url: string,
  errMsg: string,
  convert: (dto: DTO) => OUT,
) {
  const [data, setData] = useState<OUT | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authorizedFetch("http://localhost:8080/api/v1" + url)
      .then((res) => {
        if (res.ok) return res.json() as DTO;
        else throw new Error(errMsg);
      })
      .then((data: DTO) => {
        setData(convert(data));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(url + err);
      });
  }, [url, errMsg]);

  return { data, setData, isLoading };
}
