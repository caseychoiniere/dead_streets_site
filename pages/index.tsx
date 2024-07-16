import React, { useEffect, useState } from 'react'
import prisma from '../lib/prisma'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import Layout from '../components/Layout'
import Event, { EventProps } from '../components/Event'
import Loading from '../components/Loading'

function sortAndSeparateEvents(
    events: EventProps[]
): [EventProps[], EventProps[]] {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const getEventDay = (event: { date: string | number | Date }) => {
        const eventDate = new Date(event.date)
        return new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate()
        )
    }

    const futureEvents = events
        .filter((event) => {
            const date = new Date().toISOString().split('T')[0]
            const eventDate = new Date(event.date).setHours(0, 0, 0, 0)
            return eventDate >= new Date(date).setHours(0, 0, 0, 0)
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const pastEvents = events.filter((event) => {
        return getEventDay(event) < today
    })

    return [futureEvents, pastEvents]
}

export const getStaticProps: GetStaticProps = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let events = await prisma.event.findMany({
        where: {
            published: true,
        },
        include: {
            createdBy: {
                select: { name: true, email: true },
            },
        },
    })

    // @ts-ignore
    events = events.map((event) => ({
        ...event,
        date: event.date.toISOString().split('T')[0],
    }))

    return {
        props: { events },
        revalidate: 10,
    }
}

type Props = {
    events: EventProps[]
}

const Home: React.FC<Props> = (props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleRouteChange = (url) =>
            url !== router.asPath && setLoading(true)
        const handleRouteComplete = (url) =>
            url === router.asPath && setLoading(false)

        router.events.on('routeChangeStart', handleRouteChange)
        router.events.on('routeChangeComplete', handleRouteComplete)
        router.events.on('routeChangeError', handleRouteComplete)

        return () => {
            router.events.off('routeChangeStart', handleRouteChange)
            router.events.off('routeChangeComplete', handleRouteComplete)
            router.events.off('routeChangeError', handleRouteComplete)
        }
    }, [])

    const [futureEvents, pastEvents] = sortAndSeparateEvents(props.events)

    return (
        <Layout>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="hero">
                        <Image
                            src="/ds_logo.png"
                            style={{ marginTop: 60 }}
                            width={200}
                            height={100}
                            alt="Dead Streets Wolf Logo"
                        />
                    </div>
                    <div className="page">
                        <main>
                            <h1 className="upcoming-shows-header text-2xl">
                                Upcoming Shows
                            </h1>
                            {futureEvents.map((event) => (
                                <div key={event.id} className="event">
                                    <Event event={event} />
                                </div>
                            ))}
                        </main>
                    </div>
                </>
            )}
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
                        margin-top: -26px;
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

export default Home
