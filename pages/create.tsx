import React, {useEffect, useRef, useState} from 'react';
import { useSession, signIn } from "next-auth/react";
import {upload} from '@vercel/blob/client';
import Layout from '../components/Layout';
import Router from 'next/router';
import {GetServerSideProps} from "next";
import {EventProps} from "../components/Event";
import prisma from "../lib/prisma";
import type {PutBlobResult} from "@vercel/blob";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query;
    let event = null;

    if (id) {
        try {
            event = await prisma.event.findUnique({
                where: {id: id.toString()},
            });

            event = {
                ...event,
                date: event.date.toISOString(),
            };
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    }

    return {props: {event}};
};


const CreateEvent: React.FC<{ event: EventProps }> = ({event}) => {
    const [title, setTitle] = useState(event?.title || '');
    const [location, setLocation] = useState(event?.location || '');
    const [description, setDescription] = useState(event?.description || '');
    const [date, setDate] = useState(event?.date ? event.date.substring(0, 10) : '')
    const [image, setImage] = useState(event?.image || '');
    const [eventURL, setEventUrl] = useState(event?.eventURL || '');
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);

    const { data: session, status } = useSession();
    const loading = status === "loading";

    useEffect(() => {
        if (!loading && !session) signIn();
    }, [session, loading]);

    if (!session) return <div></div>;
    if (loading) return <div>Loading...</div>;

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const body = {title, location, description, date, image, eventURL};
            if (!event) {
                await fetch('/api/event', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
            } else {
                await fetch(`/api/event/${event.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
                });
            }
            await Router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div>
                <form
                    style={{paddingTop: 100, color: "whitesmoke"}}
                    onSubmit={async (event) => {
                        event.preventDefault();

                        if (!inputFileRef.current?.files) {
                            throw new Error('No file selected');
                        }

                        const file = inputFileRef.current.files[0];

                        const newBlob = await upload(file.name, file, {
                            access: 'public',
                            handleUploadUrl: '/api/event/upload',
                        });
                        setBlob(newBlob);
                        setImage(newBlob.url);
                    }}
                >
                    <div className="p-16 pb-0">
                        <h1 className="text-white text-xl pb-2">Event Flyer</h1>
                        <input name="file"
                               className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 file:bg-gray-50 file:border-0 file:bg-gray-100 file:me-4 file:py-2 file:px-4 dark:file:bg-gray-700 dark:file:text-gray-400 max-w-sm" ref={inputFileRef} type="file" required/>
                        <button type="submit"
                                className="mt-6 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-teal-900 dark:text-teal-500 dark:hover:text-teal-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            Upload
                        </button>
                        {blob && (
                            <div className="pt-4 max-w-52">
                                {`Blob url: ${blob.url}`}
                                <Image
                                    className="inset-0 h-full w-full object-cover object-center"
                                    src={blob.url}
                                    width={100}
                                    height={100}
                                    alt={blob.pathname}
                                />
                            </div>
                        )}
                    </div>
                </form>
                <form onSubmit={submitData}>
                    <div className="p-16 pt-6">
                        <h1 className="text-white text-xl">Event Details</h1>
                        <input
                            autoFocus
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            type="text"
                            value={title}
                        />
                        <label>Location</label>
                        <input
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            type="text"
                            value={location}
                        />
                        <label>Description</label>
                        <textarea
                            cols={50}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            rows={8}
                            value={description}
                        />
                        <div>
                            <label>Event URL</label>
                            <input
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Event URL"
                                type="text"
                                value={eventURL}
                            />
                        </div>
                        <label>Date</label>
                        <div>
                            <input
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Date (YYYY-MM-DD)"
                                type="date"
                                value={date}
                            />
                        </div>
                        <div>
                            <label>Image URL</label>
                            <input
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Image URL"
                                type="text"
                                value={blob?.url || image}
                            />
                        </div>
                        <input disabled={!title || !location || !date} type="submit" className="rounded-md bg-teal-100"
                               value={event ? "Save" : "Create Event"}/>
                        <button className="back p-4 bg-red-700 rounded-md text-white" onClick={() => Router.push('/')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .page {
                    padding: 3rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                input[type='text'],
                textarea {
                    width: 100%;
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    border-radius: 0.25rem;
                    border: 0.125rem solid rgba(0, 0, 0, 0.2);
                }

                input[type='submit'] {
                    background: #ececec;
                    border: 0;
                    padding: 1rem 2rem;
                }

                label {
                    color: white;
                }

                .back {
                    margin-left: 1rem;
                }
            `}</style>
        </Layout>
    );
};

export default CreateEvent;
