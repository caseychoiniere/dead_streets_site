import {options} from '../auth/[...nextauth]'
import {getServerSession} from "next-auth/next"
import prisma from '../../../lib/prisma';
import {EventProps} from "../../../components/Event";

type NewEventResponse = {
    status: (arg0: number) => {
        (): any;
        new(): any;
        json: { (arg0: { message?: string; error?: any; }): void; new(): any; };
    };
    json: (arg0: {
        id: string;
        cost: string;
        time: string;
        title: string;
        location: string;
        description: string;
        eventURL: string;
        date: Date;
        image: string;
        createdById: string;
        published: boolean;
    }) => void;
}

export default async function handle(req: { body: EventProps; }, res: NewEventResponse) {
    const {title, time, cost, location, description, date, image, eventURL} = req.body;

    // @ts-ignore
    const session = await getServerSession(req, res, options)

    if (!session || !session.user || !session.user.email) {
        return res.status(401).json({message: "Unauthorized"});
    }

    console.log(req.body)

    try {
        const result = await prisma.event.create({
            data: {
                title: title,
                time: time,
                cost: cost,
                location: location,
                description: description,
                date: new Date(date),
                eventURL: eventURL,
                image: image,
                createdBy: {connect: {email: session.user.email}},
                published: true
            },
        });
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message || 'Error creating event'});
    }
}