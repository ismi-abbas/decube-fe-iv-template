import { fetcher } from "@/lib/api";
import { cn } from "@/lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const inter = Inter({ subsets: ["latin"] });

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Response {
  page: number;
  total_pages: number;
  results: Movie[];
  total_results: number;
}

export const getServerSideProps = (async (context) => {
  const page = 1;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/3/movie/popular?language=en-US&${page}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
      },
    }
  );
  const data = (await res.json()) as Response;
  return { props: { popularMovies: data.results.slice(10) } };
}) satisfies GetServerSideProps<{ popularMovies: Movie[] }>;

export default function Home({
  popularMovies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(popularMovies);

  // todo
  const {
    data: test,
    error,
    isLoading,
  } = useSWR(`/3/movie/popular?language=en-US&${page}`, fetcher);

  return (
    <>
      <header className="bg-sky-600 text-white h-20 flex items-center justify-center">
        <h1>Movie List</h1>
      </header>
      <main
        className={cn("min-h-screen flex flex-col p-24 gap-4", inter.className)}
      >
        <ul className="grid grid-cols-5 h-full gap-4">
          {popularMovies?.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </ul>

        <div>Page {page}</div>

        <div className="flex gap-2">
          <button onClick={() => setPage(page - 1)}>Prev</button>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </main>
    </>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="border flex flex-col justify-between">
      <Image
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        width={500}
        height={500}
        className=""
        alt="movie image "
      />
      <div className="flex flex-col p-2">
        <h3 className="text-xl text-gray-600">{movie.title}</h3>
        <div>{movie.popularity}</div>
        <Link
          className="border bg-indigo-500 text-white px-2 py-1"
          href={`/details/${movie.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
