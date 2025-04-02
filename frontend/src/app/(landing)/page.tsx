"use client"
import '@mantine/carousel/styles.css';
import {Accommodation, AccommodationType} from "@/models/accommidation/accommodation";
import {Card, Grid, Text, Badge, Button, Group, TextInput } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconSearch, IconStarFilled } from '@tabler/icons-react';
import useSWR from "swr";
import {PaginatedResponse} from "@/models/backend";
import httpClient, {restClient} from "@/lib/httpClient";
import Loading from "@/components/loading";
import {useAuthGuard} from "@/lib/auth/use-auth";
import {PagedResponse} from "@/models/http/PagedResponse";
import {RatingBadge} from "@/components/RatingBadge";
import {useMediaQuery} from "@mantine/hooks";
import Link from "next/link";

export default function Home() {
    const {
        data,
        error,
        mutate,
        isLoading
    } = useSWR<PaginatedResponse<Accommodation>>(`api/accommodations`,
        () => {
            return httpClient.get<PaginatedResponse<Accommodation>>(`api/accommodations`)
                .then((res) => res.data);
    });
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (isLoading) return <Loading />;
  if(!data) return <Loading />;
  if (error) {
    console.error("Error fetching accommodations:", error);
    return ;
  }
  const accommodations = data?.content;

  const categories = [
    { title: 'Trending Flats', type: AccommodationType.FLAT },
    { title: 'Luxury Houses', type: AccommodationType.HOUSE },
    { title: 'Cozy Rooms', type: AccommodationType.ROOM },
    { title: 'Unique Stays', type: AccommodationType.UNIQUE },
  ];


  return (
      <div>
        <div className="category-rows">
          {categories.map((category) => (
              <div key={category.type} className="category-row">
                <Text size="xl"  mb="md">
                  {category.title}
                </Text>

                  <Carousel
                      slideSize={{ base: '100%', sm: '50%', md: '33.333%', lg: '25%' }}
                      slideGap="md"
                      align="start"
                      slidesToScroll={isMobile ? 1 : 2}
                      dragFree
                      withControls
                      withIndicators
                  >
                  {accommodations
                      .filter(acc => acc.type === category.type)
                      .map((acc, index) => (
                          <Carousel.Slide key={index}>
                            <Card
                                p="lg"
                                shadow="md"
                                className="accommodation-card"
                                radius="md"
                            >
                              <Card.Section className="card-image-section">
                                <div
                                    className="card-image"
                                    style={{ backgroundImage: `url(test)` }}
                                />
                                <Badge className="rating-badge" variant="gradient">
                                  <IconStarFilled size={14} />
                                    <RatingBadge accommodationId={acc.id} />
                                </Badge>
                              </Card.Section>

                              <Group  mt="md">
                                <Text>{acc.title}</Text>
                                <Badge color="teal" variant="light">
                                  ${acc.basePrice}/night
                                </Badge>
                              </Group>

                              <Text size="sm" mt="xs">
                                {acc.address.city}
                              </Text>

                                <Button
                                    variant="light"
                                    fullWidth
                                    mt="md"
                                    className="quick-view-button"
                                    component={Link}
                                    href={`/${acc.id}`}
                                >
                                    Quick View
                                </Button>
                            </Card>
                          </Carousel.Slide>
                      ))}
                </Carousel>
              </div>
          ))}
        </div>
    </div>
  );
}
