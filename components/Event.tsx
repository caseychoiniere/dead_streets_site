import React from "react";
import Router from "next/router";
import Image from "next/image";
import {useSession} from "next-auth/react";

export type EventProps = {
    id: string;
    title: string;
    location: string;
    description: string;
    eventURL: string;
    date: string;
    image?: string;
    createdBy: {
        name: string;
        email: string;
    } | null;
    published: boolean;
};

function formatDate(dateString: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayOfWeek} ~ ${month}/${day}/${year}`;
}


const Event: React.FC<{ event: EventProps }> = ({event}) => {
    const {data: session} = useSession();

    async function deleteEvent(id: string): Promise<void> {
        await fetch(`/api/event/${id}`, {
            method: 'DELETE',
        });
        Router.push('/')
    }
console.log(event)
    return (
        <div id="card" className="">
            <div className="container w-100 lg:w-4/5 mx-auto flex flex-col">
                <div v-for="card in cards" className="flex flex-col md:flex-row overflow-hidden
                                        bg-slate-950 rounded-md shadow-xl  mt-4 w-100 mx-2 opacity-80">
                    <div className="w-auto md:w-1/2">
                        <Image
                            className="inset-0 h-full w-full object-cover object-center"
                            src={event.image}
                            width={400}
                            height={100}
                            alt="Dead Streets Wolf Logo"
                        />
                    </div>
                    <div className="w-full py-4 px-6 text-white flex flex-col">
                        <h3 className="font-semibold text-2xl text-white leading-tight truncate">{event.title}</h3>
                        <p className="mt-2 text-lg">
                            {event.location}
                        </p>
                        <p className="mt-2 text-lg">
                            {event.description}
                        </p>
                        {event.eventURL && <a href={event.eventURL} target="_blank"
                                               className="mt-2 text-lg underline text-blue-300">
                            Event Page
                        </a>}
                        <p className="text-lg text-gray-700 text-white tracking-wide font-semibold mt-2">
                            {formatDate(event.date)}
                        </p>
                        {session &&
                            <>
                              <button
                                  className="bg-red-600 p-3 rounded-md my-2"
                                  onClick={() => deleteEvent(event.id)}
                              >
                                Delete
                              </button>
                              <button
                                  className="bg-green-600 p-3 rounded-md my-2"
                                  onClick={() => Router.push(`/create?id=${event.id}`)}
                              >
                                Edit Event
                              </button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;

