import { authorizedFetch } from "@/lib/api";
import { useEffect, useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function useAuthFetchV1<DTO, OUT>(
  url: string,
  errMsg: string,
  convert: (dto: DTO) => OUT,
) {
  const [data, setData] = useState<OUT | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    authorizedFetch(`${baseUrl}${url}`)
      .then((res) => {
        if (res.ok) return res.json() as DTO;
        else throw new Error(errMsg);
      })
      .then((data: DTO) => {
        setData(convert(data));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [url, errMsg]);

  return { data, setData, isLoading };
}
