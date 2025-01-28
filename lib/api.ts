export const fetcher = (url: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
    },
  }).then((res) => res.json());
