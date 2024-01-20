import React from "react"
import prisma from '../lib/prisma';
import Image from 'next/image'
import {GetStaticProps} from "next"
import Layout from "../components/Layout"
import Event, {EventProps} from "../components/Event"

function sortAndSeparateEvents(events: EventProps[]): [EventProps[], EventProps[]] {
    const now = new Date();

    const futureEvents = events
        .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= now;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pastEvents = events.filter(event => new Date(event.date) < now);

    return [futureEvents, pastEvents];
}

export const getStaticProps: GetStaticProps = async () => {
    let events = await prisma.event.findMany({
        where: {published: true},
        include: {
            createdBy: {
                select: {name: true, email: true},
            },
        },
    });

    // Convert date fields to serializable format
    // @ts-ignore
    events = events.map(event => ({
        ...event,
        date: event.date.toISOString(),
    }));

    return {
        props: {events},
        revalidate: 10,
    };
};

type Props = {
    events: EventProps[]
}

const Blog: React.FC<Props> = (props) => {
    const [futureEvents, pastEvents] = sortAndSeparateEvents(props.events);

    return (
        <Layout>
            <div className="hero">
                <Image
                    src="/ds_logo.png"
                    style={{marginTop: 60}}
                    width={200}
                    height={100}
                    alt="Dead Streets Wolf Logo"
                />
            </div>
            <div className="page">
                <main>
                    <h1 className="upcoming-shows-header text-2xl">Upcoming Shows</h1>
                    {futureEvents.map((event) => (
                        <div key={event.id} className="event">
                            <Event event={event}/>
                        </div>
                    ))}
                </main>
            </div>
            <style jsx>{`
                .hero {
                    background-size: cover;
                    background-position: center;
                    position: absolute;
                    top: 0;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 50px;
                }
                
                .upcoming-shows-header {
                    margin: 0 16px 8px 16px;
                }

                @media (min-width: 1024px) {
                    .upcoming-shows-header {
                        margin-left: 11%;
                    }
                }
                
                @media (max-width: 600px) {
                    .hero {
                        height: 200px; 
                    }
                }

                @media (max-width: 412px) {
                    .hero {
                        width: 100%;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .upcoming-shows-header {
                        text-align: center;
                    }
                }

                .page {
                    padding: 3rem;
                }

                .event {
                    margin-bottom: 1rem;
                }
            `}</style>
        </Layout>
    )
}

export default Blog
