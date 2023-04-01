import { Box, Card, Center, Image, Loader, SimpleGrid, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useFetcher } from "@remix-run/react";
import { useLoaderData } from "react-router";
import { useEffect, useState } from "react";

interface LoaderData {
  count: number;
  next: string;
  results: {
    name: string;
    url: string;
  }[];
}

const PokeList = () => {
  const poke = useLoaderData() as LoaderData;
  const [pokeData, setPokeData] = useState<LoaderData>(poke);
  const { ref, entry } = useIntersection({
    threshold: [0.25, 0.5, 1.0],
  });
  const fetcher = useFetcher();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (entry === null) {
      return;
    }
    if (entry.isIntersecting && fetcher.state ==='idle') {
      fetcher.load(`?index&next=${pokeData.next}`);
    }
  }, [entry, fetcher, pokeData.next]);

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      setPokeData((prev) => {
        return {
          ...prev,
          count: fetcher.data?.count,
          next: fetcher.data?.next,
          results: [...prev.results, ...(fetcher.data?.results || [])],
        };
      });
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "sm", cols: 2 },
        { maxWidth: "md", cols: 3 },
        { maxWidth: "lg", cols: 4 },
      ]}
    >
      {pokeData.results.map((x, y) => {
        if (y === pokeData.results.length - 1) {
          return fetcher.state === "loading" ? (
            <Loader />
          ) : (
            <Box ref={ref}></Box>
          );
        }
        return (
          <Card key={x.name}>
            <Card.Section>
              <Center>
                <Image
                  withPlaceholder
                  width={120}
                  height={120}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    y + 1
                  }.png`}
                  alt="Norway"
                />
              </Center>
            </Card.Section>
            <Text>{x.name}</Text>
          </Card>
        );
      })}
    </SimpleGrid>
  );
};

export default PokeList;
