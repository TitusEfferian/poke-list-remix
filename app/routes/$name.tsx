import { Alert, Badge, Button, Card, Container, Group, Image, Stack, Title } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

interface LoaderProps {
    name: string;
    sprites: {
        front_default: string;
        back_default: string;
    }
    types: {
        type: {
            name: string
        }
    }[]
}

export const loader = async ({ params }: LoaderArgs) => {
    const fetchData = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.name}`);
    if (fetchData.status !== 200) {
        throw new Error();
    }
    const fetchJson = await fetchData.json();
    return json(fetchJson);
}

export function ErrorBoundary() {
	return (
		<Container>
			<Stack>
				<Alert color={'red'}>
					Error
				</Alert>
			</Stack>
		</Container>
	);
}

const PokeDetail = () => {
    const pokeData = useLoaderData() as LoaderProps;
    const navigate = useNavigate();
    return (
        <Container>
            <Stack>
                <Card mt={'lg'}>
                    <Card.Section>
                        <Group position="center">
                            <Image
                                withPlaceholder
                                width={120}
                                height={120}
                                src={pokeData.sprites.front_default}
                                alt={pokeData.name}
                            />
                            <Image
                                withPlaceholder
                                width={120}
                                height={120}
                                src={pokeData.sprites.back_default}
                                alt={pokeData.name}
                            />
                        </Group>
                    </Card.Section>
                    <Stack>
                        <Title order={2}>{pokeData.name}</Title>
                        <Group>
                            {pokeData.types.map(x => {
                                return <Badge key={x.type.name}>{x.type.name}</Badge>
                            })}
                        </Group>
                    </Stack>
                </Card>
                <Button onClick={() => { navigate(-1) }}>ok</Button>
            </Stack>
        </Container>
    )
}

export default PokeDetail;