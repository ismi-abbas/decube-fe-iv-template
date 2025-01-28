import { MovieDetails } from "@/lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export const getServerSideProps = (async (context) => {
  const { movieId } = context.query;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/3/movie/${movieId}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    }
  );

  const data = await res.json();
  return { props: { movieDetails: data as MovieDetails } };
}) satisfies GetServerSideProps<{ movieDetails: MovieDetails }>;

export default function Details({
  movieDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container mx-auto p-10">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <h1 className="text-3xl font-semibold">{movieDetails.title}</h1>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
              width={500}
              height={500}
              className=""
              alt="movie image"
            />
          </div>
          <div>test</div>
        </div>
      </div>
    </div>
  );
}
