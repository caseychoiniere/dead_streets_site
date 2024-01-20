import prisma from '../../../lib/prisma';
import {getServerSession} from "next-auth/next";
import {options} from "../auth/[...nextauth]";
import {session} from "next-auth/core/routes";
import {EventProps} from "../../../components/Event";

export default async function handle(req: {
    body: EventProps;
    query: { id: any; }; method: string; }, res: {
    status: (arg0: number) => {
        (): any;
        new(): any;
        json: { (arg0: { message?: string; error?: any; }): void; new(): any; };
    };
    json: (arg0: {
        id: string;
        title: string;
        location: string;
        description: string;
        date: Date;
        image: string;
        createdById: string;
        published: boolean;
    }) => void;
}) {

    // @ts-ignore
    const session = await getServerSession(req, res, options)

    if (!session || !session.user || !session.user.email) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const eventId = req.query.id;
    if (req.method === 'DELETE') {
        const event = await prisma.event.delete({
            where: {id: eventId},
        });
        res.json(event);
    } else if (req.method === 'PUT') {
        const {title, location, description, date, image, time, cost} = req.body;
        try {
            const result = await prisma.event.update({
                where: {id: eventId},
                data: {
                    title,
                    time: time,
                    cost,
                    location: location,
                    description: description,
                    date: new Date(date),
                    image: image,
                    createdBy: {connect: {email: session.user.email}},
                    published: true
                }
            });
            console.log(result)
            res.json(result);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error.message || 'Error creating event'});
        }
    } else if(req.method === 'GET') {
        try {
            const event = await prisma.event.findUnique({
                where: { id: eventId },
            });

            if (event) {
                console.log("GET",event)
                // res.status(200).json(event);
            } else {
                res.status(404).json({ message: 'Event not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching event', error });
        }

    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`,
        );
    }
}