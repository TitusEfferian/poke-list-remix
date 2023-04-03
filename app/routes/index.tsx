import { Alert, Anchor, Container, Stack, Text, Title } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import PokeList from "./PokeList";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("next");
  if (query) {
    const fetchPoke = await fetch(query);
    const fetchPokeJson = await fetchPoke.json();
    return json(fetchPokeJson);
  }
  const fetchPoke = await fetch("https://pokeapi.co/api/v2/pokemon");
  const fetchPokeJson = await fetchPoke.json();
  return json(fetchPokeJson);
};

export default function Index() {
  return (
    <Container>
      <Stack>
        <Title>Pokemon List</Title>
        <Alert color="yellow">
          <Stack>
            <Text>
              This is a simple Pokémon list fetch using the PokeAPI with the Remix
              framework.
            </Text>
            <Anchor href="https://github.com/TitusEfferian/poke-list-remix">https://github.com/TitusEfferian/poke-list-remix</Anchor>

          </Stack>
        </Alert>
        <PokeList />
      </Stack>
    </Container>
  );
}
